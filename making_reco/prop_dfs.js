const testType=s=> o=>(typeof o===s),
[isNon,isObj,isNum,isStr,isSym,isFunc,isBool]="undefined object number string symbol function boolean".split(" ").map(testType),
isAry=v=>isObj(v)&&n(v), isNul=v=>v===null, isNun=v=>v==null,
Infty=Infinity, undef=undefined, NO=null, $Y=true,$N=false, noOp=(x=>x),
just=k=>(_=>k), isa=(T,x)=>(x instanceof T), div=(a,b)=>Math.floor(a/b),
n=o=>o.length, getR=i=>a=>(a[n(a)-1 -i]), fpull=get_fv=>{let r=get_fv();while(isFunc(r))r=r(); return r}, opr=s=>eval("(a,b)=>(a"+s+"b)")
ss=o=>[], not=qp=>x=>!x(qp), px=CSS.px||(n=>n+"px"),
_buildA=(n,op_w,op_a)=>{let inf=!isFinite(n), a=inf?[]:Array(n); inf? op_w(x=>a.push(x)):op_a(a); return a},
newA=(n,op,i=0)=>_buildA(n,NO,a=>{for(;i<n;i++)a[i]=op(i)})

once=(f,cache=NO)=>{ let f1,r,  d=cache;
  if(d) { let key=noOp,k;
    if(isFunc(d))d=[d];
    if(isAry(d)){if(isFunc(d[0]))key=d.shift(); d=key.name.let(s=>s==""? new WeakMap(d) : (once[s]=new Map(d))); }
    f1=(...a)=>{
      k=key(a),r=d.get(k); if(isNon(r)) d.set(k,r=f(...a))
      return r
    }
  } else { let ran=$N
    f1=(...a)=>{
      if(!ran){r=f(...a); ran=$Y;}
      return r
    }
  }
  return !isFunc(f)? f_=>{f=f_; return f1} : f1
},
orig=(me=>(a,b)=>!isFunc(b)?me(a,b):(r=>{me(a,r); return r})(b(a)) )(once(noOp,a=>a[0])), //chain,chain1
onResCall=(f,op)=>(...a)=>{let r=f(...a); !isNon(r)? op(r,a):op(a); return r},
pipe=(f,...fs)=>(...a)=>fs.reduce((r,f)=>f(r), f(...a)),
elv=(a,b)=>isNun(a)?b:a,
elvs=(v,...fs_v)=>{let l=v, vr=isFunc(getR(fs_v,0))?NO:fs_v.pop(); for(let f of fs_v)if(isNun(l=f(l)))break;  return elv(l,fpull(vr))},
promisy=f=>(...a)=>new Promise((res,rej)=>{try{f(...a,res)}catch(ex){rej(ex)}}),
withThis=f=>function(...a){return f(this, ...a)},
qkChain=(ks,o)=>{
  let i=0, N=n(ks), v=o; // support Node. e0, children[i], eL/R?
  while(!isNun(v)&&i<N){v=o[ks[i]]; i++} ks.i1=i;
  return v
},
qaChain=(o,k, v)=>{ let i=k.lastIndexOf("."); if (i==-1) {o[k]=v;return o} else {let o1=qkChain(o,k.slice(0,i)); o1[k.slice(i+1)]=v; return o1}},
(o,k,v)=>k.lastIndexOf(".").caseM1(()=>just(o)(o[k]=v), ()=>qkChain(o,k.slice(0,i)).also(o1=>{o1[k.slice(i+1)]=v}) )

expandK=(sk,fmts,ops=[id])=>fmts.map((sf,i)=> ss(sk).map(k=>sf.replace("%", cycGet(ops,i)(k)) )), // 布局简写侧
objPuts=sk=>{ let o={}; for(let k of ss(sk))o[k]=(v)=>{o[k]=v}; return o},
function* deconcat(a,N){while(n(a))yield a.splice(0,N)}
function* rng(i,i1,step=1){for(;i<i1;i+=step)yield i}
//cycle
cycGet=(a,i)=>a[i%n(a)], rng0=(i,n)=>rng(i,i+n)

