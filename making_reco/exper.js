function* rng(i,i1,step=1){for(;i<i1;i+=step)yield i}
const noOp=(x=>x), rng0=(i,n)=>rng(i,i+n), n=o=>o.length, ss=s=>s.split(" "), withThis=op=>function(...a){return op(this,...a)},// seqZ=[].values(),
watch=o=>{
  const each=(g,f)=>{for(let x of g)f(x)}
  let x=new Proxy(o,{ //关于 Proxy 不是 in-place 监听的问题，可利用 prop(app).ref 这种也可以用 orig(e) 保存引用，我觉得语义性能上是比覆盖 property 好；覆盖可以作为po上的缓存
    get:(o,k,po)=>{ // func?
      let v=o[k]; if(typeof v!="function")return v
      let c=watch.mod[o.constructor];
      if(c.has(k)) if(watch.mod.addel.has(k)) {
        let fkset=c[k];
        return withThis((o,...a)=>{let [add,del]=fkset(...a);each(del,x.ondel);each(add,x.onadd); return v.apply(o,a)})
      } else {
        return (...a)=>v.apply(po,a)
      }
      else return v
    },
    set:(o,k,v)=>{ // notify?
      let f=o.kop[k],oldV=o[k];
      if(oldV===void 0)x.onadd(k); // add立刻del 了无所谓，但 del 后不能op
      if(v===void 0)x.ondel(k); else if(f)f(v,o); // 如果有 kop[k] 的情况下，我还以为 onadd 要先加kop呢...傻
      o[k]=v; return true;
    }
  })
  o.kop={}; o.onadd=noOp, o.ondel=noOp
  return x
},
ext=(T,o)=>Object.assign(T.prototype,mapV(o,withThis)||o),
mapV=(o,op)=>{for(let k in o)o[k]=op(o[k])},
addGet=(o,f)=>new Proxy(o,{get:f}), //如果知道有哪些键要转化，可用 defineProperty set 兼容实现代理，然后 $set 替代 o.k=v 支持 onadd
kCall=f=>addGet(f,(f,k)=>f(k,f)),
calcK=(op,o)=>addGet(o,(o,k)=>(k in o)?o[k]:(o[k]=op(k))), con=console
watch.mod=calcK(_=>(new Set).also(s=>s.f=(k,op)=>{
  if(!op)ss(k).forEach(x=>s.add(x))
  else {s[k]=op;watch.mod.addel.f(k)} // 自虐行为
}), {});

ext(Object,{
  let:(o,op)=>op(o), also:(o,f)=>{f(o);return o} //enumerable...
})
Newtype=(T0, fns, T=function(x){this.o=new T0(x)})=>{
  mapV(fns,withThis);
  const redir=f=>function(...a){return f.apply(this.o,a)},
  get=(o,k)=>{ let f;
    try { f=o[k] } catch { o[k]= Object.defineProperty(T.prototype,k,Object.getOwnPropertyDescriptor(o,k).also(c=>mapV(c,v=>typeof v!="function"?v:redir(v))));return}
    return redir(f) //o.__lookupGetter__(k)||o.__lookupSetter__(k) }
  };
  let p=(Object.assign(T.prototype,fns).__proto__=new Proxy(T0.prototype,{get}))
  let o=T0.prototype,k,c;for([k,c] of Object.entries(Object.getOwnPropertyDescriptors(o))){if(c.get||c.set)p[k]} //傻X行为
  return x=>new T(x)
}
M=Newtype(Map,{
  w:(d,v)=>d.set(0,v)
})
m=M()

watch.mod.addel
watch.mod[Array].let(T=> // 我艹，这 pop shift 在 V8 没事件(只改长度)，unshift 只是增长度…… 看来既定 op Set 对待法就根本有错，应该默认求索引差函数的
  T.f("splice", (i,N,...r)=>[rng0(i,n(r)), rng0(i,N)])&
  T.f("push pop unshift shift splice fill sort reverse")
)
mkA=f=>{
  l=s=>(...a)=>console.log(s,...a)
  let a=f([]); a.onadd=l("+"); a.ondel=l("-"); a.kop[0]=l("[0]")
  return a
}
a=mkA(watch)

