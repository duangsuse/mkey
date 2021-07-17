# Scan.js 草稿

scan 是第N次重写后变到 JS 上的解析组合子，也就是基于函数闭包组合的，文本识别框架啦；当然，其本质是处理序列模式，也可以做二进制数据体的读写任务。

不同于 Lex/YaCC 等“解析器编译器”或 PEG 等“语法树解析器”，这里只有一个——宿主语言，语法结构用其函数的重复与嵌套来表示。

```js
lrc=More(asAry,
  seq(Paired(squares, One(
    seq(eMap({ti:"title",au:"author"}),":",eStr),
    JoinEnd(asNum(60),":",(n,n1)=>n+fraction(n1),".", num)
  )), eStr, NL)
) // {'[' :map(ti:title,au:author)':'str | :joinEnd(':','.',num) ']' str}?

csv=join(NL,joinComa(One(num,eStr).tok("value"))) // :join(NL,:join(',', num|str)#value)

//whitespaces are skippen at in-stream level, if not in tok(value,etc)
```

scan 没有偶像包袱。它不会为了能读二进制而支持它、为能同时读写而去专门编程，一切只是水到渠成、自然而然，表现得要像 parser 只是主程序的附庸，不可喧宾夺主。

如果你用 正则 `RegExp` 或 `indexOf` 处理过文本，会知道它 `m.position, m[0].length` 或者 `slice` 算索引起来很麻烦，而解析组合子是由「拿掉前缀」的可组合解析器构筑的，它清楚自己在当前位置，最多能识别提取出什么数据；不会影响其它部分。

要令字串读取任务可分段到各拿前缀函数里，自然需要 流 stream 这个东西，基础设计是 `curC nextC() : Char` ，但 scan 的流框架很简单，只有三个：

- `feed` 支持在 string 上 slice：整数参数 +n, -n 意味 peek/consume ，0 则可以查 `FeedLoc(fpath,line,col,pos;peek(n_vp),err(msg))` ，它通过 fold_sloc 来可选的构造这种数据；包括读二进制时也不可能有行列号的概念
- `feedi` 支持 ES6 Generator 的 next() 接口，通过缓冲区实现 n!=1 的 `s(n)`
- `SkipWs` 是经常组织在二者之上的 _过滤流_，提供 `state/sIn`,`spans`,`wsBefore` 的额外接口
- 独立 `feedb` 支持 ArrayBuffer 上的 Data 流， +-n 意味调整 pos，而提供 feedb.int32 函数值则意味着在当前 pos 读取数值。

SOMe PJOIT
最重要的是 Seq/One/More ，当然，它们也必须组合字符单项 eIs,eIn,eStr,eMap 或 eAny,eIsnt 才能实现任务

- `SeqP(fold,...ps)` 按顺序读取，`Seq(...a)` 隐式 asAry 并支持把 str 参数自动盖为 `eIs`、在结果忽略它们，如果是 ("",p) (p,"") 的形式则仅回一项
- `One(...ps)` 读取第一个成功(`r!=null`) 项
- `More(fold,p)` 读取 `p` 直到失败，至少一个
- `eIs eMap` 支持直白的值表示法： `eIs("-", -1).or(+1)`，`eMap("abc",ss("A B C"))`
- `[p1,p]=eIsnt(p)` 的作用是同时定义字符否命题——没有 `not.eIn` 也不支持 `eIsnt("}")`，它会收集 p 构造时产生的目标集合并创建否命题。 eAny,eStr 的终结字符是从嵌套 __自动取得__ 的。

eIsnt 可以作 eNotIn 也可收非单字解析器，但那没啥意义。

P/J, O/I, Trie 也是十分有用的模式：

- `Paired(pr,p)` 代表 `(abc)`, `<WTF>` ，pr 只能是俩字串 `[s,s]` 形式
- `Join(sep,p,fold?)` 代表 `a,b,c` 而 `JoinP(fold,sep,fold0,p)` 能收集分隔符的信息

