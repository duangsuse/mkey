const
undef=void 0,NO=null, $Y=true,$N=false,
fthis=f=>function(...a){return f(this,...a)}, noOp=(x=>x), just=k=>(()=>k), $YN=f=>[f($Y),f($N)],
n=o=>o.length,ss=s=>s.split(" "),
[isNon,isObj,isNum,isStr,isFunc,isBool]=ss("undefined object number string function boolean").map(s=> v=>(typeof v===s)),
isNul=o=>o===null,isNun=v=>v==null, elv=(a,b)=>!isNun(a)?a:b;

const
feed=(s,i)=>n=>{}, //._d .st(k,init)
eTakeIf=(p,n=1)=>s=>p(s(n))? s(-n) : NO,
eIs=s=>eTakeIf(c=>c===s,n(s)),
eNot=p=>eTakeIf(c=>isNul(p(just(c)))),
runP=(p,s,o=NO)=>{
  if(isNul(o)){if(isStr(s))s=feed(s); return p(s)}
  let k,a=[];
  o[o.k]=f=>{f(x=>a.push(x), (ff,v)=>{o.v=v;return ff(s,o)}); return $Y}
  for(k of runP.keys)o[k]=just($N)
  return k[0]=="s"? a.join("") : k[0]=="n"? a.sum() : a.fold(globalThis[`as${k}`])
},
eIn=(...cs)=>eTakeIf(c=>{
  let k,N;for(k of cs) { N=n(k);
    return N==1&&c==k ||
      N==3&&k[1]=='~'&& (k[0]<c&&c<k[2]) ||
      k.includes(c)
  }
}),
eMap=(d,v=NO)=>isNul(v)? _c2d(d,d=>One(d).P.let(d)) : eMap(new Map((isStr(d)?ss(d):d).zip(v)))//< ss keys

once=(f,key=noOp,d=new Map)=>(...a)=>{
  let k=key(...a),r=d.get(k); if(isNon(r))d.set(k,r=f(...a)); return r // TODO 2 ref-equal Trie
},
Instype=(set=>(x,memb)=>{set(x.constructor,memb)(x); return x})(
  once((T,o)=>{let K="__proto__"; ext(o,o); o[K]=T.prototype; return o.of= x=>{x[K]=o} })),
ext=(T,o)=>{let s,f;for(s in o){f=o[s];if(isFunc(f))f=fthis(f);
  if(reCond(/^([gs]et)_(.+)/,k=>$N&(o[k]={value:f}),m=>o[m[2]]={[m[1]]:f}, s))delete o[s]
} Object.defineProperties(T.prototype||T,o)},
reCond=(re,op,y,s)=>{let m=re.exec(s); return isNul(m)?op(s):y(m)},
_c2d=(o,f)=>isFunc(o.get)? f(o) : f(new Map(Object.entries(o))); //< obj eMap

feed.fold_sloc=just(undef)
runP.keys=ss("sp cp n s")
ext(Function,{get_P:f=>P.of(f), get_self:f=>f(f)}) //证明不如also
ext(Object,{let:(o,op)=>op(o),also:(o,f)=>{f(o);return o},takeIf:(o,p)=>p(o)?o:NO})
noWhite=(me=>{}).self //span[i,i1,tok,r] at(i){str}, wsBefore, skip()

ext(Array,{
  mapWhile(a,p,op){let ys=[],x,y; for(x of a) {y=op(x); if(!p(y))break;  ys.push(y)} return ys },
  firstRes(a,op,p){let x,y;for(x of a)if(p(y=op(x)))return y;  return NO},
  zip:(a,b,op=(...a)=>a)=>a.map((x,i)=>op(x,b[i])),
  map_:(a,op)=>a.forEach((x,i)=>a[i]=op(x)),
  fold:(a,f)=>{let r=f(),x;for(x of a)r(x); return r()},
  sum:a=>a.reduce((n,x)=>n+x, 0)
})
const
[recP,rec]=$YN(q=>f=>{let f1,run=n(f)==1?x=>f1(x):(...a)=>f1(...a); if(q)run.give=(...a)=>(f1=(n(a)!=0)?f(...a):f(run)); return q?run : f1=f(run)}),
fold0=(zero,plus)=>(ac=zero)=>x=>isNon(x)?ac:(ac=plus(x,ac)),
foldTo=(init,op,done=foldTo.op)=>(a=init())=>x=>isNon(x)?done(a):op(a,x),
unfold=v=>isObj(v)?Object.entries(v):[...v]//v_asd

foldTo.op=noOp;
asNum=(nd=10)=>fold0(0,(d,n)=>n*nd+d),
asList=foldTo(Array,(a,x)=>a.push(x)),
asAry=n=>foldTo(()=>Array(n).also(a=>{a.i=0-1}),(a,x)=>{a[++a.i]=x}),
[asObj,asMap]=$YN(q=>foldTo(q?Object.create(NO):new Map, q?(o,[k,v])=>{o[k]=v} : (d,[k,v])=>{d.set(k,v);} )),
asJoin=(sep,f)=>withV(foldTo,"op",a=>a.join(sep), f)