by={ // 想做 by.cond("type", {norm:el(), img:el() }) 的惰性fn生成，和 cond({a:[o], b:[]}) 的先建再取不一样，转化 switch ；需要了解 free var 、覆盖 evalOn(el:) 语义 和利用 eval(by) vars ，不过 el 肯定会解嵌套一层丢失 wA 等的绑定..,
  args:(f,op_ps)=>{},
  fn:(a,s)=>Function(isAry(a)?a.join():a, s),
  keyCall:f=>new Proxy(f, {get:(f,k)=>f(k,f)})
}
mapK=o=>by.keyCall(k=>get_v1=>{if(o[k])o[k]=get_v1(o[k])}),
prop=o=>by.keyCall({set:(o,sp,v)=>{ //kw:Meta
  //assing,&proto
  let m=/([gs]et)_([^_]+)(_[Crev]*)?/.exec(sp), c={}; if(!m)return (o[sp]=v);
  let [_, mod,k,flg]=m;
  const fs=ss("readonly enumerable value configurable"); // get_k_v=1; set_k_v=[get|v0, set]; set_k=(v0,v)=>v; prop(doc).location/qs
  c[fs[3]]=true
  if(flg)for(let fl of flg.slice(1)){let i="revC".indexOf(fl); c[fs[i]]=i<3? true:false}
  let v0, isF=isObj(v)&&isFunc(v[1]); //console.log(c,isF,flg,v)
  if(c.value) if(isF){c[mod]=v[1]; isFunc(v[0])?(c.get=v[0]):(v0=v[0]); delete c.value} else c.value=v; else { c[mod]=v; isF=true; }
  if(isF) { mapK(c).get(g=>()=>g(v0)); mapK(c).set(g=>(v)=>{v0=g(v0,v)}) }
  return Object.defineProperty(o,k, c)//{k:c}
  //entries =
  //is. ext/seal/froze "Extensible Sealed Frozen" "preventExtensions seal freeze"
  //getDesc
},
  get:(o,k)=>isFunc(o[k])?o[k].bind(o):o[k]}, o)

prop.nomod[Array].fNot("push pop unshift shift splice fill sort reverse")
prop.nomod[Array].fIs("splice", (a,i,n,...r)=>[rng0(i,n(r)), rng(i,i+n)])//add,del(first!)

prop(Function,{
  ap:(f,...a)=>n(a)>=n(f)? f(...a) : by.args(f, (p,_)=>by.fn(p.slice(n(a)), by.args((...ar)=>f(...a,...ar), (_,s)=>s) )), // we don't support implicit currying, it's ambiguous.
  flip:f=>by.args(f,(p,s)=>by.fn(p.reverse(), s)), //^ 实际不可能不用 arity 存长度也不可能用 new Function ，对象不可序列化怎么办
  logs:f=>onResCall(con.log,f),
  if:(p,a,b)=>o=>p(o)?fpull(a):fpull(b)
})
prop(String,{
  insIfNone:(s,ki,ss)=>{
    const S=String.prototype,p=[S.startsWith,S.endsWith], op=[(s,b)=>b+s, (s,b)=>s+b]
    return (!p[ki].apply(s,ss))? op[ki](s,ss) : s
  },
  splitCond:(sep,op1,op2,limit=0)=>{ //(sp,op_nano,op)
    let iSep=this.indexOf(sep), ss0=this.slice(0,iSep),ss1=this.slice(iSep+n(sep));
    return (iSep==-1)? op1(this) : (limit==2)? op2(ss0,ss1) : op2(ss0/*[0:i]*/, ...ss1.split(sep,limit-1))
  },
  split2D:(s,sep,sep1)=>s.split(sep).map(r=>r.split(sep1)),
  replaceAll:(s,subst,re)=>re.lets().reduce((s1,gre)=>gre[Symbol.replace](s1,subst), s)
})
prop(Number,{
  caseM1:(n,a,b)=>fpull(n==-1?a:b)
})
prop(Object,{
  also:(o,f)=>{f(o);return o},
  let:(o,op)=>op(o),
  lets:(o,op=x=>[x])=>op(o),
  copyIfMissing:(o,k,k1)=>{ if(o[k]==null) o[k] = o[k1]; }
})
prop(Array,{
  lets:(a,op)=>isNun(op)?a:(n(a)==0)?undef: op(a[0]).let(v0=>!isNon(v0)?newA(n(a),i=>op(a[i]),1).also(r=>{r[0]=v0}) : a.forEach(op)),
  zip:(as,bs, op=(a,b)=>[a,b])=>as.map((a,i)=>op(a,bs[i])),
  clear:a=>a.splice(0,n(a)),
  mkindexOf:(a,x)=>a.indexOf(x).let(i=>i==-1? a.push(x)-1 : i),//con
  assoc:(a,op)=>a.reduce(asDict, x=>op(x)),
  assocBy:(a,op)=>a.reduce(asDict, (facc,x)=>op(x).lets(k=>facc(k,x))), // support 1N
  assocTo:(a,op)=>a.reduce(asDict, (facc,x)=>facc(x,op(x))),
  reduce:(old=>(a,op,init)=>n(op)==0? !isFunc(init)? op().reduce(a):Fold.use(op(),a,init) : old.call(a,op,init))(Array.prototype.reduce),
  reduceTo:(a,op_i0,join)=>{let r=op_i0(a[0]),i=0,N=n(a); for(;i<N;i++)r=elv(join(r,a[i]),r);  return r}
})
prop(Node,{
  popK:(e,k)=>e.getAttribute(k).also(_=>{e.removeAttribute(k)}),
  wrapBy:(e,get_e1)=>get_e1(e).also(e1=>{ e.replaceWith(e1); e1.appendChild(e);}),
  clear:(f=>e=>[()=>e.innerHTML=trustedTypes.emptyHTML, ()=>e.innerHTML="", ()=>{while(!!e.firstChild)e.removeChild(e.firstChild)}])(once()),
  set_tail:(e0,ea)=>ea.lets(e=>e0.appendChild(e)),//con
  parents:(fm=>(e,css)=>chain("parentNode", e).filter(e0=>fm.apply(e0,css)))(ss("webkit ms").firstRes(not(isNun), k=>Element.prototype[k]))
})
prop(Map,{
  getOrCalc:(d,k,op)=>{
    let v=d.get(k); if(isNon(v)){v=op(k); d.set(k,v)} return v
  },
  sameV:(d,k1,k)=>d.set(k1,d.get(k))
})

