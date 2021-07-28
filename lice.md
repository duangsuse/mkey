# Lice 解释器完整实现

>这里的完整是指，解析求值、转化文本、代码高亮都有实现，还有 AST-DOM 编辑

这两天肝关系式求解 mkey 和 EQuery 的一堆数据绑定啊 DSL 缩写啊累死，老久就想写个最小化但易懂的 lisp (sexp 括号表达式)系语言，索性拿 Lice 玩玩

其实 ice1k 实现它的初衷该是拿来写 IDE 和杂项语言工具支持，如 REPL 补全什么的；我这次也是为了展现 scan(原 ParserKt) 现在变得有多简单，物如其名。

众所周知 DOM 是不含树控件的，只能用 li ul 渲上去搞下来，数据绑定啊上面也说了比较麻烦，不过渲染/抓取还是简单点，就是要十几行。

## 语言数据模型

我是指语法树那层，相关生命周期有用到的数据，应该说 AST(语法树) 是和解析器实现强挂钩的(很多工具的数据暴露方法很硬)，但是 scan 的 fold 流归纳模型比较自由就只是纯纯 `[+, 1, [*,2,3]]` 的这种嵌套表了

实际求值就是 `reduce(o,...a)` 然后有一大堆 Primitive 函数，如 cond,def,undef 啥

平时用语法树 {} 主要就是为个名字，比如 if cond a b 啥的，注意树形是和数组对象啥无关，和语义也没硬关系，不是长个 `f(a,b)` 就是 apply 的语义，不要小看 Lisp 系，语义可以根据其子节点有变化的

语义啥？ `f(a,b)=(f).call(null,a,b); if(q,a,b)=q?eval(a:b); var(k)=scope.get(k); fn(ks,a)=(...vs)=>scope.enter().sets(ks,vs)&&eval(a)` ，调用判断变量抽象，+-*/ 都可描述为调用，if是方便结果值外有副作用的语义就像 `&`和`&&` 完整/部分求值，很明确了吧？

那如果把 scope 这类动态的东西转化下，比如预判 "x" 是几号参数(了的局部变量)、上层函数的局部量、全局量，再把四则访问调用啥的用求值栈存起来(`a b null "f" get .`)，加上 if break 等控制流，生成完整体二进制序列化一下，不就是编译器？ 

再看看 `o.f(a)` 是 `a "f" o self` 其中 `self=dup .k .` 重组为 `o=>.(o,.k(o,pop),...)`，这又是反编译？仔细看看同语言解释&编译+虚拟机有一大堆可复用的逻辑，说来说去就那一套。

有些同学觉得 a:Int 不递归不算节点(自己查下 DOM 有没有 AttrNode)，还有 YaCC/PEG 写多以为必先有语法树才有语义，或者常写四则计算器觉得不该有中间结构的，都好想下，语法层的数据和运行期其实没隔那么远。

然后我不喜欢做作，解释器的数据模型除了递归一点和UI应用没啥区别，也扯不到算法上树先后序遍历的那个树，语义先于结构，起名不带Node哦

原版支持三种调用-参数求值序。对于 `if` 这些结构，它都没有特别的树节点吧，毕竟 `defLazy f, f LazyBox...` 完全可以 handle 这个情况，只要看 `[f, ...a]` 中 `f.flag&F_lazy` 就惰性传参好了；同理 F_expr 放在 get 时被立刻求值的封装 Box 里就实现每次求值的传表达式语义 `(def lazy-if(q a b) (wake (cond q [true a][false b]) ))`

所以 `(cond o? [k v] [k1 v1])` 的这种不像(立刻先遍历子节点求值)调用的语法，用内部函数也能应用上语义，反正括号列表就 AST

当然 Box 叫 Block 也好，可原版是动态作用域的， block 块，这个美丽的名字还是让词法域，真能创建函数闭包 `just=k=>(_=>k)` 独有吧。

为省行数动态域实现为全复制，但我懒得给每层节点的 eval 去传字典参数，为副作用优雅性有 get,set,enter()=this,leave(v)=v 操作

动态域 `let in` 优化其实就是绑定块只设一次的特例，我先备份下旧值求值完恢复，那当然也可以在名字创建或覆盖时随时去弄(var 语句,无函级收集)，对应表都是可多次设置的

## 节省行数亮点

```js
re=f=>{let f1,run=x=>f1(x); return f1=f(run)}
re(f=>x=>x==0?0:f(x-1)+1)(32) //-+顺序别乱哦
```