这两项构成 `Paired(squares,joinComa(num))` 的 `(1,2,3)` 模式

- `OpChain(p_atom,p_op)` 以逆波兰算符重排，将 `1+2*3` 形式输入转化为 `+ 1 * 2 3` 前序列表，左右优先级从1开始越大越靠底、越先求值，提供 `reduce(op_atom,op_join)` 来应用语义；它也有能力 `toList(["pre","post","in","sexp"][2])` 进行不同的形式转化；支持 `-+` 一元的优先级与括号
- `Indented(fold,p,{p_nlws,onInc(s,s0),onItem(ws,s0,v,a)})` 解析并检查缩进增量，依赖 `SkipWs` 的流全局状态表，收集 `nI>nI0` 的项目
- `Trie(ks_v).pat` 是共同工具模式，语言关键词、`::`, `+-*/% **` 等符号都靠它，它在读取时以压缩、断言单一后缀的形式优化效率

OpChain 的圆括号支持不是可选的，`wtf+()=>` 在JS这种愈发混杂的语言里也是无效的，逆波兰和转化法在 `Ops` 里公开，接口形似 `fold`，重实现不需3行代码

且它也支持 `o.name()`, `o is T` 形式的特殊右项中缀，`p_op` 的结果是 `[levL,levR,join,pR?]` ，这种带 `pR` 的情况相当于部分 case 左递归：`P 'a'|(',' P)`；`o is T+1` 会因为 T<+ 的低优先级而在后期发现 T+1 或 o is 1 的语义错误

举个例子， `-a.filter(x=>x<10).length` 前缀序是 `- . . a Call(filter,x=>x<10) Key(length)` ，这种表示法有趣的地方在于操作数的顺序都是对的，而且利用递归栈，可以避免创建 `[]` 的开销嗷！

……以上

递归模式也很重要： `DeferredP(p_self=>).provide()` 能从自体或缺失的另一个模式构造模式，从而允许循环引用。

P 次要组合上的工具： `top`,`greedy`,`concat(p,p1,op_both)`,`seeLeft(p0,p)`,`slicedTry/RE`,`chain(atom,Paren|Dot)->Ops`

scan 不会为能覆盖正则的表达力写些无用定义，`a{1,2}` 限数重复和 `\b|^|$` 都是可实现的，左递归也行（提供p_rec第一次不解析嘛），但考虑框架表现力带来的计算/行数开销，没必要为它们另做支持；实际上 `(.*?)` 自动匹配利用 `eStr` 等闭包局部的动态数据，~~在 `P.top` 里已能计算好~~ 其实在构造时利用副作用，里层提交外层修改就够了。

实际上，`pRE(/[a-z]/)` 可以用于测试分词、`P.sliceTry` 支持 `JSON.parse`，只不过正则不支持流式输入，它的算法对性能不利。

还有 `NumUnit` 和 `LexScope` 的模式没有介绍，对二进制相对重要的 union 和 enum 可用 seeLeft, eMap 得出、大小端或块对齐可用 `also` 切换，而 `BinChunkP(p_size,p) .lazy`, `BitFlagP(p_nat)` 和 `BinPoolP` 及 `BinStr .codec .cstr/n8/n16/n32`, `BinDate .unix`

有了 DOM 的 DataView ，我们不需要实现 byteOrder 的 Flip 或 Nat8 流->IntN 的读取、或者切分

Fold 是由 `()=>` 创建一个后可 `add(x)/done` 的序列归纳工具

- `asT(T)` 可以用于创建 AST 数据，比如 `class If{ctor(cond,a,b)}` ，前提是得有 `defCtorFun(If)`
- `SeqN(n,p, fold=asAryN(n))` 可用于解析 `\uXXXX` 这种模式
- asAry 相当于 asList ，简单地收集数据
- asNum(nd) 将多个数值/数位以 nd 进制拼合，比如 16 或 60 进制
- asMap 将多个 `seq(k,v)(s)==[k,v]` 变成 Map 对象
- asNone 简单地忽略输入
- `asIdx(idxs,n, fold=asList)` 选取部分的序号引用归纳 `fold`