const
isOK=v=>v!==NO, //v for eMap
One=(...a)=>n(a)==1&&a[0].keys? (ks=>ks.every(s=>n(s)==1)?eIn(ks.join("")) : One(...ks))([...a[0].keys()]) : s=>P.cvt(a).firstRes(isOK, p=>p(s)),
More=(fold,p)=>s=>{ let rs=fold(),r; for(;(r=p(s))!=NO;){rs(r)} return rs()},
Seq=(...a)=>s=>P.cvt(a).mapWhile(isOK, p=>p(s)).takeIf(rs=> n(rs)==n(a)),
Paired=(pq,p)=>{
  if(isStr(pq))return Paired(n(pq)==1? [pq,pq]:[...pq],p);
  let[p0,q]=P.cvt(pq);
  return P.calm("pq", s=>{
    if(isNul(p0(s)))return NO;
    let r=p(s);
    if(isNul(q(s)))return NO;
    return r
  }, ()=>{let k=`pq${pq}`; p0=p0.P.also((_,s)=>s.st(k,Array).push(s(0).sloc)); q=q.P.also() ; return $Y})
}

P={
  noo:(p,p0)=>(s,o)=>{if(o){o.sp(p0)||o.cp(p0)||o.n(p0)||o.s(p0);} return p(s)},
  calm:Object.assign((k,p,f=just(void 0))=>{
    let v=P.calm[k]; return isNon(v)?p: f()?p:p.P.calm(v)
  }, {is:p=>_=>`expecting ${p.P}`}),
  errs:NO,
  sq:ss("() [] {} <>"),
  cvt:a=>a.map_(x=>{isStr(x)? eIs(x):n(x)? Seq(...x):x}),
  of:{
    or:(p,v,v0=NO)=>!isNul(v0)? s=>isOK(p(s))?v0:v : s=>elv(p(s),v),
    tok:(p,k)=>p.also((r,s)=>{ s.skip();s.wsBefore.set(r,s._ws); s._ws="" }, s=>{ s.tok=k }),
    calm:(msgr,v_empty="",cs_cont=" \n")=>{},
    showBy:(p,op)=>(s,o)=>{o.s(w=>w(op(o.v))); return p(s)},
    toString:p=>runP(p,NO,{k:"sp"}),
    let:0,also:0
  }
}
Object.assign(P.of, {let:P.noo((p,op)=>s=>op(p(s))),
  also:P.noo((p,op,op0=noOp)=>s=>{op0(s); let r=p(s); op(r,s); return r}) })

next=g=>g.next().value,
trie=(path=()=>new Map,a=[])=>{ // Trie 这种所有权结构怎么还会兼容 WeakMap.. 而且 a 怎么和它同层次，是因为每个实例的path类型也都能改？
  let d0=path(), //^ 刚开始是foreach flatMap 的模式，后来想能不能就一个数组在第一个叶点用返回值去传，后来才明白可以 1:1 个,splice
  rec=(d,k,v)=>{
    if(isNon(k)) { //keys
      //if(d.size==1)return ["",d.get(trie.KZ)]
      let Z=trie.KZ,vZ=d.get(Z), r=isNon(vz)?[]:["",vZ],k,v, rr; d.delete(Z); for([k,v] of d) {
        rr=rec(v); for(let [k1,v1] of rr)r.push(k+k1,v1)
      }
      d.set(Z,vZ);
    }
    let ki=next(k),q, p1; if(q=isNon(ki))ki=trie.KZ;
    if(isNon(v)) { //get
      return q? d.get(ki) : rec(d.get(ki),k)
    } else { //create
      d.set(ki,p1=d.get(ki)||path()); // 惰性初始化只在这里做；当 KZ 时 return $N 让上层去 set(k,v) ，当 d.get 不是 Map 时 set(Map[KZ,v])
    } // 单一路径也可以让 set 返回 0,1,2 零代表失败(末键KZ)，1 代表第一次 2 代表移除当前层 .s
  }
  return (k,v)=>rec(d0,isNon(k)?k:k[Symbol.iterator](),v)
}
trie.KZ=Symbol.for("OK")

slicerP=((opre, dOk=0)=>s=>{
  let d=1, s0="", m0=null, i1=0,ml0=0,  {step,op_exc_i1,re_exc_eof}=slicerP;
  const
    len=(m)=>{let sum=0,i=1,N=n(m); for(;i<N;i++) sum+=isNul(m[i])?0:n(m[i]);  return sum},
    finish=(skip,m)=>skip(-(len(m)+dOk))&&[...m].slice(1)
  for(;;d+=step) { let sNew=""; if(isNon(sNew)||n(sNew)==n(s0))return q? isNul(m0)?NO:finish(s,m0) : m0; s0=sNew;
    if(q) m=re.exec(s0); if(!!m) if(length(m)==ml0) return finish(s,m); else m0=m,ml0=len(m);
    else try{m0=op(s0);}catch(ex){
      if(re_exc_eof.test(ex.message))continue; i1=op_exc_i1(ex);
      if(i1==null)throw ex; if(i1!=0){m0=op(s0.slice(0,i1)); s(-i1); return m0;}
    }
  }
}).also(f=>{ f.step=2
  f.op_exc_i1=ex=>execRe(/(\d+)/,ex.message,parseInt)
  f.re_exc_eof=/(end)|(eof)/i })