递归模式用 `recP(self=> Seq("1",self)).give()` 或 `rec(f=>)` 都可实现，前者还能进一步切分、延后被引定义(循环引用调用时必须有1层代理，我只是暴露了符合性能的完整可能性)

`true false 1.0 ""` 这些的解析 `slicerP(JSON.parse)` 全包了，你可能不相信我的代码里这些常量都没有竟仍能写表达式(汗)

特殊的 `noWhite` 外套流保存 `span` 和 `wsBefore` 信息供高亮和保留格式重构，其 `tok` 非0时会提取空白前缀留至 `P.tok(T_NAME)` 的 `wsBefore[结果元素]` 里

```js
Seq=(...ps)=>(s,c)=>{
  c.n(w=>{ w(0); ps.forEach(p=>p(s,c)) }) // 实际更短 c.n(ps) 就够
  c.s(ps) // 略，默认无动作，无子项直接 throw 回到顶层，归纳
}
```

异常和副作用成为一函多用、甜语法的助攻

叶子节点是 `eIs,eIn,slicerP` 这种无子项的模式，`n` 是求文本长的操作而 `s` 写出，问如何避免第一次前/后序访问叶子即 throw 掉，其实 `run` 就是 `ps.endef()` 出来的，它能得到末端模式的构造计数；这是必要的框架性复杂度(另，扩展 Join(a,) 里 eAny 隐式 !=a 也是同样道理)

虽然用处不大 fold 也是以 `(acc=0)=>i=>isNon(i)?acc: (acc+=i)` 的这种三观不正的形式，而不是作形式构造器/class 定义的，它和 `feed` 动词少则略面向函数，放心我知道编程原则，懒得履行因为重点不在这。

## 最后

本来打算80行写完看来不太可能

Seq,One,More 解析器的用途好像就是修一下 `true-` 这些 JSON 不处理的非常量标识符

看原版有个 `toS(t,ni)=isTerm(t)?" ${t.user}":"\n${ws*ni}(${t.user}${t.children.joinBy("",tt=>toS(tt,ni+1)) })"`

我得想想回显操作是否应支持 indent 呢，呃


关于上面 Seq c.n 那些我本来也觉得会很方便，仔细想下只要保留最后求值的 `eIs` 引用就能判断是 throw 还是继续了嘛，可是这一层就开始有不优雅性(ps.forEach 得由框架层去做 要判函引用)

开始完全是按 `Seq(a,Seq(b,c),d)` 这种树去想的，后来发现是不是第一层得 catch 一个， c, d 项都得 throw 才能跳过主体的读取逻辑，那就要让 Seq 去记录末项目，而且还是个传递性问题，只要下级非末项会抛就得 catch ，而且这个信息最好是分离在 c 上

这就完全不属于组合子领域的东西了，蜜汁面向求值序编程；原则上低区别结构要特例设计就不该统一

我仔细考虑了 SOMe PJ 六大基础，只有 Seq,Paired 是会完整遍历子项的， More,Join 都是单项包装器， One 是按类型部分遍历的；其实这个技巧根本没有多少模式会用到，每个的都不一样。要知道树节点长相可以有很多种的

```js
Seq=ps=>(s,o)=>{
  pso=(w,f)=>ps.forEach((p,i)=>f(p,o.v[i]))
  if(o)if(o.n(pso)||o.s(pso))return;
}
```

这样可能会比较优雅，隐式的东西很少改着就方便； let, also 这种在回显时就没特殊操作咯，不看 o 也很合理

然后这样的程序结构如何类似 Visitor 树结构还能多操作，其实就是所有操作项的参2 `f(p,v1)={var old=o.v, r; o.v=v1; r=p(NO,o);o.v=old; return v}` 这样的非形式传参

ps.为性能old是由Seq这些预保存的，f只类似宏，`unfold` 负责从输出展开输入，是不是有 unification 的对应那味了

语言虽简单也有 `()[]{}` 多种括号支持，`lazy` 块也能化文本，我还想加 `a+b*c` 中缀链与 `run:` 缩进调用支持呢，有机会看。

## 迫真核心技术