Newtype=(T0, funcs, T=function(x){this.o=new T0(x)})=>{//con
  for(let [k,v] of pv.a(funcs))funcs[k]=fAddThis(v);
  const get=(o,k)=>{ let f;
    try { f=o[k] } catch { f=o.__lookupGetter__(k)||o.__lookupSetter__(k) }
    return function(...a){return f.apply(this.o,a)}
  };
  Object.assign(T.prototype,funcs).__proto__=new Proxy(T0.prototype,{get});
  return x=>new T(x)
}
defCtorFun=(T)=>{
	globalThis[T.name.mapFirst(c0=>c0.toLowerCase())]=(...args)=>new T(...args);
}
function defineSetterComp(type, s_keys) {
	let ks = s_keys.split(" "), name=ks.map(k=>k.capitalize()).join(""); //TODO support copy, map_
	type.prototype["set"+name] = function compoundSetter() {
		for(let i=0;i<arguments.length;i++) this[ks[i]] = arguments[i]
	}
	function getChangePad(){
		let pad = {
			value: ks.map(k=>this[k]),
			map: (op)=>{ ks.forEach(k=>{ this[k]=op(this[k]) }); return pad }
		};
		ks.forEach(k=>{ Object.setLazy(pad,"map"+k.capitalize(),()=>(op)=>{ return this[k]=op(this[k]) }) })
		return pad;
	}
	Object.setLazy(type.prototype,"prop"+name,getChangePad)
}

class Fold {
	add(x){} done(){}
  reduce(xs){for(let x of xs)this.add(x);  return this.done()}
  static use(st,a,f){
    if(n(f)==1)return a.forEach(x=>st.add(f(x)))||st.done()
    for(let x of a)f(st,x);  return st.done()
  }
}
class Fold0 extends Fold {
	constructor(init,modify) { super();this._cat=modify; this.acc=init; }
	add(x) { this.acc=this._cat(this.acc,x); }
	done() {return this.acc}
}
class FoldTo extends Fold {
	constructor(get_init,accept,finish=noOp){ super();this._op=accept,this._done=finish; this.obj=get_init(); }
	add(x) { this._op(this.obj,x); }
	done() {return this._done(this.obj)}
}
class FoldToA extends FoldTo {
  add(...a){this._op(this.obj,...a)}
}
const [asList, asStr, asObj] = (function foldFuncs(){
	let newA=()=>[], push=(a,v)=>a.push(v);
	return [FoldTo.ap(newA, push), FoldTo.ap(newA, push, a=>a.join("")), FoldTo.ap(()=>Object.create(null), (o,[k,v])=>{o[k]=v})];
})();

