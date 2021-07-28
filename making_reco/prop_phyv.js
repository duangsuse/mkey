/*
写着写着变物理命名法奔现了，我思量着暑假还要回老家拍视频呢，mkey+UI 本已是扩充计划，这又要做 phys/scanjs 等到何时去呢，mk 就没用过几个物理类型转化……

keys_1N 在 polyOp 和 eval(即get calcKVal) 的还没合并好，完了支持 ss,ns 自动定义
rng(_0,_1,step), ir nr 区间没有
fs,fp 文件系统没有（可惜对 js 的 f 还是不能默认成文件）
kbd_a1:aa 和 foldOnto 的 flat assocBy 没复制，polyOp 太重要

关于 pv.eval 实现就 evalOn(calcKVal(pv,), s) 的这种拦截pv[kOp]+在o上调用的问题

这还有个示例
append=(tag,e0)=>u=>pv.polyOp(u,
  s=>e0.tail=e(tag, s),
  fp=>e(tag,f(fp,"DataURL")).then(e=>e0.tail=e)
)
 */

// typecheck&physics naming, eval tricks
const
testType=s=> o=>(typeof o===s),
[isNon,isObj,isNum,isStr,isSym,isFunc,isBool]="undefined object number string symbol function boolean bigint".split(" ").map(testType),
isAry=v=>isObj(v)&&n(v), isNul=v=>v===null, isNun=v=>v==null,
Infty=Infinity, undef=undefined, noOp=(x=>x), div=(a,b)=>Math.floor(a/b),
elv=(v,v1)=>isNun(v)?v1:v,
nul=v=>op=>isFunc(op)?nul(isNun(v)?v:op(v)):elv(v,op),
nulR=v=>op=>isFunc(op)?nulR(elv(op(v),v)):elv(v,op);//=op@1st nul
/**
Physics naming
n Number,length
e Node
a Array
o Object
v !=null
n:+int, i:int, k:+, d:num

polyOp,eval,efun,wrap MetaProg funcs
check&convert is done once, no pre tests
*/
pv={
  n:o=>pv.polyOp(o,
    v_asf=>v_asf.length,
    e=>e.childElementCount,
    u=>u.size,
    v=>pv.opchk("positive&int",i=>Math.abs(pv.int(i)),Number(elv(v.length,v))),
    (d,Date)=>d.getTime()
  ),
  ss:s=>!isStr(s)?pv.a(s,pv.s) : s.split(" "),
  a:(v_naoe,op=null)=>(f=>pv.polyOp(v_naoe,
    n=>{let a=Array(n),i=0; if(!isNun(op)&&!isNul(f))for(;i<n;i++)a[i]=f(i); else for(;i<n;i++)a[i]=op;  return a},
    a=>isNon(op)? a.flat() : a.map(f),
    o=>Object.entries(o).map_(kv=>{kv[1]=f(kv[1])}),
    e=>[...e.children].map_(f),
    d=>[...d.entries()].map_(kv=>{kv[1]=f(kv[1])})
  ))(pv.op(op)),
  s:v=>pv.polyOp(v,
    e=>e.outerHTML,
    v_oa=>JSON.stringify(v_oa),
    v=>String(v)
  ),
  p:f=>pv.polyOp(f,
    f=>pv.argN(1,f),
    e=>e.matches(p),
    a=>x=>a.indexOf(x)!=0,
    (es,NodeList)=>e=>{for(let ee of es)if(ee.isEqualNode(e))return true;  return false},
    (xs,Set)=>x=>xs.has(x),
    (se,Selection)=>e=>se.containsNode(e),
    v=>x=>x===v
  ), // [], NodeList, Selection, any
  op:f=>isFunc(f)?f:isNun(f)?noOp:isStr(f)?Function("it",f.insIfNone(0, "it")):null,
  i1:a=>pv.n(a)-1,
  i:v=>pv.opchk("int", pv.int, Number(v)),
  k:na=>!isAry(na)?pv.opchk("positive",Math.abs,Number(na)):na[0],  dk:Number,
  v:va=>!isAry(va)?pv.opchk("!null", v=>isNun(v)?0:v, va):pv.eval(va,_=>n>1? _[1]:_[0]),
  aa:(a,shape)=>{
    let shapeD2=(a,fill=(r=>undefined),m=Math.max(...a.map(n)))=>{a.forEach(r=>r.push(...aryJust(fill(r),m-n(r))) );return [n,m]},
    eDiv2D=(a)=>el("table",...a.map(r=>el("tr",...r.map(x=>el("td",x))))), // 渲染侧
    aeDiv2D=(e,nm,zfill=doc.head)=>doAlso(ee(e).map(ee), a=>assign(nm,shapeD2(a,r=>zfill)) ),
    cfgCan=(e,eSvg)=>(w,h,el_k=1)=>{ let d={width:w,height:h}; assign(e,d); assign(e.style,d, v=>v*el_k+"px"); if(!!eSvg)assign(eSvg.viewBox.baseVal,d); }
  },
  m:a=>buildA(Infty, w=>{
    let aa; while(isAry(aa=a[0])){w(pv.n(a)); a=aa}
  }),
  j:a=>pv.m(a).map_(n=>n-1),
  c:(v_sfo)=>{ // config POJO,copy
  },
  d:(v_kno,vs=null)=>pv.polyOp(v_kn,
    ks=>new Map(isNun(vs)? ks : ks.zip(vs)),
    o=>pv.eval(o,"d(a)"),
    v_nv=>isNul(vs)? Number(v_nv) : Math.abs(pv.n(v_nv)-pv.n(vs)),
    undef=>new Map
  ),
  o:(v_oad,mode="pojo")=>polyOp(v_oad,
    o=>o, a=>Object.fromEntries(a), d=>pv.eval(d,"o(a)")
  ),
  e:(tag,mode="same")=>pv.polyOp(tag,
    s=>{}, // copy:html, #cmt, img'a'v'detail..
    ev=>ev.target,
    g=>g.canvas,
    e=>{} // copy,deep
  ), //img? canvas? rect?
  w:e=>{},
  h:e=>{},
  x:ev=>{},
  y:ev=>{},
  g:(e0,k_wh=5.0,z=1,ctx="2d")=>{},
  u:v=>v.href, // objurl

  l:pv.fun(_=>pv.eDir==1? w:h),
  int:Math.floor,
  eXYRel: "Client", //page,parent
  eWHBox: "content", //out,inn
  eDir:0,
  T:{
    O:Object,
    E:Node, Ev:Event,
    A:Array,
    N:Number, //parse,isFini
    S:String, //fromCodeP
    d:Map,
    F:Function,op:Function,p:Function,
    ex:Error,
    q:Boolean,
    g:CanvasRenderingContext2D, ev:Event,
    u:Blob, fp:File, re:RegExp, date:Date, sym:Symbol, // 噢突然发现，物理命名法还可以帮子程序生成示例……
    undef:undef, v:"!null"
  },
  abbr:{//删？ wrap ev_T:"timestamp" 缩写
    evt:pv.e,
    evt0:o=>o.srcElement,
    evT:o=>o.timeStamp,
    evn:o=>o.type,
    fpa:o=>o.absolutePath
  },
  orig:(v,v1=undef)=>pv.polyOp(v1,
    op=>pv.orig(v,op(v)),
    undef=>pv._dOld.get(v),
    v=>{pv._dOld.set(v1,v); return v}
  ),
  _dOld:new Map,
  _dPoly:new Map,
  foldDict: asMap,
  useChk: false,
  opchk:(s,op,v)=>{let v1=op(v); if(v1!==v) if(useChk)throw pv.ex("not "+s,v,v1); else return v1;},
  ex:(...a)=>pv.n(a)!=1?a : Error(a[0]),
  keys_1N:(s,op1,op=op1)=>s.startsWith("v_")? [...s.slice(2)].map_(op): op1(s, s.endsWith("s")&&pv.n(s)!=1),
  polyOp:(v,...fs)=>{
    const T=pv.T, primT={boolean:T.q, number:T.N, string:T.S,symbol:T.sym} //func,error,regex,date,map no require new() but no typeof
    //^ try dispatch'em to v, then o; undef/null/XXXNode handled
    let ctors=pv._dPoly.getOrCalc(fs[0], ()=>fs.assocBy(f=>{
      let ss=argNames(f),n=pv.n(ss); if(0<n&&n<3){ if(n==2)return globalThis[ss[1]] }
      else throw pv.ex("branch must be single-arg",f,ss); return keys_1N(ss[0], k=>pv.T[k])
    }).also(d=>d.sameV(null,T.O)) ), fver=ctors.get(isNun(v)?v: primT[typeof v]||v.constructor);
    // check ancestors
    if(isNon(fver))for(let [T,f] of ctors)if(v instanceof T){fver=f; break}

    if(!isNon(fver)) return fver(v);
    else throw pv.ex("unknown ver to dispatch", v,ctors);
  }
}
for(let s="xywhijnm",i=0,N=pv.n(s); i<N;i++)pv.T[s[i]]=Number;
for(let s="OEANSF",i=0,N=pv.n(s); i<N;i++)pv.T[s[i].toLowerCase()]=pv.T[s[i]];

