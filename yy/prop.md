# Prop快速属性与绑定、`el/emet/eeach`

对于靠 `defineProperty` 定义的 get/setter ，有时候即便有 ES6 的便利 `{get k(){}}` 语法也不太方便，这个库首先是支持定义单复数个，各类属性的。

```js
get_k_rv=1; //k=普通值, readonly; v代表可为值
set_k_veC=[get|v0, set]; //同时定义 getset 或仅追加 v0 的 set 逻辑, enumerable, 不可配置
set_k=(v0,v)=>v; //当然也可仅有 set
prop(doc).location/qs //正常访问，绑定函数
```

关心性能的人应该发现 `prop(doc).qs("body")` 实际上无需让qs自带this。只有确定类型上无副作用的动作不被监听和封装(只有f在proxy版this上调度才能监听变更)，否则语义上是兼容的(只是更慢)，如 `prop.nomod[Array].f("indexOf filter find")`

```js
let a=prop([1]);
a.kop[0]=con.log;
a[0]=2; a.splice(0,1);

a.ondel=(k,o)=>o[k+1]=o[k]; a.onadd=con.log;
a.shift();

let re, f=Equiv.add(5);
prop({a:1}).bind("*", o=>{re=RegExp(Object.keys(o).join("|"))})()
let o=prop({n:0}).also(o=>o.bind("n", o.ref.n1/*{onmod,v}*/, f )() )
o.n1; o.kop.remove(f) //删除首次 n->n1
o.kop.remove(f) //删除 n1->n 反向绑定
```

prop 还提供 (row-like 类似数据行的 gets/sets) `swap`,`tempval`; databind, shortcut for ref&prtotype-exts ，例如 `prop(o).swap("a b c")` ，这些全都支持 `Map` 对象

如果你需要 `o?.k ?? deft` 却发现语言尚不支持，`elv(v,deft)` 和 `elv.nul(1)(o.get)(con.log)` 与 `elv.nulR(o.get)(1)(2)` 可在结果或函数参数上模拟可选链

## el 元素树

```js
el(tag,...cee) [k]=e_copy,emet(ss,arg) _(s,init_scope),eeach(e0,key,a, pos,posa)
```

它们是 EQuery 展现侧的三主力，用于操纵、简写、模板
你不需要 React 系魔改 JSXML，因为层层括号已经足够。

el的tag可以是`el.NS`下的标签名、既存标签、`el[k]` ，k可保存创建函数或默认深拷贝；cee 首项可是 `wAttr,wVal,wColor,wSty,wCls,wAll,wBind` 等配置函数其中之一，其余是元素或string

或是 `wLabel`

`attr,style` 都可用 {} 或 "k1",v1, 的形式调用，支持简写 t,xywh 以及 pad,pado=margin,bg,bgImg

`wBind([], _=>wAttr("t",_.length+"个"))` 会在引用的 [] 更新时自动更新内文本="N个"
；__下层 wBind 若无参1 ，自动继承__

`el.input(wBind(prop({id:1}).ref.id, wVal))` 可见， wBind 支持根据后函数名是否 `onRef` 来决定传 `kop` (仅正梆)还是 `ref` ，或者直接收的是 ref 对象 `{v,onmod}`

`wC.cls("main").color("white on blue")(doc.body)` 或者 `qs("wtf",body).lets(wC.cls("yup"))` 也适合 JQ 用久的朋友，此小库也扩展了 `Node` 的 `tail=e|[es], parents(css?)`

关于 databind 的细节

- wVal、(wAttr 的 {t:""} 在 isContentEditable) 元素下支持反向
- 列表元素 `el.ul(wBindMap([1,2], el.li_input$hr(wBind(wVal)), Equiv.fmt("#%s")))` 的 push,pop,splice 可编辑列表
- 下层wBind是指参数括号内的，所以不能预先 let 设好

```js
`wCls("wtf",wSty("color":"white on black"))` //可以定义重用样式
let [title,cmain]=wSty`
color:blue; align:center
w:98%
` //也可便利定义样式
```

`el(":xxx")` 可以用来进行简写，如果参数2是元素，则被作为 ("a","b", 子项, "p","q") 式简写的容器，如可以简写多图文等
- a[src],img,abbr[title]
- select option
- detail description; figure figcaption
- ol,ul 含有无bind
- dl,ruby 与map
- meter,form,embed
- frag,root 等特殊标签
- cmt,cdata
- input file[accept] 啥
- 未支持 preproc,attr,text Node 因为不常用
- `el(":id", doc.body).wtf ==qs1("#wtf")`

简而言之，el[k] 可是 无参()=>, el(), "img[src=a.png]" ，尽管设置后都成为 f(...cee) 形式，它们分别代表每次生成、深拷贝、属性简写、emet 简写深拷贝 ，el("wtf") 相当于 el(el.wtf())

`el._img="src alt"` 则自动生成多参 wAttr _img

关于树相对位置，其实 wBind,eeach 都可以定在父节点“更快”地替换内容，但这会造成很大混淆，考虑计算的低重复量不应该过度设计。

eeach 和 bindMap 的区别在于，eeach 不预测列表总在变化也不反向绑定视图删除，它更适合分页等多次、大批量全更新的 UI 或缩写。emet 里它的语法是 `.ab (a[t=$x]+b[t=$y]):x,y("1 2;4 6")`
