/* 为引入 Equiv 最好还是搞 o[k]=o1[k1] 的同步更新关系
它是对 Eqv.pipe 和 fwd/backwd 的前导吧，显然为了兼容 array 数据还要有 push,pop 这种的更新

决定暴露接口为： prop(o).onmod.k=op .onadd=(ks) .ondel=(ks)
k 在写入时会触发 onmod ，同步设置文本，onadd 则会初始化新渲染，这是 from 方向 s->e
into 方向 e->s 也是设置 a[i] ，但注意这个关系实质是 rel(o,k, eqv, o1,k1) 比如 rel(t,1, fmt("%i: %"), es[1],"textContent") 就收获了内容相等的两个

这里有两个事件发射器，t[1] 和 es[1].textContent ，我们知道 DOMContentModified 用于侦测 isContentEditable 的变动，对「可侦听项」的建模，也可以应用事件防抖。

举例来说，如果我们的列表有添加操作， push() 时由绑定者来默认初始化，就是说 t 和 es 是 add/del 绑定的，会删元素、被删也会删数据，这方面封装上可支持 DOM 事件 inc/del=push/remove ，反正更新会重渲染、删除会同步
其实我们也可以用 react-id 的形式而不是 HTMLElem 引用，嵌套次序编号，显然这是要(和树遍历)先共同持有，再给改掉最高效

foods=ss("苹果 香蕉 蛋糕")
el("ul.food", ...foods.mapBind(el("li")))

对于具体实现， push pop 应用到 Proxy 对象就可以，而 a.shift() 时只同步删除(del K)，不必先 clear

t=prop(["hello","world"])
e=prop(es[0])
bind(t.k[0], fmt("%i %"), e.k.textContent)//.value 啊 .checked .date .num 啊

rev=prop({}).swap("name", cfg, "Helen"); show(cfg); rev();

啊又是个好孩子，估计不会有三十行。 scanjs 有了这家伙和 DataView 的 offset 计算支持二进制就完美了
*/

isFun=x=>typeof x==="function"
a=new Proxy([], {get:(o,k,p)=>{let r=o[k]; console.log(k,r);return isFun(r)?(...a)=>r.apply(p,a):r}, set:(o,k,v)=>{o[k]=v; return !console.log(k,v,"=")}})

a[0]
a.push(1)
a.pop();
a.push(2); a[0]; a.shift();
a.push(1,2,3); a.splice(0,2);
a.push(4,5); a.shift(); a.pop();
//没有想到会这么简单，我还以为要枚举 push pop unshift shift splice 等列表变动方法呢
//不过 splice 貌似先 clear 了再写入的，得弄成 del+add ， sort 和 reverse 就是 (all) ，fill(x,i0) 好像不需要

// 概念 API: prop(o) assign T.prototype={}, get_name= func-ref row-gets/sets/swap(ks,vs) mapK/V/KV(selector?) .k.name==(f)=>onmod/k0=init, onadd/ondel
// 好吧还是 .k.name.op, .opZ 和 .v 更方便存储，不然 f=>listen.push(f) 多不可配置也没易用
//见 base.js ，defCtorFun 等缩写也可能包含？