// monkey, a miniKanren ES6 variant by duangsuse(2021)

equK/*sym*/=[k=>Symbol(k), o=>o.description], isK=o=>(typeof o==="symbol"),
keys=Object.keys, keysTwo=(...a)=>n(a[0])?keys(a[0]):[...new Set(a.flatMap(keys))], // support Type a/o
canUnify=(a,b)=>{ // must: p(o,o)==true
  const isO=v=>(typeof v==="object")&&v!==null, isA=o=>!!n(o), po=o=>o.__proto__;
  return isO(a)&&isO(b)&&(
    isA(a)&&isA(b)? n(a)==n(b) :
    po(a)==po(b))
},
undef=undefined, isNon=o=>(typeof o==="undefined"), noOp=(x=>x), // null is value.

/*deref*/rget=(s,v0)=>{let v=s.get(v0); return (v===undef)?v0: !isK(v)?v: (v1=>{v1=rget(s,v1);if(v1==v)return v0/*subst missing*/; s.set(v,v1); return v1})(v)},
grab=(s,v)=>{
  if(!canUnify(v,v))return rget(s,v);
  let o1, o=v; //v ary w/o string
  if(o instanceof Array){ o1=Array(n(o)); for(let i=0,N=n(o1);i<N;i++)o1[i]=grab(s,o[i]); }
  else{ o1=Object.create(o.__proto__); keys(o).forEach(k=>{ o1[k]=grab(s,o[k]); }) }
  return o1
},
unify=(s,a,b)=>{
  a=rget(s,a);b=rget(s,b);
  if(canUnify(a,b))return keysTwo(a,b).reduce((st, k)=>isNon(st)?undef: unify(st/*each(k)*/, a[k],b[k]), s);
  return /*rv rr*/(isK(a))? fork(s,a,b) : (isK(b))?fork(s,b,a) : (a===b)? s: undef
},
fork=(s,k,v)=>{if(S.isGrabRec(s,k,v))return undef; let s1=new Map(s); s1.set(k,v); return s1};

buildA=(n,op_w,op_a)=>{let inf=!isFinite(n), a=inf?[]:Array(n); inf? op_w(x=>a.push(x)):op_a(a); return a},
next=z=>z.next().value, n=o=>o.length,ss=s=>s.split(" "),
nextN=(n,xz, i=0,x=0)=>buildA(n,w=>{while(!isNon(x=next(xz)))w(x);}, a=>{for(;i<n;i++){x=next(xz);if(isNon(x)){a.splice(i,n-i);break;} a[i]=x;}})
function* eachNext(a){a.reverse();while(n(a)) {let xz=a.pop(),x=next(xz); if(isNon(x))continue; yield x; a.unshift(xz)}}