qs=(init=>(css,e0,op=NO)=>{
  if(op) {
    qs(css).lets(op);
    const k="empty-anim"
    init(()=>{
      qs.hrefStyle(`@keyframes ${k}{}`); wOp.animationstart(evt=>op(evt))(window)
    })
    let sh=qs.sheet("qsEach")
    sh[qs.mkcss(e0)+css]=`animation: 0 ${k}`
  }
  else return e0.querySelectorAll(css).let(a=>n(a)==1? a[0]:a)
})(once())

qs.load=(isOK=>(f=>
  isOK? f() : doc.addEventListener("DOMContentLoaded",()=>f())
).also(fr=>fr(()=>{isOK=true}))  )($N)

qs.insertElem=(e1, place, e)=>{
  switch(place) { // 亦可利用 insertAdjHTML
    case "before": e.parentNode.insertBefore(e1,e); break;
    case "after": letsv(e.nextSibling, eR=>e.parentNode.insertBefore(e1,eR), ()=>e.parentNode.appendChild(e1)); break;
    case "in": e.appendChild(e1); break; //beforeEnd
    case "in0": letsv(e.firstChild, ee0=>e.insertBefore(e1, ee0), ()=>e.appendChild(e1)); break; //afterStart
  }
}

el=(tag,...ee)=>{let e=!isStr(tag)? tag:doc.createElement(tag), e0=ee[0]; if(isStr(e0))e.textContent=ee.shift();else if(e0&&!e0.nodeType)ee.shift()(e);  ee.forEach(ref(e).appendChild); return e}
//wAttr(t),wVal,wColor(w on black),wSty,wCls,wAll,wBind
//wC.cls("main")
el.styles=({
  x:"left",y:"top",w:"width",h:"height",
  pad:"padding",pado:"margin",
  bg:"background",bgImg:["background-image",s=>`url(${s})`]
}).also(o=>{ for(let k of Object.keys(o))if(k[0]!='b') o[k]=[o[k],px] })

timerRate=(dt,op)=>{ let id, once;
  (once=()=>{op();id=setTimeout(once,dt)})();
  return ()=>clearTimeout(id);
},
evFireNth=(e,evns)=>i=>e.dispatchEvent(new Event(evns[i])),
onEvPair=(e,pair,op0,op1)=>{let ev0;
  mapZip(pair, [(e,ev)=>{ev0=ev;return op0(e,ev)}, (...a)=>op1(...a,ev0)],
    (evn,op)=>evBind(e,evn, withThis(op)))
},

opEvCls=cls=>sel=>sel(getK_On(doc.head.classList)).map(f=> (e,ev)=>f.call(e,cls)),
selAddsCls=k=>[k.add,k.remove],

enablesStyle=(code)=>(e=>v=>(e.sheet.disabled= !v) )(doc.head.appendChild(el("style",code)) ),
styleCk=code=>wAll(wA.type("checkbox"), wEv.change(pipe(getK.checked, enablesStyle(code))) );


withClass = (...css)=>(e)=>{ for (let s of css) e.classList.add(s); }
wAll=(...conf)=>e=>{ for (let op of conf) op(e); }
withAttrs(kvs, key="style")

function emetAttr(e,s_attrs) {
	s_attrs.split(",").forEach(k=>k.splitCond("=",
	  e.ref("setAttribute"), (k,v)=> (k=="text")? (e.textContent=v) : e.setAttribute(k,v), 2) )
}
function emet_(css_single) {
	const ssyms = Object.entries({".": "className", "#": "id", "[":null, "$":null});
	let e;
	let s=css_single, iK1 = 0, vK1; // of last scanned marker
	for (let [k,v] of ssyms) { //v can turn to function onMarker(iK).
		let iK = (v==null&&k=="$")? s.length : s.indexOf(k,iK1); if(iK==-1)continue;
		if (iK1 == 0) {
			e = document.createElement(s.slice(0,iK)); // tagName first.
		} else {
			if (!!vK1)e[vK1] = s.slice(iK1,iK);
			if(k=="[") { // this cond can't be merged
				let iStop = s.indexOf("]", iK1);
				emetAttr(e,s.slice(iK+1, iStop));
			}
		}
		iK1 = iK+1, vK1 = v; // fresh value.
	}
	return e
}
function emet(css) {
	return css.splitCond(" ", emet_, (...items)=>{
		let eTop = emet_(items[0]);
		return [eTop,items.slice(1).reduce((e0,code)=>e0.appendChild(emet_(code)), eTop)]
	})
}