而模式 `p` 上可用这些组合操作

- or(v) 相当于 `toOptional(v_default)`
- orOK 仅在 `More`,~~`Join`~~ 和 `eIs` 上可用，毕竟这些模式的可选形式可被猜到
- tok(k) 令 `SkipWs.spans` 记录下它的区间属于词条类型 `k` ，其内部的空格不会被跳过
- calm(v_empty,msgr,cs_conti?) 在没读到时利用 msgr 向流报错，将示错值 `v_empty` 交予父项，它会跳过直到 `cs_conti` 内字符
- need(v_p, msgr) 校验结果或报错
- showBy(op) 可用于一些难以直接再构造的数据（比如 `+123.5e11`）的直接回显，也可以覆盖 `eIs(",")` 的默认回显
- lets(op) 支持 pipe 函数或 equiv 关系，用于转化数据
- also(op,op0?) 在读取结束/起始时顺带执行动作
- merge/getNth(i,op?) 可以(正逆向)合并数组，或(仅正向)获取其某项应用 `op`

为什么叫 scan ？作者曾在许多语言尝试过不同的解析器实践法，设计过不同的字符流。之前弄了个没包好的 [ParserKt](github.com/ParserKt) ，它只读一遍流，也不能多字符预取，一切需要“回溯”“预读”的模式都变成“调用栈上存储”的小技巧；此库也是线性扫描输入，在栈上、语言内部可见地构筑嵌套结构，而在解析同时分词，反其道行之，故短名此四字。

scan 前身对正逆向解析的动词是 read/show ，二者组合则叫 rebuild ，其实这种同时定义二操作的术语叫 unparsing ，但我不愿意，于是它选择以二参代表 show ，`Equiv.map` 来以数据结构形式处理 string

ScanJS 和 equiv,propBind 很配呦。下面按实际序递增，谈谈从 parser combinator 侧看的 scanjs

>以下部分并不确定会出现在正式版里，可能只是待选择方案

## 容错、行号、空白注释、咋应用语义

Haskell 的组合解析库乃至其编译器实现 GHC，往往没有很好的允许输入多了/少了点什么，比如 `f(1,2,` 缺了 `)` 而 `{hello; ); world}` 多了个 `)`

对前者我们会在 () 语法区间结束时，默认补上适量并提错，后者会提错并跳到下一个 `;` 继续解析。

行号是以 feed 的 `fold_sloc` 和特殊增量值 `0` 提供的，默认可以没有

`SkipWs` 的空白注释规则默认是 C 风格 `\t\n\r\v\f /* //`，在每次 peek 返回结果前都会先应用一次 `pWs` ，存在 `wsBefore`，最后一次的 key 是 `P.EOF`

是不推荐内建 SyntaxTree 模型的，也没有 Visitor ，对于 if while for 等，`SeqP(asT(If),exp,blk,blk)` 的结果是 `If` 可以用其上方法遍历语法树，`OpChain` 的结果 `Ops` 上有 `reduce(op_atom,op_join?)` 为叶子(或构造 p_op 时结果是 id 而不是二元函数 join 的项)提供语义

如果要用内部 AST ，`Seq("If=cond a b", exp,blk,":",blk)("if(1)x:y").visit({If:t=>t.a+t.b, Blk:ts=>, Name:s=>})` 可以进行后序遍历。

## 运算符、修饰符、区分除法与 `/* //`

运算符利用 atom/op 的 interleave 交并读取和逆波兰重排，很清楚了。

