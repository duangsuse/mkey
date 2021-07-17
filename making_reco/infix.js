optab={或:[1,"|"],且:[2,"&"],是:[3,"="]}
const n=o=>o.length, x1=o=>o[n(o)-1], {log}=console,
popWhile=(p,op,xs)=>{while(n(xs)&&p(x1(xs)))op(xs.pop())}, //shift可un不GC
moreN=(n,p)=>(q=>x=>(n!=0)? (q=q||p(x))&& !!(n--):q)(false),lg=f=>(...a)=>{log(...a);return f(...a)};

infix=(xs,w,st=[],[sA,sB]="()", pu=x=>st.push(x),l=x=>optab[x][0])=>xs.forEach(x=>!(x in optab)?w(x): (
  x==sA?pu(x) : (x==sB)? popWhile(moreN(1,x=>x!=sA), w,st) :
  n(st)&&l(x1(st))>=l(x)? st.splice(0,n(st)).reverse().forEach(w)||pu(x) : null)
),
c=s=>{let r=[];lg(infix)(s, x=>r.push(x)); return r}
// /(?:[()=])|(?:\s)/ /([()=\s]+)/ /\s*([()=])?\s+/
infix=(xs,w, sP="()")=>{
  [...sP].forEach(k=>{optab[k]=0})
  let st=[], pu=lg(x=>st.push(x)),l=x=>optab[x][0],
    close=()=>st.reverse().splice(0,n(st)).forEach(w),
    [sA,sB]=sP, x;
  for(x of xs) !(x in optab)?w(x) : (
    log(st,x)||x==sA?pu(x) : (x==sB)? popWhile(x=>x!=sA, w,st)||st.pop() :
    n(st)&&l(x1(st))>=l(x)? close()||pu(x) : pu(x)
  )
  close();
}

exam=`3 且 1 或 2
3 且 (1 或 2)
a 且 b是b1 或 d
a 或 b是b1 且 d`.split("\n").map(s=>
  /\s+|([()=是])/[Symbol.split](s).filter(x=>x!=null&&x!="")
)
run=a=>{let o=[]; infix(a,x=>o.push(x)); return o}
exr=exam.map(run)

//0:post, 1:pre, 2:inord
reord=(a,k0=0,k1=1)=>{
  let b=[],x,//n=n(a)
  isOp=x=>(x in optab),w=(...x)=>b.push(...x)
  let opr=[
    f=>{let st=[]; for(x of a)st.push(isOp(x)? f(x,st.pop(),st.pop()):x); return st[0]},
    f=>{let r=()=>opr[1](f),x; return isOp((x=a.shift()))? f(x,r(), r()) :x},
    //infix转化+walk... 怎么好像各各都一起了，本来是只 in->post->pre->in 的；显然只有 sexp,pre,infix 可以输出，然后 post->sexp->pre 需要两边的 walk() 实现,,, 认为这是优化吧
  ];
  res=opr[k0]([
    (o,b,a)=>w(a,b,o), //->len, no rev
    (o,b,a)=>[o,a,b] // 后项先求值，不能利用 w() 副作用
  ][k1])
  return k1==1? res.flat():b
}
console.log(exr.map(r=>reord(r,0,1)))
r=reord(exr[0],0,1)