/**
应对数据绑定，首先 push 要有 onadd(i) 的插入操作，接着a[i]初始化；删除时 ondel(i) ，不需再用 kop
sort reverse 不用看，肯定是基于 get&set 的无长度变更操作，默认兼容，但是 shift 这些就很关底层实现细节，不应该预期 Proxy 怎么样

应该说 Proxy 带来key上的事件是无所谓的，我们做的意义其实是按视图绑定规范化这种行为，哪位置变啥样单靠 set 事件，就等于没框架。

push: +n..+n1 无需监听
pop: -n
unshift: +0..+n 直接对应到 DOM 的 insert
shift: -0
长度变更都可自动处理

好奇怪啊，为什么 onins 必须得叫 add... 这样直接把索引维护映照到 DOM children 树

对 splice 等操作 onadd 的序是 LIFO 的，顺应 insert(firstChild) ，而 ondel 是 FIFO ；kop 的 diff 检测是积极断言，不保证更新时一定有差异（很平常的观点）

突然感觉自己好像精通人性的女讲师啊草…… DOM diff 这么高大上的术语，其实咱还没有弄整->零的真 seq diff ，但那个算法我也会写

关于 diff 的细节，首先是 POJO 的 deepEq ，这个对把更新高亮作为特性的应用很重要(但有点慢)，然后增量更新扩展个 array.load=splice(0,N,...a1) (默认会理解为整体删了又加相同长度，然后再初始化) 再把它序列 diff 下 ins/del (mod=同索引del+ins)集合就好了
我觉得这不是啥复杂算法啊（迫真）

然后 Proxy 对象是没有独立的 this 的，也没法在外面套一层，这让我动态 defineProp 来优化的想法化作泡影(所以说 wBind 接受二层引用而不是值就很灵性，啧)
 */
watch1=o=>{
  const each=(g,f)=>{for(let x of g)f(x)}, k_="*", k0=""
  let c=watch1.mod[o.constructor], ko
  o.kop=ko={[k_]:noOp,[k0]:noOp}; o.onadd=noOp; o.ondel=noOp
  return new Proxy(o,{
    get:(o,k,po)=>{ // func?
      let v=o[k]; if(typeof v!="function")return v
      let addel=c.get(k);
      return(addel===void 0)?v:
      (addel==null)?(...a)=>v.apply(po,a)
      :withThis((o,...a)=>{let r=addel(o,...a);each(r[1],o.ondel);each([...r[0]].reverse(),o.onadd); return v.apply(o,a)})
    },
    set:(o,k,v)=>{ // notify?
      let f=ko[k], oldV=o[k], isZ=oldV===void 0;
      if(isZ)o.onadd(k);
      if(v===void 0){if(!isZ)o.ondel(k);}
      else if(v!==oldV){(f? f(v,o):null)||ko[k_](k,v,o)||ko[k0](o)}
      o[k]=v; return true;
    }
  })
}
watch1.mod=calcK(_=>(new Map).also(s=>s.f=(k,op)=>{
  if(!op)ss(k).forEach(x=>s.set(x,null))
  else s.set(k,op);
}), {})

watch1.mod[Array].also(T=>{
  T.f("push fill sort reverse")
  T.f("splice", (_,i,N,...r)=>[rng0(i,n(r)), rng0(i,N)])
  T.f("pop", a=>[[], !n(a)?[]: [n(a)-1]])
  T.f("shift", a=>[[], !n(a)?[]: [0]])
  T.f("unshift", (_,...r)=>[rng0(0,n(r)), []])
})

a1=mkA(watch1);
lgOp=o=>addGet(o, (o,k)=>(typeof o[k]!="function")?o[k]:withThis((...a)=>{console.log(k,a);  return o[k].call(...a)}));
if(0)(_=>{
  a1.kop["*"]=console.log
  _.push(1,2,3)
  _.pop()
  _.shift()
  _.unshift(4)
  _.shift()
})(lgOp(a1))


/*
ptrXY=[0,0]; onmousemove=ptrXY.sets(clientX,clientY)
winWH=[0,0]; (onresize=winWH.sets(innerWidth,innerHeight))()
prop([]).notify.isHold=true

stop=timer("anim", T=>{}) //interaval,idle
timer.dt=500;
timer.fps=60
*/
