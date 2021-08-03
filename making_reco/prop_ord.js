//full definition ordering of EQuery
withThis, fpull,
_buildA, newA

O={let,also,lets}
testType,
isAry,isNun,isNul,
pv={n,s,ss, i1,x1,T:{O,E,A,N,S,F,Ev,ev,ex,op,p,q,undef,v:"!null"},opChk,useChk},
once,
onResCall,
withTemp,
Newtype,
by={keyCall(f){},calcK(f,o){},args,fn,opr,evalOn(o,s){},evalFree(s,on_k,gval){}},
objPuts,
Infty,undef,NO,$Y,$N,
div,isa,elv,just,noOp,
doc,con,win

pv.orig
by=by
pv.polyOp //assocBy

prop={gets,sets,swap,withVal,ref,defCtor,notify}//gset,ext
prop.mod
prop=prop

prop(pv.T.F,{ap,logs,promise,not,iff,flip})
pipe,elvs, $YN=f=>[f($Y),f($N)],
buildA,
rng,rng0,rngPN,next,cycle,deconcat,eachNext,
[rec,recP]=$YN(q=>f=>{let f1,run=n(f)==1?x=>f1(x):(...a)=>f1(...a); if(q)run.give=fr=>(f1=f(fr||run)); return q?run : f1=f(run)}),tco,nextN

prop(Equiv,{noOp,map,get_flip,get_fwd,get_backwd})
Equiv={pipe,run,opr,add,mul,json,caps,caps0,fmt,join,each,html,xml/*domS*/,obja,dicta}
if(0){
  let b=prop({a:1}).notify
  b.bind("", con.log)()
  b.bind("*", prop(window).ref, Equiv.add(2))()
  prop({}).ref=={o,k, v,onmod, mapV,prop}

  new Equiv(x=>x+1)
  eqInput=eqv=>{let ei=f=>el.input(wOp.change(e=>f(e.value))),
    a=[ei(v=>e2.value=eqv.from(v)), ei(v=>e1.value=eqv.into(v))], // bidir convert E-E bind, so no wVal
    [e1,e2]=a; return a
  }
  let o=prop({v:0})
  el.input(wBind(o.ref.v, wVal,eqv)) //1->"1" from
  el.input(wC.bind(o.ref.v, wVal).a({type:"number"})) //1->1

  function obj2a(o) { let a=[]; for(let i=0,inSq=false;;i++)if(i in o)a.push(o[i]); else {if(inSq)break;else inSq=true}  return a} // conti- k=i range
}

prop(pv.T.S,{split2D,splitCond,psufIfNone,replace/*re*/,replaceAll,casePSuf,psuf})
prop(pv.T.A,{lets,clear,zip,reduceTo,mkindexOf,mapWhile,get iter(){return GIter(this)},popWhile:(a,p,op)=>{while(n(a)&&p(x1(a)))op(a.pop())} })
prop(pv.T.E,{set_tail,clear,popK,wrapBy,parents})
prop(pv.T.N,{px})

pv.obj={
  deepEq:(a,b)=>{},
  deepCopy:(o,kp="")=>{},
  isEq:(a,b)=>a===b,
  keysTwo:(keys=>(...a)=>n(a[0])?keys(a[0]):[...new Set(a.flatMap(keys))])(Object.keys)
}

//noOp.ap(1)=()=>{let x=1/*ap*/;return x}
//noOp.ap(new Map)=()=>noOp(...a)
prop(pv.T,F,{
  ap:(f,...a)=>(n(a)>n(f))?NO: by.arg(f, (ka,s)=>{
    let [o,v]=ka.splice(0,n(a)).zip(a).reduce(asYN(v=>pv.obj.isPlain(v[1])))
    let iA=s.mkindexOf("/*ap*/","$me=arguments.callee;") //s.indexOf("/*ap*/"),s1=s; if(iA==-1)s1+="let "
    if(n(v)) o[k]="$me."+v[0]; //don't store globals, link'em to func obj
    s1=s.ins(iA,o.join2D(",","="))
    return by.fn(ka,s1)
  })
})

fold0,foldTo
asNum,asStr,asList,asObj,asNone,asYN//partition
prop(pv.T.A,{reduce,assoc,assocBy,assocTo})