//each="a:b" key="textContent+href=$it:label" pos="e0.e0" posa="in"
function expandElem(e, opts) {
  let c=fillElemOpts(expandElem.opts,opts,e), willDel=false,
    e0=lets(c.pos,k=>{willDel=true;return qChain(e,k)},e), // 考虑到我们只能父节点尾新child语义不定，暂时不默认在 parent ；该去掉这什么乱 move node
    eCopy=qChain(e,c.repeat);
  lets(c.data, v=>{e.data=(typeof v==="string")?JSON.parse(v):v;});
  let
    orExpand=s=>evalTepl(s,e).split2D(" ",c.sep), // 能方便写单项
    vs=evalEq(c.each, e, orExpand), k=c.key.split2D(c.sep,"+");
  const // 今天才知道可以用系统自带的escape 不必改split
    setOrEval=(o,k, v)=>{ let kv=k.split("=",2),n1=(kv.length==1); qaChain(o,n1?k:kv[0], n1?v:evalTepl(kv[1], kv[1].indexOf("it.e")==-1? v: Object.assign(v,{eBase:e,e:o,e0,eCopy})) ); },
  setsProp=(e,v)=>k=>{setOrEval(e,k,v);}/*copy val for k.*/,
    assign=(eDst,v)=>(vs[0] instanceof Array)? k.forEach((r,i)=>{ r.forEach(setsProp(eDst,v[i])) }) : k[0].forEach(setsProp(eDst,v));
  vs.forEach(v=>{ assign(e,v); let e1=eCopy.cloneNode(true); insertElem(e1,c.posa,e0); })
  if(willDel)(c.pos==""?eCopy:e).remove(); else e[k]="";//since orig e modified.
}
expandElem.opts={pos:null,posa:"in", repeat:"", sep:":", data:null, each:null,key:"textContent"};
qs("[each]",NO, e=>expandElem(e,void 0));

if(transSVG){
  const sPre="url(\"#", xsr=(new XMLSerializer), url=u=>`url(${u})`;
  const toDataRef=v=>{
      let e = document.getElementById(v.slice(sPre.length,-"\")".length));
      if(e.src) return url(e.src);
  let xml = xsr.serializeToString(e);
  return url("data:image/svg+xml;base64,"+btoa(xml));
};//NOTE 可以选择 memo 缓存，但性质是后处理，内联svg不便跨页引用，本属hack实际没必要；亦可作 svg/a.svg 简写但适作预处理
procStyleSheet("bgsvg",c=>{let u;return !!(u=c.backgroundImage)&&u.startsWith(sPre)/*if(!!())只多2字符但会回undef*/}, r=>r.style.mapKey("backgroundImage",toDataRef));
}

function makeLoaderOp(type,fname){var o=new type(), f=o[fname]; return function loaderDispatch(){
  return(o.readyState==type.LOADING)? Promise.delayCall(arguments) :
    new Promise((ok,err)=>{ o.onload=(ev)=>ok(ev.target.result); o.onerror=err; f.apply(o,arguments); })
}; }

fileR=makeLoaderOp(FileReader,"readAsText")

Promise.also(P=>{
  P.callDelays={};
  P.delayed=function(create,dt_ms){return new Promise((ok,err)=>setTimeout(()=>create().then(ok).catch(err), dt_ms) )}
  P.delayCall=function(argv){return Promise.delayed(()=>argv.callee.apply(null,argv), Promise.callDelays[argv.callee.name]||200)}
})
redoByKey=(key, op)=>{ // split(' ') to support multiple key maybe?
  document.addEventListener("keydown", (ev) => { if (ev.key == key) op(); });
  return op();
}
{
  let docP = new DOMParser;
function xxerPromise(xx, init) {
  if(xx.readyState==xx.LOADING) return delayRetry(arguments);
  return new Promise((res,rej)=>{ xx.onload=()=>res(xx.result); xx.onerror=rej; init(xx); })
}
function delayRetry(argv) {
  let op=argv.callee,dt=delayRetry[op.name]||500;
  return new Promise((res,rej)=> setInterval(()=> op.apply(null,argv).then(res).catch(rej), dt) )
}
function makeRead(type,kind) {
  let fr=new window[type+"Reader"], opP=fr["readAs"+kind];
  return (f)=>xxerPromise(fr, fr=>opP.call(fr, f)); // no need, L299
}
let textR = makeRead("File","Text");

function iframeTo(eDst,s) {
  let eDoc=document.createElement("iframe");
  function copy(e,eDst) {
    for(let i=0;i<e.childElementCount;i++)eDst.appendChild(e.children[i]);
    //e.childNodes.forEach(ee=>eDst.appendChild(ee))
  }
  eDoc.onload=()=>{ let doc = docP.parseFromString(s, "text/html"); for(let k of ["head","body"]) copy(doc[k], eDoc.contentDocument[k]) };
  eDst.appendChild(eDoc);
  return eDoc
}
}