- `runP(p,s,cfg={key:"sp n s",v})` 给组合子带来的 `(s,o)=>if(o)` 一模多用写法
- `calm(msgr), need` 带来的校验与镇定解析默认值(单项空结果是直回不报错的)
- `noWhite(s,p_ws)` 与 `.P.tok` 带来的(伪)分词器协作
- `feed(s,i)` 的单参正负预取流抽象与 `s.st("pq{",Array).push(s(0).sloc)` 组合子状态惰性共享表
- `rec(self=>` 的匿名递归
- `ext`,`calcK` 和 `Instype` 元编程
- fold/unfold 接口与 `asT("If q a b")` 数组包装和其结果 `.seen(f=>({If:{q,a,b}=>f(f(q)?a:b) }))`

以及一些比较实用的

- 可以解析 `int a =1; int w(){}` 与 `1.0e+12` 的 concat 与能区分读 fun/val 的 seeLeft ，还有能反向运行的 `mod(MembDecl, "flag",asOp("|"),eMap(modifiers))`
- OpChain 里 `for(x in(a))` Parned|needWs(Expr) ，`/*` 除号注释利用类似 `o is T` 兼容的“特殊右项”动态预判跳过
- `Trie().P` 常能在读2字的情况下断言 public, private, protected ，并非总是一次一字符
- __toS 带缩进__，按 wsBefore 仔细想想一般不就是 项1不加+项2及后 `\n$indent` 嘛，直接修好了利用 `key:s` 重显一次，或者变成 `[i,n,rep]` 的 sub 替换形式让用户去修
- ^然后就是那啥“顶级作用域函数的换行”，是说 `def if while` 的特殊规则吧(N-1, 2 参后开始换行)，不然就 `takeWhile{it is Name}`(firstIndex !Name addNL..)

## 高亮编辑器

首先问题是怎么让文本框分段有高亮，比较知名的 CodeMirror, [hljs](highlightjs.org), Ruby rogue 使用的都是 `<span>` 方案，很直白了吧，就是每词条(数字文本、关键字等)一个 style.color

如果你F12下鼠选会发现，它的 textarea 被 display:none 了，只是提供光标而已，然后你会发现整个渲染用DOM组成错综复杂，但无障碍啥的表现正常，呃……

不过你要知道 Monaco(VSCode) 右边的文档鸟瞰图就有点像各高亮区间不带字的，为什么不能直接从渲染的角度实现高亮呢？

首先咱没有那么多闲心处理 DOM span 们绑定的问题(而且如果完全重生成性能会很差,部分生成要diff麻烦)，参考 Firefox 的 `background:element(#id)` 特殊背景和 `-webkit-clip-background:text;color:transparent` 背景文本切边，咱选择为 现  代 Chrome 兼容这种特殊 canvas

WebKit 曾经是兼容 `-webkit-canvas(id)` 来把画布作为元素背景的，但也只有 Safari 还支持，所以这是个视察 CSS property 取值的 polyfill

- 如果兼容 `getCSSCanvasContext()`，直接取
- 收集所有引用，如果 `style.MozOrient`，把引用元素改成 `-moz-element(#id)`，否则在 `g.flush()` 时利用 `url(${g.toDataURL()})` 同步到引用

刚才实际做了 CSS Houdini 的 `background:paint()` 的工作，不过不需和 worker 通讯(说实话哪边画都一样，只需封送词条区间们)

这样我们就有了能 `flush` 的2D画布

### 度量

要从 span `[i,i1,tok, res]` 的前三项(起止+颜色)画出矩色块，肯定先要知道 i,i1 的文本是啥，再是它们的 y,x 位置。没有提供API，首先给定 textarea 的文本我们得知道其宽高

调查过 `g.measureText(s)` 画布 API，首先除非有高级字体度量(Electorn 没)，它仅能得宽度信息；其次它也不能 handle 换行符，也不知道自动折行参数(canvas 缺点)

显然不能用 `parseInt(N pt)` 这种粗略取高度，我们选择单实例 fake 元素(模仿) 和 offsetW/H 属性 __把选区对应到宽高__，这样不是高亮绘制期也能用同样的算法

编辑框异常简单 `Ed{i,i1,isI,mkI, setI,mvI("word",$Y), getset s, onI,onS}` 然后 mkI 是取消选区，`s` 是当前选中文本/替换(删除) ，比方说选中一行 `{setI("Line",$N);mvI("Line",$Y)}`(到行首&至行末)