class GroupCnt extends Map {
  inc(k) {let i=this.get(k)||0; this.set(k,i+1); return i}
  incZ(v_0,k) { let v=this.inc(k); return v==0? v_0:v}
}

prop(pv.T.O,{run,apply})

qs//each,1/N; wOp
qs1=(css,e0=doc)=>e0.querySelector(css)
prop(qs).set_load=(isOK=>(f=>
  isOK? f() : doc.addEventListener("DOMContentLoaded",()=>f())
).also(f=>f(()=>{isOK=true})) )($N)
qs.href; qs.mkcss; qs.sheet
qs.pfixs=ss(" webkit- moz- ms- o-").also(a=>a.of=op=>a.flatMap(op) )
by.firstIn=(o,ks,pfixs)=>{if(x1(kp)=="-");}
qs.insElem
qs.enableStyle
prop(qs).get_domP=prop(new DOMParser).parseFromString;
prop(qs).get_domS=prop(new XMLSerializer).serialzeToString;

el; el.styles; el.attrs; el.NS // bgImg,bg,xywh,pad,pado url/px
wAll,wAttr,wVal,wColor,wSty,wCls,wOp,wBind //deconcat
wC; wC.a
wOp.pairs
(wOp.flags={
  once:"once",
  revBubble:["capture",$N],//add both bubble
  bubble:[ev=>ev.stopPropagation(), ev=>assert(ev.bubbles)],
  default:[ev=>ev.preventDefault(),"passive"],
  stopNow:[ev=>ev.stopImmediatePropagation(), ev=>assert(!ev.cancelBubble)],
}).also(p=>p.stop=p.bubble) // default -sign
by.dataStr
wOp.argScope={//evX
  t,t0,T,p,n
}

wBind._stk
el.implicits={}

el.NS_svg=(prop(el).ref.NS.prop).withVal.ap("svg")
el.id=e=>{}; // n(f)==0、e/s
el._a="t href"; //el(":a","hello","y.txt",el.input(),"no","lick.html")
el._frag=()=>document.createDocumentFragment()

if(0){
  wCls("name", wSty("color","blue"),"parent")
  wAttr({t:"wtf",isContentEditable:$Y})
  el.implicits["*"]="div"
  el.implicits.ul="li" //tr<thead,td,option
  el.implicits[".mdui-button"]="button"
  el.div(wClsNS("mdui-"), el._(wCls("btn",0,"mycls")))
  wOp.click((e,ev)=>{}, "once stop stopNow bubble revBubble=capture default/passive", (e,evUp,ev0)=>{}) // useCapture,{capture} are same; bubble on target first, then revBub, bub
  wOp.of(e0).click.drop()//enabled/fire
}

timerRate,evBind,evPair,evFireNth
//wVal(enableStyle), evPair(e,pair,".cls")

Ops={reduce,check,toList:isDeep=>{},toString}
opChain=(optab,sP="()")=>w=>{
  let l=x=>optab[x][0], [sA,sB]=sP,
  close=_=>_.reverse().splice(0,n(_)).forEach(w);
  return foldTo([], (st,x)=>{ let pu=x=>st.push(x)
    !(x in optab)?w(x) : (
      x==sA?pu(x) : (x==sB)? popWhile(x=>x!=sA, w,st)||st.pop() :
      n(st)&&l(x1(st))>=l(x)? close(st)||pu(x) : pu(x) )
  }, close)
}

emetAttr(e,s,d) //[t="",_color=black,css=${path=>()}]
emet_(e,css_nano,d) //.#
emet(s,...a) //, >(+) e0-top ctx or body=
//table>(.row$i>[colspan=${2}],br[no-repeat],[t=$i]):i(1,3)
// (a+b):(2) = abab ; (a,b):(2) = aabb tail=eachNext(map(vars))
// no dyn scoping, deny dup name

fillElemOpts(opts_f,opts,e)
qkChain,qaChain
eeach_(e,opts)
by.tpDollar; by.tpEq
eeach.opts={pos:"e0",posa:"in", sep:":", each:null,key:"t"} //a:b textContent+href=$it:label
qs("[each]",NO,eeach_)

eeach(ins=>{ins.click(), ins._color; String(ins)=="{iK} text/attr.i"; ins("t+href=$it#hi") })