function* deconcat(N,a){while(n(a))yield a.splice(0,N)}
argNames=f=>/\s*,\s*/[Symbol.split]( /\(?(.*?)\)?\s*=>/.exec(f)[1].trim() )
S={//State ops
  vars:(s,ks, [f,_]=equK)=>ks.map(k=>{ let v=f(k); s.set(v,undef); return v}),
  goIter:(s,f)=>f(...S.vars(s,argNames(f)))(s),
  go(s0,goal_ctx, op_val=noOp){ S.onRun(s0);
    let vs=S.vars(s0,argNames(goal_ctx)); let rs=goal_ctx(...vs)(s0), n=S.stepN, q1=!n;
    let r, mkR=()=>(r=(q1? next(rs)||null : nextN(n,rs))),  tr=st=>vs.map(v=>op_val(grab(st,rget(st,v)))), // 如无解得 undef. grab(rget) 哈哈这不就是 deepwalk reify-s 吗，****
      more=()=>mkR()&&Object.assign(r, {vs, get vals(){return q1? (!r?r: tr(r)) : r.map(s=>tr(s)) }, more, step:n});
    return more()
  },
  onRun:s=>{s.clear()},
  stepN:null,
  isGrabRec:(s,k,v)=>{v=s.get(v); // must: isK(k), eq(k,v) rr:k=v; sets noOp for perf?
    return isK(v)? v===k :
    !canUnify(k,v)?false : !keysTwo(a,b).some(k=>S.isGrabRec(s, a[k],b[k]) );
  }
},
go={//Goals
  eq:(a,b)=>s=>(r=> (isNon(r)?[]:[r]).values())(unify(s,a,b)),
  puts:f=>s=>S.goIter(s,f),
  one:(...gs)=>s=>eachNext(gs.map(g=>g(s))),
  all:(g,...gs)=>s0=>gs.reduce((ss,g)=>eachNext(nextN(Infinity,ss).flatMap(s1=>g(s1))), g(s0)),

  conde:(...a)=>go.one(...[...deconcat(2,a)].map(pe=> go.all(...pe))) //2 可参数化
},
st=new Map;
/*
var,var?,var=?: eqK[0],isK,(===)
ext-s:fork
walk:rget
call/fresh: S.goIter
==,disj,conj,fresh: go. eq,one,all,puts
mzero,unit,mplus,bind: !pure [],push,eachNext,map

pair/custom unification supported, one/all/goIter handles multi-arg(func).
reification, occurs-check supported. we all use by-place ary operation.

counter var _N for sym not used, Generator used to replace pull-based stream, so Zzz-thunkify goal not used(but we really need one to handle inf.rec Haha)

take-all,take-n: nextN
run,run*(all): S. go, stepN=n
*/
class GroupCnt extends Map {
  inc(k) {let i=this.get(k)||0; this.set(k,i+1); return i}
  incZ(v_0,k) { let v=this.inc(k); return v==0? v_0:v}
}
S.useCnt=q=>{
  let g=new GroupCnt; S.nameDup=g;
  equK[0]=!q?Symbol:k=>Symbol(k+g.incZ("",k));
  S.onRun=st=>{st.clear(); g.clear();}
}