对应 API `setRangeText`,`setSelectionRange`, `onclick/onselect` ，自动换行 CRLF `wrap` hard/soft `resize: none;` ，`doc.selection` 是 [IE6~8 专属](https://www.cnblogs.com/strangerqt/p/3745426.html)了，只能选择 `Selection/Range` 接口和 isContentEditable..

如果你要有内联变量预览啥的，除了(光标行)的高度还得有当前 x 位置，干脆在新函数 w,h,xy 一起算得了 (x=ww, y=h-hh, 这样也方便按百分比算ij)

具体绘制流程：

- 词条颜色可配置
- x 是横向靠词条 w 累积，y 则必须先选中一行，取行高(这样就没有先累积词条高再统一高度的问题了)
- spans 没有折行信息，累加行字符数，如果 `i>iLn` y就换行
- 相当于 `[xywh,color]` 的流，用 fillStyle=c;fillRect() 作画，整体完后 flush 下更新

文本变更=解析+绘制 ，现在我们有了带高亮编辑器

>另外，因为有 DataURL 的加持，实际上我们不多生成 HTML 地实现了静态代码高亮，只用CSS混成侧的接口

然后悬停查询的就相当于 y,x 映射回 i,j 行列号，~~临时移一下光标过去~~ 知道索引直接查词条就可以了

### 查询

编辑器有种常用功能是配对括号，Scheme 系都有高亮当前调用的外部括号的功能，它可以利用 `pairedIndex(s,i0,"()")` 开-闭计数实现，不过我们这里练习在词法意义上实现它

要查询最好有专门的数据结构。不难想像 span 集上给定 i 能得单项的，肯定称为 `RangeMap`，不过目前只有 guava 有。我写 PKT 的时间有设计一个基于 TreeSet 二分查找的区间映射表，移植一下

`RangeMap{set(i,i1,x), get(i)}`

这个 set 就是要 i,i1 有“侵犯”其他区间的情况，能把其他区间移一下(裁切)，未来实现增量更新有帮助。

更新时需要重建吗？如果当前区间是 /* 或多行字符串，从它的起始，否则直接从左侧空白~行首对齐spans[i]，再设都是可以的。

这样我们能拿到光标下词条的信息，要查其括号可以 `.tok(tw.NAME).also((r,s)=>r.iParen=s.st("pq(",Array)[-1])` ？

其实参考 Paired 默认 calm 的实现，只给 `)` 配对上起始就够了，光标下即时找 `)` 取其文法元素，且直到光标左跳到其开括前左 `)` 都不需更新高亮配对了

### 另外

这么说把，区间映射 `i..<i1` 就是转化为有序集的两个点，一条射线+一个端点，射线区间值v而端点值undef ；寻找时 `findMaxLE` 就能知道属于哪个区间了

所谓端点其实也是右射线(这条比喻来源于 maxLE 搜索)，在 `a~b:v, b~c:r` 里b:r添加时会覆盖 a~ 的端点(而端点却不能覆盖值)，但我第一次设计它是只考虑不冲突的情况(当时没想好覆盖还是咋做,比如保留内部区间..)

要解决冲突很简单，你想象下两个线段带先后覆盖的情况，添加 a 后若 b 点的 maxLE 不是 a ，移除它。再加 b 就实现区间遮盖了

不过这样 `a1~ a^b1~b` 那原有 a~b 就成空区间了，所以

- 冲突点是值的情况下，只将其移到 b 点
- 冲突点是端点，其前一位就是内含区间的值，内部区间全删掉 :P

于是整体逻辑：

- 插b=若位置无值添加b；插a=若位置无值改v否则添加； 冲突点=maxLE(b)若不是a
- 插a；若冲突点有值，不插 b 而右移它，否则删除全部冲突点，插 b

RangeMap 实现基于 TreeSet 的 `ceil` (最大不大) 类函数，找了下 [colljs](https://github.com/abhishek221192/Collectionjs/blob/master/collection.js#L619) 太长，[treeset](https://github.com/Kirusi/jstreemap/blob/master/src/public/tree-set.js#L395) 利用红黑树 800 多行封装复杂，[重写Guava](https://github.com/GaryLengkong/rangemap) 的明显是算法外行 O(N) 复杂度，最后 [这个](https://github.com/GaryLengkong/rangemap/blob/master/src/rangemap.ts) 的 [RBT](https://github.com/amejiarosario/dsa.js-data-structures-algorithms-javascript/blob/f69b744a1bddd3d99243ca64b3ad46f3f2dd7342/src/data-structures/sets/tree-set.js#L19) 实现太生硬，明显就是顺带了个 Bisearch Set 不懂职责隔离的

说实话 GH 上就没有多少结果，C++ 的又不能用

最后咱用 [bisect 实现](https://github.com/fukatani/TreeSet/blob/master/treeset.py) 替代的 OrderedSet (它比[同类](https://github.com/mlenzen/collections-extended/blob/master/collections_extended/range_map.py#L308)优雅)，然后在其上移植 [RangeMap](https://github.com/duangsuse-valid-projects/jison/blob/master/src/jvmMain/kotlin/org/parserkt/util/RangeMap.kt#L26)

然后为了让区间表增量更新更方便，它接收 `TreeSet(xs,key)` ，这样较易确定插入位置前的 span 是在哪i

编辑器用行列标识位置，后端用字符序号标识， `Ed{iLoc}` 单位互换 `iLoc=[5,10]="5:10"`

重复/拼合、移动行、注释 的便捷操作要绑定。

如果选择二层 RangeMap (增量解析时)也可实现插删操作的尾部 span 复用，取 i~i1 得(新插元素)或差量，更新时增进原有差量，比如 `ab^c d` 插入了 c 则其后 d 的差量就是 +1

scan 建议的增量解析是基于 `{}` 块级(计算机没你想的那么慢)，这样二层区间表能复用块+其长增减后面的部分

呀，[CM 出 6](https://lezer.codemirror.net/) 了，还带 full parse tree? ，我看看 scanjs 比比？

```js
si=eIs("-").P.or(1,-1), digi=eIn("0~9"), hex=eIn("0~9","a~f","A~F") //v 不得不预查错，因为 asNum 接收初始左数位太罕见，而且也不可避创建 More 解析对象
num=Seq(si, eIs('0').P.see((v,s)=>elvs(v,just)||(s(1)!='0')?More(asNum(10),digi):s.error("0?")).P.or(0), Seq(eIn("eE"),si,digi) ),
str=Paired("\"", One(Seq("\\",One(eMap("\\nrtfb/"), Seq("u",SeqN(4,hex)))) , eAny))
value=recP((o,a)=>One(eMap({true:true,false:false,null:null}), num,str, o,a)),
ary=Paired("[]", Join(asList,",", value)),
obj=Paired("{}", Join(asObj,",", Seq(str,":",value)))

value.give(obj,ary)
ws=eIn(" \n\r\t")
```

```plain
ws [ \n\r\t]
num (si int (. int)? ([eE] si digi*{asNum(10)})?{a=>a[1]*a[2]}){np}
str :pq(\", (\\(:map("\\nrtfb/",skst)|:N(4,hex){uni})|any)*{asJoin()})
value :rec(:map("true false null",kst)|num|str|ary|obj)
ary :pq("[]", :coma(value))
obj :pq("{}", :coma(str: value, asObj))
where
si :or("-",1,-1)
digi [0-9]; hex [0-9a-fA-F]
where=
kst k=>eval(k)
skst k=>eval(`"\\${k}"`)
uni a=>String.fromCharCode(parseInt(a.join(),16))
np ([si,n,nf,ne])=>si*n+(!nf?0: shrDot(nf))*(!ne?1: Math.exp(ne))
```

十几行语义都包了。

## Trie 字典树

是不是曾有 `o[k][k1].v=1` 的这种经历？字典树是典型的递归数据结构，描述为 `set(o,[k,k1],1)`

如果你想设计自动补齐，甚至是输入法，按前缀选取最好的方法不是 `filter(s.starts)` ，也是字典树！ scanjs 可利用字典树一次一字符判断关键字，降低预取字符数目和重试次数

和 `o.set("a.b.c",1)` 需取得 `a.b` 再 `o["c"]=1` 不同，分叉树的每个“末端”都可能扩展，所以不太适合节点[k]=v 的情况(除非惰性初始化)，而更适合令每个节点都能保存数据 `o[KZ]`

scan 用的是惰性单后缀扩展版的字典树，它不如 Radix 树省内存但很适合各种关键词复杂度的解析器使用。

为了性能用 Map 更好，首先你会想怎么写 class 好呢？可这里我们取个巧，只用递归函数实现 get,set,keys 操作！没有 this 而只有「某路径的 Map」

下面 Map 将简称为 d

- 惰性： set("ab") 时若 `d["a"]` 不是 Map, 将其变 `new Map([k,v])`
- 单后缀：若 `d; set("hell")` 后 `d.s=="hell"` ，再 `set("harm")` 后 `d.s==null`

不难发现， he, ha 在树根d 的既存子路径 "h" 创建了值。只要 set 访问了既存路径，清空其及一切父节点的 s 即可；否则可以在被创i保留 s=k.slice(i,n(k))
