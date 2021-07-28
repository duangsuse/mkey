//主要是prop+ext+swap/bind+ref ，可定复数,T原型,交下,kop remove和引用对象 ；常用 tail,parents(直到html>body) 和 qs+each/qs1 与 1/N 选的 lets
//bind得监听函数，swap,getsets 得 ks
//el扩展/NS=svg,emet 与 eeach的内部值-树路径查询；Equiv

//el先内定 _ id,a,frag 简写，有别于无参f、e/s 值； wCls 能定义样式表且并集类；wSty 能缩写 bgImg,bg,xywh,pad,pado 自动url/px单位
//wAttr的t支持检测反梆, wClsNS("mdui-") 和 wCls("btn",0,"mycls") 支持前缀缩写
//二者支持 {} 或 "k",v,[k1,v1] 的混合模式
//wOp.click((e,ev)=>{}, "-bubble bubbleNow default once", (e,evUp,ev0)=>{}) 支持事件配对和 wOp.of(e0).click.drop/enabled/fire

//CSS单标签 .# [] 乱序，空格或> + 有e0 ，逗号仅顶层可无e0或tail=; emRec(e0,s,d)；顶层也可是 body= a,b,c 的副作用模式
//<pre emet> 支持 {} 内联代码

/*
API冻结后发现 el.style:{[name,unit]} 最常见
emet 基于 e0 参数实现 >+ 的层次，顶层逗返回列表，下层的逗列不会检查
eeach 的 ins 对象支持 wOp 和 _前缀 wSty ，否则利用 toString 编号 {N} 属性/内文本
 */

n,ss,buildA,Newtype,defCtor/*comb getset,mapK*/,reduceTo0_,clearChild,wrapBy
div,range, deconcat,cycle,mkindexOf

withTemp//支持 Promise, 末调用o.exit()
//KRef 和 Ops 是 comb{o,k,onmod; v,prop:f? f(k_ks,...arg)}, Newtype[]
// 到时候 scanjs 有了还能支持 Array diff-partial replace 呢哈，buildA(wCls), wAttr((k,v,e)=>v+"1")(e) 也是可以
//wDrag,wDimWH, view,parent,page=client,offset,scroll Point/Area 也得有

el.NS_svg=f=>prop(el).withTemp("NS","svg",f)

el.NS_svg=(prop(el).ref.NS).prop.withEq.ap("svg")

Eqv.caps=[s=>s.toUpperCase(),s=>s.toLowerCase()]
Eqv.capitalize=Eqv.mapKey(0, Eqv.caps) //其他部分保持不变；如果要部分化数据可以：
//bo=Eqv.box(); bo.keep({a:add(1), b:o=>add(o.a)}, mapK.ap("id")) 把余键按id存下，from 后只剩下 id,a,b 键 into 时取id 合并出
//Let((evt,evT,evSrc,evn)=>, {t:target,...})

//elv,nulR,withTemp

//qs1,qs(css,e0,op?)

kSet=o=>propCall(k=>get_v1=>{if(o[k])o[k]=get_v1(o[k])}),
prop=o=>propCall({set:(o,sp,v)=>{ //kw:Meta
  let m=/([gs]et)_([^_]+)(_[Crev]*)?/.exec(sp), c={}; if(!m)return (o[sp]=v);
  let [_, mod,k,flg]=m;
  const fs=ss("configurable readonly enumerable value"); // get_k_v=1; set_k_v=[get|v0, set]; set_k=(v0,v)=>v; prop(doc).location/qs
  if(flg)for(let fl of flg.slice(1)){let i="Crev".indexOf(fl); c[fs[i]]=i<2? false:true}
  let v0, isF=isObj(v)&&isFunc(v[1]); //console.log(c,isF,flg,v)
  if(c.value) if(isF){c[mod]=v[1]; isFunc(v[0])?(c.get=v[0]):(v0=v[0]); delete c.value} else c.value=v; else { c[mod]=v; isF=true; }
  if(isF) { kSet(c).get(g=>()=>g(v0)); kSet(c).set(g=>(v)=>{v0=g(v0,v)}) }
  return Object.defineProperty(o,k, c)
},
  get:(o,k)=>isFunc(o[k])?o[k].bind(o):o[k]}, o)

prop(Object,{
  also:(o,f)=>{f(o);return o},
  let:(o,op)=>op(o),
  lets:(o,op)=>isAry(o)?o.map(op):op(o)
})
prop(RegExp,{
  replace:(re,sub)=>re[Symbol.replace](sub)
})
prop(String,{
  splitCond,
  condPSufix,
  ins,
  psufix,
})
prop(Function,{
  then:(f,...op)=>pipe(f,...op),
  onResCall:(f,run)=>(...a)=>{let r=f(...a); !isNon(r)? run(r,...a):run(...a); return r}
})
logs=f=>f.onResCall(console.log)

//el(tag,...cee) [k]=e_copy,emet(ss,arg) _(s,init_scope),eeach(e0,key,a, pos,posa)

const
clipbStr=s=>withTemp(doc.body.tail=el("input"), e=>{ e.value=s; e.select(); doc.execCommand("copy"); }),
clipb=clibStr.then()

//#查选择器的阴间做法 给爷整不会了

qs=(css,e0)=>(ePg=>{ePg.appendChild(e0); let r=ePg.querySelector(css); ePg.remove(); return r })(document.createDocumentFragment())

//matches 需厂商前缀 ms,webkit
parents=()=>{ // 不支持 detached(不在doc内) 元素和层级选择器，我草
  let e,e0, ee;
  while((e0=e.parentNode)!=null){for(ee of qs(css,e0))if(ee.isSameNode(e)) return e; e=e0}
  if(doc.querySelector(css).isSameNode(e)) return e//<body>
}

matches1=(css,e)=>{
  let r=doc.querySelectorAll(css);
  for(let em of r)if(em===r)return true;
  return false;//线性查法，不支持 removed
},
matches=(css,e)=>{
  if(doc.contains(e))return matches1(css,e);
  let ePg=doc.createDocumentFragment(), e0;
  while((e0=e.parentNode)!=null){e=e0} //抱歉，我们得支持层级选择器和逗号！(莫名其妙,qsa 不够么)
  ePg.appendChild(e);
  return matches1(ePg,e).also(_=>ePg.remove())
},

is_m=(css,e)=>{
  let e0,frag //真不知道控制流咋写的那么多变量还 while(frag&frag.firstChild)
  while((e0=e.parentNode)!=null){e=e0}
  if(e0 instanceof Document||e0 instanceof DocumentFragment){} else {frag=document.createDocumentFragment();e0=frag; e0.appendChild(e)}
  //for (let ee of e0.querySelectorAll(css))if(ee===e)return true
  var res=e0.querySelectorAll(css); for(var i in res)if(res.item(i)===e)return true
  if(frag)frag.clear();
  return false
}

//那还可以利用 doc.styleSheet addRule 或 qsa 给元素加 style.zIndex 啥的检测，在老环境比好多了
//我还以为是 e.parentNode 里 qsa contains e 呢，给这能耐