lg=console.log;
lg(`proper eachNext`,
  ...(g=> [...g(), nextN(Infinity,g()), nextN(3,g())])(
    (it=[[1,3,4],ss("a b c d")])=>eachNext(it.map(a=>a.values()))
  )
)
lg(`unification`,
  canUnify([1],[2]), canUnify([1],[2,5]),
  unify(st,{name:"dse",boy:true}, {boy:true,name:"dse"}),
  unify(st,{name:"dse",boy:true}, {boy:false,name:"sed"}),
  unify(st,{}, {a:true}), 10100
)
{
  let {eq,all,one,puts,conde}=this.go; let go=f=>S.go(st,f);
  lg(`transitive`)
  lg(
    go((a,b,c)=>all(eq(a,1), eq(b,2), eq(c,3))),
     go((a,b,c)=>all(eq(a,1), eq(b,2), eq(c,a)))
  )
  lg(
    go((a,b,c)=>all(eq(a,b), eq(b,c), eq(c,"good"))),
     go((a,b,c)=>all(eq("good",a), eq(b,c), eq(c,"good")))
  )
  S.stepN=2;
  lg(`more st1`,
    go(x=>one(eq(x,1),eq(x,2))),
    go((x,y,z)=>all(eq(x,5), eq(z,9), eq(y,1), eq(z,9)))
  )
  lg(`occur check`,
    go((x,x1)=>all(eq(x1,x),eq(x,x1)) ),
    go((x,x1)=>all(eq(x,x1),eq(x1,x)) )
  )
  S.isGrabRec=(s,k,v)=>false;
  lg(`deep relations`,
    go((x,y)=>eq([3,x], [y, [5,y]]) ),
    go((a,b,c)=>eq([3,b,2], [3,9,c]) ),
    go((x,y)=>eq({name:"dse",boy:x}, {boy:true,name:y}) ),
    go((x,y)=>all(eq({boy:true,name:y}, {name:"dse",boy:x}), eq(y,"dse")) ),
    go((x,y)=>puts((x1,y1)=>one(all(eq(y1,y),eq(x,x1)), eq(x,0) ) ))
  )
  S.useCnt(1);
  lg(`number#`,
    go(x=>(x0=>puts(x=>eq(x,x0)))(x)) // sym x1
  )

  S.stepN=null;
  //中  文  编  程(确信)
  let 查=go, 等同=eq,同=等同, 且=all, 或=one, 置=puts, 况=conde;
  lg(
    查(啥=>等同("面",啥)),
    查((甲,乙,丙)=>且(等同(甲,丙),等同(3,乙))),
    go((x,y,z)=>all(eq(x,z),eq(y,1))),
    查(某=>置((甲,乙)=>等同(甲,乙))),
    查(啥=>置((甲,乙)=>且(同(甲,啥),同(3,乙))))
  )
  lg(
    查(啥=>置((甲,丙)=>且(同(甲,丙),同(3,丙),同(啥,甲)))),
    查(啥=>同(4,3)),
    查(啥=>且(同(啥,4),同(啥,3)))
  )
  lg(
    查(啥=>置((某,甲,乙)=>况(
      同([甲,某,甲], 啥), 同(乙,某),
      同([某,甲,某],啥), 同(乙,某)
    )))
  )
  S.stepN=5;
  let 循环=x=>或(同(1,x),同(0,x),s=>(function*(){for(let v of 循环(x)(s))yield v})()) //迫真 Zzz
  lg(
    查(啥=>循环(啥))
  ) //v 或a,自(r)
  let 或归=r=>function*(s){while(true)yield*[...r(s)].flat()} //惰性 flatMap... js std 的缺点来了
  let 无路=同("war","peace")
  lg(
    查(啥=>或(或归(同(0,啥)), 同(1,啥))),
    查(啥=>或归(或(同(啥,1),同(啥,2),同(啥,3)))),
    查(啥=>或(
      同(啥,1),
      无路,
      或(
        同(啥,2), 无路, 同(啥,3)
      )
    )), // 我们的 nextN 不会无限寻找第四个答案。不过下条还是不归了
    //查(啥=>或归(同(1,0)))
  )
  //lg(查(y=>乘(数位(3),数位(4), y)))

  //附录
  let 重=(x,v)=>s=>function*(){while(true)yield* 同(x,v)(s)}() // 啊，那么惰性流和 Zzz 就讲完了
  lg(
    查((a,b)=>且(同(a,7), 或(同(b,5),同(b,6)))),
    //fives(x)x=5|fives(x) 得默认支持惰性才行
    查(x=>或(重(x,5),重(x,6)))
  )
  let 列=(...a)=>(iR=> v=>st=>{ //自定义构解造，下次 unify 用副作用只在 eq() 里复制好了
    if(n(a)==0)return v? (n(v)==0?v:undef) : [];
    if(v) {
      if(iR===-1) return unify(st,a,v); //a.forEach((k,i)=>{ st.set(k,v[i]) })
      let s=st, chk=i=>{
        let k=a[i],x=v[i], s1=unify(s,k,x); // JS 真的很急耶，不过怪我 catch 注了 let x=x[i]...
        console.log(i,k,x);
        if(isNon(s1)) throw s;
        s=s1;
      };
      try{for(let i=0;i<iR;i++)chk(i);
      st.set(a[iR], v.slice(iR,n(v)-(n(a)-1-iR) )); //e.g. nA-iR=1, no ra,xb,... right
      for(let i=iR+1,N=n(a);i<N;i++)chk(i);
      return v;}catch{return undef}
    }
    let r=a.map(k=>rget(st,k)); r.splice(iR,1,...r[iR]);
    return r;
  })(a.findIndex(x=>!isK(x)?false:equK[1](x)[0]=="r"));
  {
    let 拔草=(v,op)=>{let r=op(v)(st);return st.get(sym)||r}, sym=Symbol("ra"), x=Symbol("第一")
    lg(
      拔草([], 列()),
      拔草([1], 列()),
      拔草([1,1], 列(x,x)),
      拔草([1,2,3,4], 列(1,2,sym)),
      拔草([1,2,3,4], 列(1,2,sym,4)),
      拔草([0,2,0,4], 列(1,2,sym))//没啦
    )
  }
  let 拼=(b,a)=>c=>况(
    同(b,s),同(a,列()),
    置((x,ra,rc)=>且(同(a,列(x,ra)), 同(c,列(x,rc)), 拼(b,ra,rc)))
  )
  if(0)lg(
    查(s=>同(s,拼("你好","世界"))),
    查((a,b)=>同("你好世界",拼(a,b)))
  )
}