pv=pv.orig(pv, o=>calcKVal(o, k=>{
  pv.keys_1N(k, (k,isList)=>{
    if(isList) !isStr(s)?pv.a(s,pv.s) : s.split(" ")
    let r;if((r=pv[k]||pv.T[k]))return r;//aa,op,i1
    else [...s].map_(op) //xy shorthand
  }, k=>o[k])//v_xywh
}))
pv.xy; pv.wh;

const
qsOne,
qsAll,
qsEach

// polyfill for flat,matches(moz/webkit MatchesSelector,stylesheet-checkEq,qsAll)

/**
el(tag,...cfg1_ee)
el("img","data:").then(e=>doc.body.tail=e)
el("detail","Yup?","Y")
el("span","hello world","Yup")
el("div",el("span",wColor("black","white"),"hehe"))
el(emet`div.wtf span[color=${"red"}]`, el("canvas",wRatio([300,200],25.0, 1))) //wh, style.wh, z-index
 */

// stream ops, Grouping, aux func
class GroupCnt extends Map {
  inc(k) {let i=this.get(k)||0; this.set(k,i+1); return i}
  incZ(v_0,k) { let v=this.inc(k); return v==0? v_0:v}
}
const onResCall=(f,op)=>(...a)=>{let r=op(...a); !isNon(r)? op(r,...a):op(...a); return r},
  promisy=f=>(...a)=>new Promise((res,rej)=>{try{f(...a,res)}catch(ex){rej(ex)}}),
  logs=f=>onResCall(f,console.log),
  Newtype=(T0, funcs, T=function(x){this.o=new T0(x)})=>{
    for(let [k,v] of pv.a(funcs))funcs[k]=fAddThis(v);
    const get=(o,k)=>{ let f;
      try { f=o[k] } catch { f=o.__lookupGetter__(k)||o.__lookupSetter__(k) }
      return function(...a){return f.apply(this.o,a)}
    };
    Object.assign(T.prototype,funcs).__proto__=new Proxy(T0.prototype,{get});
    return x=>new T(x)
  },
  fAddThis=f=>function(...a){return f.call(null, this, ...a)},
  reduceN=(n,op,x0)=>{let x=x0,i=0; for(;i<n;i++)x=op(x,i);  return x},
  callPull=op=>{let r=op();while(isFunc(r))r=r(); return r},
  tco=f=>{},
  rec=f=>f_ref=>{}

