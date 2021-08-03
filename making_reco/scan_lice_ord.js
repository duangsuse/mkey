/*
旧事新编，ice1k 的 Lice 解释器+Scan 组合子，80行内
关于 Lisp 系(lice 没词法域，内部函数闭包不住局部量)的 AST 策略，因为它有 defLazy defExpr 传名/传式调用，If,Var 式命名化 child 没太必要，我有一个总体性的 reduce((acc,ee,f)=>) 来求值
化文操作是 scan 自带的，那其实这相当于没多态的 Visitor ，毕竟括号就是控制结构
*/
const undef=void 0, NO=null,$Y=true,$N=false, div=(a,b)=>Math.floor(a/b),
feed=(s,i=0,fold_sloc=noOp)=>n=>{ //sloc请变非形式参数
  let take=n=>n==1?s[i]: (s=>s===""?undef:s)(s.slice(i,i+n)), sloc=fold_sloc()
  if(n<0){n=-n; s1=take(n); i+=n} else
  s1=(n!=0)?take(n) : Instype([s,i,sloc], {
    error(a,msg){ throw Error(`Parse "${a[0].slice(0,feed.nVp)}" fail @${a[1]}, "${a.peek}: ${msg}"`) },
    get_peek:a=>{ let nV=div(feed.nVp,2), [s,i]=a; return s.slice((nV>i)?0: i-nV, i)+"^"+s.slice(i,i+nV); },
    get_n:([s,i])=>s.length-i,
    get_sloc:a=>a[2]()
  })//Instype ._d .st(k,init)
  return s1
}, withThis=f=>function(...a){return f(this,...a)}, noOp=(x=>x),
noWhite=(s,p_ws)=>n=>{
  me.tok=0; me.span=[[0,0,""]]; me.wsBefore=new Map; me.skip=skip; //k /* 注释除号
  span={i:a=>a[0],i1:a=>a[1],str:(a,s)=>s?s.slice(a.i,a.i1):a[2]} //草
},

n=o=>o.length,ss=s=>s.split(" "), isNun=v=>v==null,isNul=o=>o===null, elv=(a,b)=>!isNun(a)?a:b,
[isNon,isObj,isNum,isStr,isFunc,isBool]=ss("undefined object number string function boolean").map(s=> o=>(typeof o===s)),

reCond=(re,op,y)=>s=>{let m=re.exec(s); return isNul(m)?op(s):y(m)},
mapV=(o,op)=>{let k,v;for(k in o){v=op(o[k]);if(reCond(/^([gs]et)_(.+)/,k=>$N&(o[k]=v),m=>Object.defineProperty(o,m[2],{[m[1]]:v}))(k))delete o[k]} }, //不优雅不单一
swap=(k,o,o1)=>{let v=o[k];o[k]=o1[k]; o1[k]=v},
once=(f,key=noOp,d=new Map)=>(...a)=>{
  let r=d.get(key(...a)); if(isNon(r))d.set(r=f(...a)); return r //k Type&rec
},
Instype=(set=>(x,memb)=>{set(x.constructor,memb)(x); return x})(
  once((T,o)=>{let K="__proto__"; mapV(o,withThis); o[K]=T.prototype; return x=>{x[K]=o}} )),//输出 o.T?
$YN=f=>[f($Y),f($N)],
[recP,rec]=$YN(q=>f=>{let f1,run=n(f)==1?x=>f1(x):(...a)=>f1(...a); if(q)run.give=fr=>(f1=f(fr||run)); return q?run : f1=f(run)}),
ext=(T,o)=>{mapV(o,f=>({value:withThis(f)}));Object.defineProperties(T.prototype,o)} //ext:property

(o=>{o.get_P=f=>Instype(f,{
  or:(p,v)=>s=>elv(p(s),v),
  orOK:p=>{},//遍历太麻烦，你没了
  calm(msgr,v_empty="",cs_cont=" \n"){},
  tok:(p,k)=>p.also((r,s)=>{ s.skip();s.wsBefore.set(r,s._ws); s._ws="" }, s=>{ s.tok=k }),
  showBy:(p,op)=>(s,c)=>{c.s(w=>w(op(c.v))); return p(s)},
  lets:(p,op)=>s=>op(p(s)),
  also:(p,op,op0=noOp)=>s=>{op0(s); let r=p(s); op(r,s); return r},
  toString:(p)=>runP(p,NO,{key:"sp"})
});mapV(o,withThis)})(Function.prototype) // no merge&get/need
//^ 一个是 Function.prot 你要 define 一个是 Instype o 你要 set ；二者不都是原型？
mapKIf_=(p,op,o)=>{for(let k in o)if(p(k))o[k]=op(o[k]);};