`typeof` 等特殊前缀，因 scan 不会预分词，可兼容 `typeofx==typeof(x)` 的谜样形式，最好是利用 `P.concat` 式的预判处理 name/call/prefixOp 的区分，避免 Trie 模式尴尬

`in x` 等中缀也是一样，最好用 also 检查这种情况后是否有 `' '/(`

`public protected private` 等带修饰符成员的解析参考 `P.seeLeft` 带后空格，链条化，`fun` 等最终关键字时停止；实现上可以用 `{public:0x1, fun:FuncDef}` 的字典树来区分

ParserKt 只能 peek 单字符，所以 OpChain 里区分不出 / 和注释（甚至连 `*/` 的判定都麻烦），现在是能利用 `also` 去预判再交给 SkipWs 去跳过)，但现在 `feed` 模型支持预读，它可以用特殊右值化 `/` 的情况去跳过这两个的空格。

>有没有发现，LRC 的例子和 `public open fun` 的例子都需要在 fold 里后处理，一个是 takeWhile ，一个是 groupBy assignTo mainRes ，然后需右空格的符号可以用 `P.needWs` 检查

## 增量解析、部分解析、IDE 支持

`asPartial(N/p, f=>, asAry?)` 部分解析（如 JSON 数组的前 N 项）可利用 reducer 的异常实现

`ctx.marks[spans[i]].i=iBegin` 增量解析建议是基于方法花括号级的，重用既有的解析结果对象——这依赖编辑器的相应抽象和 `RangeMap`，部分区域重解析的范围和模式，包括输出都应是自确定的。

显然需要存储被跳过的空白、`//` 等供重新生成被重构的源码用。

scan 的解析策略是可配置的，它可以为 REPL 只读有用的，也能完整提取足以重构造输入的信息。

## 附录 复杂文法