// Object manipulation with key list (row-like) swap,tempval; databind, shortcut for ref&prtotype-exts

//prop({n:0}).also(o=>o.bind("n", o,"n1", Equiv.add(5) )() ) 还想过和 gets 一样一次梆多个键的……黑历史

prop(String,{
  insIfNone:(s,ki,ss)=>{
    const S=String.prototype,p=[S.startsWith,S.endsWith], op=[(s,b)=>b+s, (s,b)=>s+b]
    return (!p[ki].apply(s,ss))? op[ki](s,ss) : s
  }
})
prop(Array,{
  zip:(as,bs, op=(a,b)=>[a,b])=>as.map((a,i)=>op(a,b[i])),
  assoc:(a,op)=>a.reduce(pv.foldDict, x=>op(x)),
  assocBy:(a,op)=>a.reduce(pv.foldDict, (facc,x)=>facc(op(x),x)), // support 1N
  assocTo:(a,op)=>a.reduce(pv.foldDict, (facc,x)=>facc(x,op(x))),
  reduce:(old=>(a,op,init)=>pv.n(op)==0? op().reduce(a) : old.call(a,op,init))(Array.prototype.reduce)
})
prop(Map,{
  getOrCalc:(d,k,op)=>{
    let v=d.get(k); if(isNon(v)){v=op(k); d.set(k,v)} return v
  },
  sameV:(d,k1,k)=>d.set(k1,d.get(k))
})
prop(Object,{
  also:(o,f)=>{f(o);return o},
  let:(o,op)=>op(o)
})
// Storage,Location bind
// Equiv(from,into) relation

// Ops rev-polish infix(&2->N merge, reduce)


// Trie seq-dict
TypeInst=()=>(d=>(...xa)=>{
  if(n(xa)>1){ d.sets(deconcat(2,xa)) }
  let r=d.get(x.constructor); if(!isNon(r))return r(x)
})(new Map)
tyExit=TypeInst();
tyExit(
  Element,e=>e.remove(),
  String,URL.revokeObjectURL)
//  bireplace:(re,sub,sub_out)=>{} 欸LPY是啥时候用的双边替换来着