evalTepl=(s,it)=>s.let(decodeURIComponent).replaceAll([/\$(\w+)/g, /\$\{(.*?)\}/g], (_,m1)=>eval(m1)),
evalEq=(s,it,op_s=noOp)=>(s!=""&&s[0]=="=")? eval(s.slice(1)) : op_s(s)
fillElemOpts=(d_deft,d,e)=>{if(typeof d!=="object"||!d)d={}; for(let k in d_deft)if(!(k in d)) d[k] = elv(e.popK(k), d_deft[k]);  return d}

/**
  inbounds: (first,last, n) => first<=n&&n<=last,
  inboundsPN: (k, n) => maths.inbounds(-k, k, n),
  function assignAry(a, ...vs) { for (let i=0; i<a.length; i++) a[i] = vs[i]; }
function observeProperty(o, k, op) {
  let v = o[k];
  return Object.defineProperty(o, k,
    {get(){return v}, set(v1){v=v1;op(v1);}});
}

dim2.ts el()
 */
function ser(o) {
  function typed(obj, ...ks) {
    let res = {_type: obj.__proto__.name};
    for (let k of ks) res[k] = obj[k];
    return res;
  }
  o._type = o.__proto__.name;
  if (o instanceof Error) { return typed(o, "message", "stack"); }
  else { delete o._type; }
  return o;
}
function deser(o) {
  if (o._type == "Error") { let ex = Error(o.message); ex.stack = o.stack; return ex; }
  return o;
}

function PortServer(port, table) { // use runtime.connect(...[id?,{name}]) to get port
  port.copyIfMissing("sendMessage", "postMessage")
  let addRecv = (!!port.onMessage)? (op)=>port.onMessage.addListener(op) : (op)=>port.addEventListener("message", (ev)=>op(ev.data) );

  if (!!table) {
    function respond(data) {
      if(data.length!=3) return;
      let [no,k,args] = data;
      let res; try { res = table[k](...args); } catch(ex) { res = ex; } // dytype
      this.sendMessage([no, ser(res)]);
    }
    addRecv(respond); return;
  }
  let que = [], seqNum = 0, offsetL = 0; // client only!
  function send(k, args) {
    let dones, promise = new Promise((resolve,reject) => { dones = [resolve,reject] });
    if (que.every(it=>it===null)) offsetL = seqNum;
    //console.log(que,offsetL,seqNum)
    let iResp = seqNum-offsetL;
    if (iResp>=que.length) que.push(dones); else que[iResp] = dones;
    port.sendMessage([seqNum,k,args]); seqNum++;
    addRecv((data) => {
      if(data.length!=2) return;
      let [no,resp] = data; resp = deser(resp);
      let iResp = no-offsetL;
      if(que[iResp]==null) return; // sometimes dispatched for 2 times?
      que[iResp][(resp instanceof Error)? 1:0](resp); que[iResp] = null;
    });
    return promise;
  }
  return new Proxy({}, {get: (self,k)=>(...args)=>send(k,args)})
}

async function delay(ms) { return new Promise((resolve)=>setTimeout(resolve,ms)) }
PortServer(window, {add:(a,b)=>a+b, checkNot:(v,x)=>{ if (x==v) throw Error(`invalid ${x}`); } })
server=PortServer(window)
onload=async()=>{ console.log(await server.add(1,2)); server.checkNot(1,1).catch(console.log); console.log(await Promise.all([[1,2], [5,4], [1,3], [6,9], [1,1]].map(async(ns)=>{ await delay(100); return server.add(...ns) }) )); }