[Simple calc](https://github.com/pegjs/pegjs)

```js
Exp = x0:EMul xs:(_ ("+" / "-") _ EMul)* {
      return tail.reduce((a, [_,op,_,x])=>
        (op == "+")? a + x :
        (op == "-")? a - x :a
      , x0);
    }

EMul = x0:Atom xs:(_ ("*" / "/") _ Atom)* {
      return tail.reduce((a, [_,op,_,x])=>
        (op == "*")? a * x :
        (op == "/")? a / x :a
      , x0);
    }

Atom
  = "(" _ e:Exp _ ")" { return e; }
  / Integer

Integer "integer"
  = _ [0-9]+ { return parseInt(text(), 10); }

_ "whitespace"
  = [ \t\n\r]*
```

比较犯规，我们有专门支持算符链

```js
opr=s=>eval(`(a,b)=>a${s}b`)
lngOps=ss("+ - * /"), op=(i,i1)=>(a=>[...a, a.map(opr)])(lngOps.slice(i,i1))
op(0,1)==[["+", (a,b)=>a+b]]

num=More(asStr,eIn('0','9')).lets(s=>parseInt(s,10), i=>i.toString())
exp=OpChain(num, opTab(
  op(0,2),
  op(2,4)
))
ws=More(asStr,eIn(" \t\n\r")).orOK

exp(SkipWs(feed(" 1 + 2*3"), {ws}))==7
```

[JSON](https://chevrotain.io/docs/)

```js
jvalue=DeferredP(v=>One(
  "null","true","false",
  jnum,jstr,
  Paired(squares, Join(",", v)),
  Paired(braces, Join(",",Seq(jstr,v),asMap))
)).provide(),
jnum=Seq(eIs("-").orOK, intP,Seq(".",frac).or(0),Seq(eIn("eE"),Seq(sig,frac)).or(1)),
sig=eIn("+-").or(1), // mapped later, to keep "explicit signed?" info.
intP=One("0", Seq(eIn("1-9"), digi)), // could use .also() later-check instead
digi=eIn("0-9"),
frac=More(asNum(10),digi),
jstr=Paired("\"", Seq("\\",One(eMap("\"nr\\ftb/"), Seq("u",SeqN(4,hex,asNum(16)))), eAny)),//[^\0-\x1F\x22\x5C]
hex=eIn("0-9","a-f","A-F")
```

[ES5](https://ohmlang.github.io/editor/#0a9a649c3c630fd0a470ba6cb75393fe)

```js
program=Seq(More(directive), More(elem)),
ws=One(white,NL, Seq("//",eAny,NL), Seq("/*",eAny,"*/")),
white=eIn(" \x0b\x0c\u00A0\uFEFF\u3000", "\u2000~\u200B"), //\vf nbSpace BOM
[notNL,NL]=eIsnt(eIn("\n\r\u2028\u2029")),
NLs=One(NL, eStrL("\r\n")),

Name=Ident.also((s,sIn)=>(s in reservedKw)? sIn(0).err(`${s} is keyword`) :0),
Ident=P.RE(/[\w$]([\w$,digit,cmbMark,connPunct,\u200c\u200d])?/),
uCat={
  Nl:eIn("\u2160~\u2182", "\u3007", "\u3021~\u3029"),
  Digit:eIn("\u0030".."\u0039" | "\u0660".."\u0669" | "\u06F0".."\u06F9" | "\u0966".."\u096F" | "\u09E6".."\u09EF" | "\u0A66".."\u0A6F" | "\u0AE6".."\u0AEF" | "\u0B66".."\u0B6F" | "\u0BE7".."\u0BEF" | "\u0C66".."\u0C6F" | "\u0CE6".."\u0CEF" | "\u0D66".."\u0D6F" | "\u0E50".."\u0E59" | "\u0ED0".."\u0ED9" | "\u0F20".."\u0F29" | "\uFF10".."\uFF19"),
  cmbMark:eIn("\u0300".."\u0345" | "\u0360".."\u0361" | "\u0483".."\u0486" | "\u0591".."\u05A1" | "\u05A3".."\u05B9" | "\u05BB".."\u05BD" | "\u05BF".."\u05BF" | "\u05C1".."\u05C2" | "\u05C4".."\u05C4" | "\u064B".."\u0652" | "\u0670".."\u0670" | "\u06D6".."\u06DC" | "\u06DF".."\u06E4" | "\u06E7".."\u06E8" | "\u06EA".."\u06ED" | "\u0901".."\u0902" | "\u093C".."\u093C" | "\u0941".."\u0948" | "\u094D".."\u094D" | "\u0951".."\u0954" | "\u0962".."\u0963" | "\u0981".."\u0981" | "\u09BC".."\u09BC" | "\u09C1".."\u09C4" | "\u09CD".."\u09CD" | "\u09E2".."\u09E3" | "\u0A02".."\u0A02" | "\u0A3C".."\u0A3C" | "\u0A41".."\u0A42" | "\u0A47".."\u0A48" | "\u0A4B".."\u0A4D" | "\u0A70".."\u0A71" | "\u0A81".."\u0A82" | "\u0ABC".."\u0ABC" | "\u0AC1".."\u0AC5" | "\u0AC7".."\u0AC8" | "\u0ACD".."\u0ACD" | "\u0B01".."\u0B01" | "\u0B3C".."\u0B3C" | "\u0B3F".."\u0B3F" | "\u0B41".."\u0B43" | "\u0B4D".."\u0B4D" | "\u0B56".."\u0B56" | "\u0B82".."\u0B82" | "\u0BC0".."\u0BC0" | "\u0BCD".."\u0BCD" | "\u0C3E".."\u0C40" | "\u0C46".."\u0C48" | "\u0C4A".."\u0C4D" | "\u0C55".."\u0C56" | "\u0CBF".."\u0CBF" | "\u0CC6".."\u0CC6" | "\u0CCC".."\u0CCD" | "\u0D41".."\u0D43" | "\u0D4D".."\u0D4D" | "\u0E31".."\u0E31" | "\u0E34".."\u0E3A" | "\u0E47".."\u0E4E" | "\u0EB1".."\u0EB1" | "\u0EB4".."\u0EB9" | "\u0EBB".."\u0EBC" | "\u0EC8".."\u0ECD" | "\u0F18".."\u0F19" | "\u0F35".."\u0F35" | "\u0F37".."\u0F37" | "\u0F39".."\u0F39" | "\u0F71".."\u0F7E" | "\u0F80".."\u0F84" | "\u0F86".."\u0F87" | "\u0F90".."\u0F95" | "\u0F97".."\u0F97" | "\u0F99".."\u0FAD" | "\u0FB1".."\u0FB7" | "\u0FB9".."\u0FB9" | "\u20D0".."\u20DC" | "\u20E1".."\u20E1" | "\u302A".."\u302F" | "\u3099".."\u309A" | "\uFB1E".."\uFB1E" | "\uFE20".."\uFE23"),
  connPunct:eIn("\u005F" | "\u203F".."\u2040" | "\u30FB" | "\uFE33".."\uFE34" | "\uFE4D".."\uFE4F" | "\uFF3F" | "\uFF65"),
  nl:eIn("\u2000".."\u200B" | "\u3000")
},

reservedKw=One(kw,willKw,"null",liBool),
liBool=One("true","false"),
kws=Trie(ss(`
for while do break continue
if else switch case default
function this var return
try catch finally throw
typeof instanceof in new delete
void with debugger`.trim())),
kw=kws.pat(),
willKw=ss(`class extends super enum const export import`),
willKw1=[...willKw,ss(`let yield static implements interface public protected private package`)],
lit=One(liBool,"null",liNum,liStr,liRE),

liNum=//支持 0x 和 eE 的见scanjs
liStr=//单双引号支持 \NLs 换行和 \x\u\0 与 \"'btnrvf
directive=liStr.or("")
liRE=// *\/[ class anyChar flags


wsLN=One(white,NL, Seq("//",eAny,NL), Seq("/*",notNL,"*/")),
space=One(ws,NLs), // ws contains comment
sc=One(
  Seq(More(asStr,space), One(";",P.EOF)),
  Seq(wsLN, One(NLs, More(ws/*cmt*/),wsLN, P.has("}")))
)

Atom=DeferredP(pr=>One("this",Name,
  lit/*re(source,flags)*/,
  Paired(squares, Join(",", pr)),
  Paired(braces, P.seeLeft(Join(",", Seq(One(liNum,Name),":",pr), asMap), r=>n(r)>0? More(","):noOp)), // add get/set?
  Seq("function",) //named Decl?
)).provide(),

optab=opTab(
  "",
  "typeof@ void@ ++@ --@ +@ -@ !@ ~@",
  "@++ @--",
  "new@",
  "( [ .", // call, getK, key; call(key)=callOn
  "* / %",
  "+ -",
  "<< >>> >>",
  "< > <= >= instanceof in",
  "== != === !==",
  "&","^","|",
  "&&", "||", "?",
  ss(`+ - * / % & ^ | >>> << >>`).map(s=>s+"=")
)
Expr=Join(",", OpChain(Atom,optab)),
Blk=Paired(braces,More(Stmt)),
Stmt=One(
  Blk,
  Seq("var", Join(",", Seq(Name, Seq("=", Expr).or(0))).must(a=>n(a)>0, ()=>`missing initizr`) ),
  Seq("if"),
  Seq("for"), // 3/in var?, expr no in
  Seq("while"),
  Seq("do"),
  Seq("return"),
  Seq("throw"),
  "break","continue" // label?
  Seq("with"),
  Seq("switch"), //case default:
  Seq("try"), // catch|-finally
  Expr/*Name-label:for?*/,";"
),
Decl=FunDecl,
elem=One(Stmt,Decl)
```