eeach_(e,{each:["a:b", "c:d"]})

if(0){
evalTepl=(s,it)=>s.let(decodeURIComponent).replaceAll([/\$(\w+)/g, /\$\{(.*?)\}/g], (_,m1)=>eval(m1)),
evalEq=(s,it,op_s=noOp)=>(s!=""&&s[0]=="=")? eval(s.slice(1)) : op_s(s)
fillElemOpts=(d_deft,d,e)=>{if(typeof d!=="object"||!d)d={}; for(let k in d_deft)if(!(k in d)) d[k] = elv(e.popK(k), d_deft[k]);  return d}
}

Promise.also(P=>{
  P.callDelays={};
  P.delayed=function(create,dt_ms){return new Promise((ok,err)=>setTimeout(()=>create().then(ok).catch(err), dt_ms) )}
  P.delayCall=function(argv){return Promise.delayed(()=>argv.callee.apply(null,argv), Promise.callDelays[argv.callee.name]||200)}
})
function loaderOp(type,fname){var o=new type(), f=o[fname]; return function loaderDispatch(){
  return(o.readyState==type.LOADING)? Promise.delayCall(arguments) :
    new Promise((ok,err)=>{ o.onload=(ev)=>ok(ev.target.result); o.onerror=err; f.apply(o,arguments); })
}; }

file=by.calcK(k=>loaderOp(FileReader,"read"+Equiv.cap0.from(k)))
file.asText

el.iframe=s=>{
  let doc=el("iframe"),
  copy=(e,e0)=>e.childNodes.forEach(ee=>e0.appendChild(ee)), k;
  doc.onload=()=>{ let e = !isStr(s)?s: qs.domP.parseFromString(s, "text/html"); for(k of ss("head body")) copy(e[k], doc.contentDocument[k]) };
  return doc
}

Equiv.cssURL
Equiv.dataURL(mime,codec)
if(0)with(Equiv){let kc="image/svg+xml";pipe(test(s=>"url(\"#"),cssURL/*e*/,run(qs).fwd,test(e=>e.src,e=>cssURL(e.src)),xml(kc),dataURL(kc,"utf8"))}

Equiv.errser=[
  (o)=>{
    function typed(obj, ...ks) {
      let res = {_type: obj.__proto__.name};
      for (let k of ks) res[k] = obj[k];
      return res;
    }
    o._type = o.__proto__.name;
    if (o instanceof Error) { return typed(o, "message", "stack"); }
    else { delete o._type; }
    return o;
  },
  (o)=>{
    if (o._type == "Error") { let ex = Error(o.message); ex.stack = o.stack; return ex; }
    return o;
  }
]

function PortServer(port, table, eqv=Equiv.errser) { // use runtime.connect(...[id?,{name}]) to get port
  let sends=by.firstIn(port,"sendMessage postMessage"),
  addRecv = (!!port.onMessage)? (op)=>port.onMessage.addListener(op) : (op)=>port.addEventListener("message", (ev)=>op(ev.data) );

  if (!!table) {
    function respond(data) {
      if(data.length!=3) return;
      let [no,k,args] = data;
      let res; try { res = table[k](...args); } catch(ex) { res = ex; } // dytype
      this.sendMessage([no, eqv.from(res)]);
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
    sends.call(port,[seqNum,k,args]); seqNum++;
    addRecv((data) => {
      if(data.length!=2) return;
      let [no,resp] = data; resp = eqv.into(resp);
      let iResp = no-offsetL;
      if(que[iResp]==null) return; // sometimes dispatched for 2 times?
      que[iResp][(resp instanceof Error)? 1:0](resp); que[iResp] = null;
    });
    return promise;
  }
  return by.keyCall(k=>(...args)=>send(k,args))
}

if(0){
  PortServer(window, {add:(a,b)=>a+b, checkNot:(v,x)=>{ if (x==v) throw Error(`invalid ${x}`); } })
  server=PortServer(window)
  qs.load=async()=>{
    con.log(await server.add(1,2));
    server.checkNot(1,1).catch(con.log);
    con.log(await Promise.all([[1,2], [5,4], [1,3], [6,9], [1,1]].map(ns=>Promise.delayCall(()=>server.add(...ns), 100)) ));
  }
}
