# Monkey 🐒关系式求解器

>简单、干净、不作做，语义先于文法的 200 行逻辑关系 __编程框架、解释器__，快速入门 relational 编程范式。

对 JS ES6 无硬性依赖，内联式语言、元编程 ~~`mk(x=>(x+1)*3=n, _=>ey)`*~~ 灵活切换码风，能学能用。

基于 _The Little Schemer_ 作者 Friedman 的 [MiniKanren](minikanren.org) 三基元：`State`,`var`,`goal(eq=,all&,one|)`

- 以更轻快的心情，学习比 Scala/Haskell 更小众的、被神化的技术内容
- 求值、逆推，只靠正反函数不够？ `mk.go((a,b)=>eq(sum(a,b), 8) )` 枚举全部关系可能性。
- 新语言类型推导 `<T,R> ap2(f:(T)->R, :Pair<A,T>): Pair<A,R>` 想了解细节？不想反着写代码？你可能需要学习关系式编程思想！

```js
concat={(a b s) //即 appendo
  b=s&a=[] | ->(x ra rs){ a=[x,ra]&s=[x,rs]&meet(ra,b,rs) }
}
plus={(b a c) // b 在递归中不改变，交换律
  a=0&c=b | ->(x ra rc){ a=1+ra&c=1+rc&meet(b,ra,rc) }
}
go.op["+"]=(a,b)=>c=>(mku.isNum(c)?plus:concat)(a,b,c)
go.opLev("+", 10,9) // 若同号右者优先级小，离四则运算根节点就近，更后求值
{
  a+1=3;
  1+a=4;
  ""+"hello"="hello";
  "correct"+"wrong"="wrong";
  s+"lo"="hello";

  a+b=8;
  "tesu"=a+b
}
```