ext(Array,{
  mapWhile(a,p,op){let ys=[],x,y; for(x of a) {y=op(x); if(!p(y))break;  ys.push(y)} return ys }, //k Seq,One
  firstRes(a,op,p){let x,y;for(x of a)if(p(y=op(x)))return y;  return NO},
  zip:(a,b,op=(...a)=>a)=>a.map((x,i)=>op(x,b[i])),
  map_:(a,op)=>a.forEach((x,i)=>a[i]=op(x))
})

fold0=(zero,join)=>(ac=zero)=>x=>isNon(x)?ac:(ac=join(ac,x)), //k fold
foldTo=(init,op,done=noOp)=>(a=init())=>x=>isNon(x)?done(a):op(a,x),
unfold=v=>[...v],
asList=foldTo(Array,(a,x)=>a.push(x)) //asNum,asAry,asMap,asNon,asIdx,asT:copy,seen overload不需要都是匿名的，override直接用get

eTakeIf=(test)=>s=>test(s(1))? s(-1) : null/*orOK*/, // no eAny,eStr,eIn, eIn.let(Map)
eIs=k=>eTakeIf(c=>c==k),//1->N, constval=eMap
pNot=p=>eTakeIf(c=>isNul(p(just(c)))),
pSeq=(...ps)=>s=>ps.mapWhile(isParsed, ap(s)).takeIf(rs=> rs.length==ps.length), // no SeqP(fp),JoinP(fsfp),SeqN(n,p),OneI:[R,int]
//Seq("", p) 两项特别版
pOne=(...ps)=>s=>ps.firstMap(isParsed, ap(s)),//k cvt||
pMore=(fold,p)=>s=>{ let OK=$N, rs=fold(),r; for(;(r=p(s))!=null;){rs.add(r)} return rs.done() },
pPaired=(sur,p)=>s=>{ //cvtIs&calm sur //pq="\""
  if(isNul(sur[0](s)))return NO;
  let r=p(s);
  if(isNul(sur[1](s)))return NO;
  return r;
}

P={
  endef:()=>{},//不干啦，被 runP 树改取代了
  top:p=>s=>runP(p,s),
  //greedy,concat,seeLeft:typeof..
  mod:(p,pLeft)=>{
    //其实就是 More(pLeft)+p .let ，这个当时就很好笑，觉得必须 Trie 一下才好而且只有 fun/val 式能兼容，其实就是 concat 或者 seeLeft 一下就能知道读啥结构，毕竟关键字和类型名啥根本不可能冲突， fun 这些也不冲突
    mod(One(fun,val), "flags", asBits, eMap(modifiers), "attrs", asList, Seq("@",annotation))
  },
  sq:ss("() [] {} <>"),
  cvtIs:v=>isStr(v)?[...v].map_(eIs) : v.map_(eIs),
  calm:{is:p=>_=>`expecting ${p.P}`}, //k calm
  errs:null,
  needWs1:(p,msgr)=>s=>s._ws!=""?p(s):s.error(msgr(s)), // k in(a) 无分词阶段的尴尬； Parened|need(Expr)
  noo:(p,p0)=>(s,o)=>{if(o){o.sp(p0);o.n(p0);o.s(p0);} return p(s)} //这样在 let 的层 o 就不会只是丢掉，而是仅反向时会参考
  //int,hex,cStr,cComment,cWhite
}