提示：_这不是一个数学软件_，此等式属逻辑式，和方程/组并不完全一样，如果你需要解方程化简、多项式分析的代数软件，请移步 Desmos, Geoalgebra, Wolfram, funcplot, sympy, [graphEditor](https://csacademy.com/app/graph_editor/), [几何画板](https://www.dynamicgeometry.com/index.html) 等专业软件学习

*_不得不复用 `mk(_=>eval(_))` 闭包传递上下文绑定，因为 [隐式eval自ES5被禁止访问变量词法域](http://es5.github.io/#x15.1.2.1.1)_

## 亮点⭐

- 完全设计为 JS 子语言，作为 `mk.load(s)` 独立语言或 `mk(goal, _=>ey)` 内联查询(<abbr title="embedded">E</abbr>-<abbr title="domain specific language">DSL</abbr>)均可
- `st.go(goal_ctx,n_st1)` 的结果支持 `vals, next()` 查询，便利与完整，我全都要！
- 包含相当于 [microscopeKanren](http://www.adamsolove.com/microScopeKanren/) 的递归 tracer ，也能单步走过函数的应用
- 内部支持 `+-*/` 链的反向、`Equiv.pipe` 相等关系编程模型，`prop(o,"bind").k.onchange` 列表/单项-绑定关系，学术与实用兼具
- 支持扩充运算符表、支持左右结合的优先级、支持 `(c=>appendo(a,b,c))="wtf"` 自定义关系运算符
- 尽管所用算法皆“魔法”，代码表达却一点也不魔法！
- 秉承作者动苏的编程风格：一应用带一框架，公开同思潮 `mku` 独立工具包，可辅助 DOM 开发

## 关于 unification 归一化算法

>这是一个“神秘”的名字，它甚至一直没有常用的中文翻译，憧憬着CS(计算机科学)的人，多少次在[博](http://www.yinwang.org/blog-cn/2016/03/31/no-longer-pl)[客](http://www.yinwang.org/blog-cn/2013/04/21/ydiff-结构化的程序比较)和知乎看人轻描淡写地提及它，仅有名字。

_可惜，我们的心情得不到各路「大神」「学霸」「天才」的垂怜，被冗杂无要点的示范阻挡在理解的大门外。_ 我们错了吗？

数据结构是算法的目的，或者说伴生物，二者不能完全隔离；对于任何现有函数式/OOP 语言，归一化的伴生物 `State` 约等 `Map` 对象含 `unify(a,b); get(v)` 两操作。

`get` 是解引用深拷贝，让 `v` 和 `State` 间脱离关系，也称 `grab`；`unify` 或许能令两量满足 `isEq` 的等号条件，返回归一的值。

>归一化的要点在于，_任何地方(全局,数组内…)_ 的变量和 _任意类型(真假,数文,键值表…)_ 的值一样，是一等公民，__变量和值都是值__。

ES6 解构 `let [a,b]=pair` 后 `a=pair[0]`，它不能 `pair=[a,b]` 解构，毕竟 `[a,b]` 模式在等号分左右，解构或构造 语义上有别。

这仅类似能 `([a,b],i)=>` 递归构造的模式 matcher 「形 `cfg=>(o=>{})` 可组合子 的 `objOut.match({a:gets(0)}) ([2,6])`」

关系式上的等号是真的只有永远互等，没有 __缩写/保持留存/重赋值__ 的语义。

`unify(a,b)` 分三种情况，在 a,b 其一是变量时，只需赋值即得到相等；二者都是值则 `isEq(a,b)`，不等则失败；__都是变量也能像有边是值一样__ 单向赋值，毕竟 `get(v)` 里 v 可以是 value/variable 任一啊。

unify 结果的用途比如，`concat("","ok","ok")` 在递归中只需判断 ok=ok ，其没有外部变量，而 `concat(x,"k","ok")` 只需自头部，递归到尾部 'k'，解构出 `a=[x,ra]` 的链条即可。

### 基于变量关系的编程

关系式只引入了一个新概念，就是： __任何结构上都能含变量、变量也能像值一样，到处传递__

且为『变量』概念引入了仅仅一个 __基本操作：始终与值或变量相等的关系__，那么不等式 `x<5` 怎么办？显然能拆解为 `x=4,x=3, ...`，它被称为 goal __枚举目标__，而最最不能少的只有这一个『等号』

### 当讨论编程，我们到底在谈啥

>[不想看](#为什么这些问题很少人讲明白)

过程式流控，__顺序、判断、重复__，即顺序分支循环，`false&&console.log(1)`，`throw` 和 `yield` 及 `let,const,class,export`, 旧 `new function` 等结构声明和 `map,filter,sort` 函数式操作构成了现代 JavaScript。

杂七杂八的 `某er,某or` 和千奇百怪的 `Manager,Builder,Factory,Adapter,Handler,Middleware` 类/接口构成了「造人大师」  现  代 Java。

仅仅一个等号的交换性(symmetric)、传递性(transitive)、它构筑的自反性(reflexive,identity,强equality)就实现了 `mk(x=>append(x,"的","是的"))=="是"` ，但也只是某种「查询」而不含有写入输出的操作语义

关系式的 [新概念](#基于变量关系的编程)，是不是和函数式的“__带父层变量参数的函数__ 叫闭包，任何数据体都能含闭包、闭包能作为函数参数”有点像？

而面向对象的 Object ，是不是一个 `o.wtf(1) == send_o(:wtf,1)` (Ruby 自带 `Object.send`) 的闭包？

只不过对于建模不良的 Java ，它会暴露出赤裸的字段 field 而不是 `getX` property 而已。__对象就是能访问局部变量、从某段开始执行的函数闭包__

任何非 final 的方法动词都是虚的，「虚」意味着提供着兼容它的子类型对象(如 `new Runnable(){}`)，其行为、即方法版本是可不同的(override-n)，封装继承、抽象多态是 OOP 的四大重要特性，C++ 的 vtable 在对象内存上开辟方法指针区，Rust 的 fat pointer 同时持有数据对象和其上操作的函数们的表指针，OOP 的本质类似级联成员查找的 dict 结合先父后子的 new-construct/initialize 操作，`this` 主语的 .号 链只是最浅显的“顺语序”语法糖，关键在于易懂的组织与封装。

>汇编+编译器=结构化编程
+GC内存对象管理=面向对象/函数式
+unify&面向goal枚举State编程=关系式

__编程范式说到根本都是互通的__，只有其背后的 GC, coroutine, exception, 推导, 语法糖 等算法与数据结构，构成了它们真正的光彩。

学玩本项目的你，已经从 C/VB 和 Java/C# 的表述式或 OOP、Kotlin/Ruby/Py/JS 的定义式，辗转到 miniKanren 的描述式！

## 关于中缀链和 JS 合法化转译 解析器

对于 `{(a) a}` 和 `->(a b){}`，`subPaired(pr,dm,s,op)` 用于将其转化为 `(a)=>{const {me}=go; go.callee=f;}` 定义和 `puts((a,b)=>)` 调用，而对于中缀运算符，切分 `noSplitIf(p,re,s)` 和此算法：

```js
sP=[..."()"],
optab={
  ["+"]: [3, j("add")],
  ["*"]: [2, j("mul")],
  ["="]: [1, j("eq")],
  [...sP.map(k=>[k,0])]
}
reord=(xs,w,st=[])=>{
  let [sA,sB]=sP,
  save=x=>{let x1;
    if(x==sA) st.push(x); else if(x==sB) while((x1=st.pop())!=sA)w(x1);
    else return true;
  },
  close=()=>st.reverse().splice(0,n(st)).forEach(w);
  xs.forEach(x=>!(x in optab)?w(x):
    save(x)|| (n(st)&&l(x)<l(x1(st))? 0:close())||st.push(x)
  );
}
```

op-reorder 重排算法，这是大学编译原理的必学内容。我一直很害怕它难，而且我见过编译原理书里并没有提及逆波兰化。

其实就是 `!isOp(x)w(x) : save(x)|| (x<x1(st)? 0:close)||pu(x)` 的「*/ 大先逆出、+- 小后再出」逻辑，前序则「小先逆出、大后再出」并要重排参数

这不像 _LLVM Cookbook_ 中的[递归下降](https://github.com/ParserKt/ParserKt/blob/master/src/commonMain/kotlin/org/parserkt/pat/complex/InfixPattern.kt#L33)不能处理 &=| 即 2,3,1 序，它在 &= 时就断定右边走递归了…… 在 &= 2,3 时 `x>(xL=x1(st))` 故接较 =| 属 `x<x1` 故 close 出 =& ，含可传递性、简单 内存高效、被动状态转移，加上 `i%2==0? atom:op` 就能变流读取组合子，稍微用栈就能 reduce 出嵌套结构

## 为什么这些问题很少人讲明白

如果你看懂了，请尽情发掘一番吧，今后你看编程的视角又会增加一面；若你没看懂，请暂先读点别的，只要功夫深。

在那遥远的 1958 年，60岁+ 啊，Lisp 作为“研究人工智能的产物”诞生了，而 75 年 Scheme 诞生了，解决了 lisp 没词法作用域，全局、时序覆盖的命名到处冲突的问题。（也不说不能用吧，就是不符直觉、本质似C）

当然，我不喜欢学时尚圈去讲历史，那对技术没有裨益，所以我只说个人评判：

- Scheme 系的旧命名法， `procedurep=isFunc, pairp=isAry&&n==2` 将其「命题」类型后置，__太过自然语言化的命名对易读性不利__，尤其对非英语母语者
- 原版几乎没有任何注释——更别提你现在看到的大思路的纲领，其命名亦英语自造词化，它对数据模式的描述不尽清晰
- 尽管有 `syntax-rules`, `let v ([a b]) expr` 等语法糖展开特性和 `cond`, `lambda` 表达式等函数式优点，它毕竟是弱化「赋值」等副作用的语言——意味着许多利用 `if(p&&p1) ; else` 能紧凑表达的东西在一次次尾递归调用中与 `cons,car,cdr` 等「极简数据构解造」成为噩梦——冗杂性比回调地狱好点
- __任何语言相同算法的代码，按作者都有简繁之分__，无论作者有多聪明或多奇思妙想——因为只有你重视阅码的他人、重视不断回想的自己，用心才能真正写出易懂的代码，与「智商」无关
- 冗杂的「执行分期」，富于缩写的宏系统等会影响编程者心智模型的一致性，经常切换主次语言的思路
- __算法思想与语言无关__， ES6 的箭头函数与 destruct 尽管褒贬不一，在编写逻辑/算法密集型代码时会是合理排版的救星
- __认真推敲选词的 API 命名__，与许多版本的 `conj/disj/fresh` 或 `both/either/intro` 不一样，mkey 的 `all/one/puts` 长度均衡、用词倾向非严肃化，且为表达式提供了中缀形式

其实我也是看 Ruby [Hello Declarative World](https://codon.com/hello-declarative-world#unification) 整理复刻出的（_但别觉得这简单，有种你去看原文自学_），这里还是不得不佩服 Rb/Py/JS 系程序员的参差，真的是能上下都能让人眼界大开的圈子。

“Monkey 的用词和分组是全新独立设计的，只有 k->v,unify 等关键逻辑结构不可能改变”

## 顺便一提

>如果你不关心 Scheme 版实现，这里没有新内容

原版实现的 `walk,walk*` 都是因为其 `Map` 用 [k,v]pairs assoc 构成，要重写其单项，而 `unify/reify` 其二的含义相当于 `get+grab` （本版为简化逻辑，没有在前半片强制等号传递性）

本版相当于 39 行 [muKanren](http://webyrd.net/scheme-2013/papers/HemannMuKanren2013.pdf)，术语对照：

缩写侧：

符号|mky|muK
:--|:-:|:--
变量|k|u/x/v
取值|v|v
状态表|st/s|s
惰性流|s|$
操作|op/f|f
配对||"a/b"
字典|d|

mky 的缩写符合「常见化解释用长名、数学化用途用单字」的惯例。

```plain
mplus=eachNext=interleave,
mzero=[], unit=x=>[x], take=nextN
bind($,g0)=let ss=g0(s0),g=s=>[s] in eachNext(nextAll(ss).flatMap(s1=>g(s1)) )
^Finite DFS 惰性广度搜索，代码那么简单，名字这么高深
pull=Iterable->Iterator/pull, Scm has no Generator so.
assp/q=assoicated-p/q

State: call/fresh=vars&ofIter, fresh=puts,
  ext-s(x,v,s)=s.fork(x,v)
  walk(u,s)=s.get(u)
  walk*=walk-Extended=grab(not cached)
  run=ofIter, run*=of,

  cfg:var=eqSym[0],var?=isSym,[var=] not required(deref-ed in get(v))
  [≡] eq(a,b)
  disj=one, conj=all
  conde=map2D(one,all)
```

主要区别在于我们的基元操作除 unify/reify 外还分割出 isEq ，另外善用 `reduce((a,x)=>,a)` 操作， unify 的数据结构支持是数组/对象，不止 pair；`all`,`one` 的参数不止两个，也没有在结果上计数 `puts` 调用(全局的符号同名组自动编号)

流不一定是可归纳(有穷)的，所以我们允许按 `n_st1` 为单位继续查询，这是 API 的便利化设计。

和 miniKanren 相比，我们的 `fork(k,v)` 或 get 没有检查导致死循环/栈溢的递归引用 `occurs√`，因为正确编程不会出现这个问题。

### 扩展细节的大致实现

- `[a,ra]` 即 `[a,...ra]` 的匹配：
- `{a:1,_asObj:rkv}`
- `1+a*b` 的解构：
- `hex(256)`, `hex(i)="FF"` 等算符的解构：

`mk(_=>1+2*3)` 的结果是 `(var)=>states` ，如果遇到内容是函数的情况，mk 会默认其是 `mk(x=>1+2*3==x)` 并给出正向计算结果

>有论文那味了，话说 Py,JS,Lua,Java 重写的人怎么都那么<abbr title="这个冰冰就是逊呐（x">逊</abbr>，人家 30 行实现的你们搞 300 行，弄得像 Py 这些还没 Scheme 高级？

## 感谢

- 熬了两天调出一个中缀链解析器、想了两晚怎么在应用里掺更多元编程的 [duangsuse](#Monkey%20🐒关系式求解器)
- 发布 [Hello, declarative world](https://codon.com/hello-declarative-world) 的 Rubyist 及他对 mk.scm 做的简化
- 点醒了我，有逆波兰 op-reorder 算法的信息学/数理博主 [Xecades](xecades.xyz)
- 让我第一次见识到类 C++ 语言的 LLVM 编译器实战，从而更清晰看见类型推导与多态的，兴趣使然信息学博主 [Mivik](mivik.gitee.io)
- 坚持看到现在还没觉得无聊的你，__加油！__

## 链接

- [同类项目概况](picked-impl.md)
- [Webyrd's interactive mK lesson](http://io.livecode.ch/learn/webyrd/webmk)
- [blog of a Clojure ver](http://mullr.github.io/micrologic/literate.html#sec-5-2)
- [Sokuza Kanren](http://okmij.org/ftp/Scheme/misc.html#sokuza-kanren)
- [Y:microscopeKanren](https://news.ycombinator.com/item?id=8395079)
- [SF:Kanren](http://kanren.sourceforge.net/)
- [GH:tca/Veneer](https://github.com/tca/veneer) &[editor](http://tca.github.io/veneer/examples/editor.html) with `.demo`
- [quines generator](https://github.com/webyrd/quines)
- [Core.Logic Docs - Clojure](https://corelogicdocs.herokuapp.com/org.clojure-core.logic/clojure.core.logic)
- [parser combinator](https://github.com/duangsuse-valid-projects/Share/blob/master/HTMLs/school/js/scan_fin.js)
- [mk,equiv,propBind,scan 大提纲](making_reco/大提纲1.md)