pRE=(sRe,dOk)=>s=>{ dOk=dOk||0;
  let re=(sRe instanceof RegExp)? RegExp("^"+sRe.source,sRe.flags) : RegExp("^"+sRe)/*so no care m.index*/,
      d=1, s0="", m0=null,ml0=0/*detect 2-length inc-stop, we don't known len(of s or m)*/,  ld=poSliced.step;
  function length(m) {let sum=0; for(let i=1;i<m.length;i++) sum+=(!!m[i])?m[i].length:0;  return sum}
  function finish(skip,m) {
    skip(-(length(m)+dOk)); return [...m].slice(1)/*its groups*/;
  }
  for(;;d+=ld) { let sNew=s(d); if(poEOS(s0,sNew))return (!!m0)?finish(s,m0):null;  s0=sNew;
    m=re.exec(s0); if(!!m) if(length(m)==ml0) return finish(s,m); else m0=m,ml0=length(m); }
}
pSlicedTry=(op,op_exc_i1=ex=>execRe(/(\d+)/,ex.message,parseInt),re_exc_eof=/(end)|(eof)/i/*no g(mut-pos)!*/)=>s=>{ // end...unexpected-tok
  let d=1, s0="", res0=null, i1=0,  ld=poSliced.step;
  for(;;d+=ld) { let sNew=s(d); if(poEOS(s0,sNew))return res0;  s0=sNew;
    //res0=runCatching(()=>op(s0), ex=>{if(!re_exc_eof.test(ex.message)) i1=op_exc_i1(ex); if(i1==null)throw ex; return res0;})
    try{res0=op(s0);}catch(ex){
      if(!re_exc_eof.test(ex.message)) i1=op_exc_i1(ex);
      if(i1==null)throw ex; if(i1!=0){res0=op(s0.slice(0,i1)); s(-i1); return res0;}
    }
  }
}
/**那么 pRE/pSlicedTry 有以下不同：
从 null 起读到「匹配长度 ml0 不增加」
从(异常) eof 起读到提示 i1 的

如果把区别描述为函数， run_op(nS) 从空读到无后项，返 s 表错误 i 表已查到末索引，记录结果
 */
_=slicerP=(opre, dOk=0)=>s=>{
  let d=1, s0="", m0=null, i1=0,ml0=0,  {step,op_exc_i1,re_exc_eof}=slicerP;
  const
    len=(m)=>{let sum=0,i=1,N=n(m); for(;i<N;i++) sum+=isNul(m[i])?0:n(m[i]);  return sum},
    finish=(skip,m)=>skip(-(len(m)+dOk))&&[...m].slice(1)
  for(;;d+=step) { let sNew=""; if(isNon(sNew)||n(sNew)==n(s0))return q? isNul(m0)?NO:finish(s,m0) : m0; s0=sNew;
    if(q) m=re.exec(s0); if(!!m) if(length(m)==ml0) return finish(s,m); else m0=m,ml0=len(m);
    else try{m0=op(s0);}catch(ex){
      if(!re_exc_eof.test(ex.message)) i1=op_exc_i1(ex); //如果输入没不完整，应该能提取出末位置，当时咋没整清晰…… i1默认不可能是 NO或0 ，那为什么有独立if
      if(i1==null)throw ex; if(i1!=0){m0=op(s0.slice(0,i1)); s(-i1); return m0;}
    }
  }
}

//slicer+feed+rec/One/Paired/eTakeIf=22+3+(1+4+3) 行， eMore和

_.step=2
_.op_exc_i1=ex=>execRe(/(\d+)/,ex.message,parseInt) //忽视 unexpected
_.re_exc_eof=/(end)|(eof)/i

//噪音 g.fillStyle=`hsl(0,0%,${100 - (Math.random() * 15)})`;g.fillRect(x,y,1,1)
//嗯，本来以为 offset 是用来定义 offsetLeft/Top 的，没想到是 offset-path, offset-distance 的元素路径移动动画…… 还能 rotate:auto ，这不是SVG动画吗
//innerText 原来比 textContent 先支持…… 搜索 canvas display innerText

bindCanvas=(id,mode,w,h)=>{
  let e=eId(id),c=e.style,f; if(c.MozOrient){c.display="none";return} //e.refer.background==`-moz-element(#${id})`;
  if(f=doc.getCSSCanvasContext)return f.call(doc, mode,id,w,h)
  //然后 closePath,clear 什么的都不能用于通知更新，新建一个
  e.flush=()=>{
    let refs=selectRuleProp(k=>k.trimLeft().startsWith("-webkit-canvas"), s=>eId(s.slice(s.indexOf("("),-1))),e0, u=e.toDataURL();
    for(e0 of refs)e0.style.backgroundImage=u;
  }
},
selectRuleProp=(p,op)=>doc.styleSheets.flatMap.rules.flatMap.styles.flatMap.filterNotNull(p(k)? op(v):NO) //草你 generator 得了
