const testType=s=> o=>(typeof o===s),
  ss=s=>s.split(" "), n=o=>o.length, Infty=Infinity,
  [isNon,isObj,isSym,isFunc]=ss("undefined object symbol function").map(testType),
  NewType=(T0, mber, T=function(x){this.o=new T0(x)})=>{
    for(let [k,v] of Object.entries(mber))mber[k]=function(...a){return v.call(null, this, ...a)}
    const get=(o,k)=>{ let f;
      try { f=o[k] } catch { f=o.__lookupGetter__(k)||o.__lookupSetter__(k)/*?this*/ }
      return function(...a){return f.apply(this.o,a)}
    };
    Object.assign(T.prototype,mber).__proto__=new Proxy(T0.prototype,{get});
    return x=>new T(x)
  },
  next=g=>g.next().value,
  nextN=(n,g)=>{
    let inf=!isFinite(n), a=inf? [] : Array(n), i=0,r;
    if(inf)while(true){r=next(g); if(isNon(r))break; a.push(r);}
    else for(;i<n;i++)if(isNon(a[i]=next(g))){a.splice(i,n-i); break;}  return a
  }
function* eachNext(xs){xs.reverse();while(n(xs)){let a=xs.pop(),r=next(a); if(isNon(r))continue; yield r; xs.unshift(a);}}
lg=console.log;
lg(
  ...(g=> [...g(), nextN(Infty,g()), nextN(3,g())])(
    (it=[[1,3,4],ss("a b c d")])=>eachNext(it.map(a=>a.values()))
  )
)

let
  eqSym=[Symbol, o=>o.description],
  undef=undefined, noOp=(x=>x), keys=Object.keys,
  keysTwo=(...a)=>[...new Set(a.flatMap(keys))],
  argNames=f=>/\s*,\s*/[Symbol.split]( /\(?(.*?)\)?\s*=>/.exec(f)[1].trim() )
const State=NewType(Map, {
  fork(s,k,v){let s1=State(new Map(s.o)); s1.set(k,v); return s1},
  vars:(s,ks, [f,_]=eqSym)=>ks.map(k=>{ let v=f(k); s.set(v,undef); return v}),
  grab(s,v0){
    const see=(v)=>{
      if(isSym(v)){let v1=s.get(v); v1=see(v1)||v1; s.set(v,v1); return v1} // undef/nul ok
      return !canUnify(v,v)?null : deepCopy(v); // checked: null used in see(r)||r, v1=||v1
    }, deepCopy=(o)=>{ let o1; //v ary w/o string
      if(o instanceof Array){ o1=Array(n(o)); for(let i=0,N=n(o1);i<N;i++)o1[i]=s.grab(o[i]); }
      else{ o1=Object.create(o.__proto__); keys(o).forEach(k=>{ o1[k]=s.grab(o[k]); }) }
      return o1
    };
    let r=s.get(v0); return (r===undef)?v0 : see(r)||r
  },
  unify(s,a,b){ let s1=null;
    a=s.grab(a), b=s.grab(b);
    // extract ary/obj vars for grab()
    if(canUnify(a,b)) return (n(a)?keys(a):keysTwo(a,b)).reduce((st, k)=>!st?null: s.unify(a[k], b[k]), s);
    if(a===b)s1=s;
    else if(isSym(a))s1=s.fork(a,b); else if(isSym(b))s1=s.fork(b,a);
    return s1;
  },
  goIter:(s,f)=>f(...s.vars(argNames(f)))(s),
  go(s0,goal_ctx,n_st1=null,op_val=noOp){ State.onRun(s0);
    let vs=s0.vars(argNames(goal_ctx)); let rs=goal_ctx(...vs)(s0);
    let r, mkR=()=>(r=(!n_st1? next(rs)||null : nextN(n_st1,rs))),  tr=st=>vs.map(v=>op_val(st.grab(v))),
      more=()=>mkR()&&Object.assign(r, {vs, n_st1,more, get vals(){return !n_st1? (!r?r: tr(r)) : r.map(s=>tr(s)) }  })
    return more();
  }
})
  canUnify=(a,b)=>{ // must: p(o,o)==true
    const isO=v=>isObj(v)&&v!==null, isA=o=>!!n(o), po=o=>o.__proto__;
    return isO(a)&&isO(b)&&(
      isA(a)&&isA(b)? n(a)==n(b) :
      po(a)==po(b))
  },
  go={ // =&|  ->() basic four
    eq:(a,b)=>s=>(s1=> (!s1?[]:[s1]).values())(s.unify(a,b)),
    puts:f=>s=>s.goIter(f),
    one:(...gs)=>s=>eachNext(gs.map(g=>g(s))),
    all:(g,...gs)=>s0=>gs.reduce((ss,g)=>eachNext(nextN(Infty,ss).flatMap(s1=>g(s1))), g(s0))
  }
State.onRun=noOp;
st=State(new Map);

{
  const//p=pair
    plist=([x,...xs])=>!x? null : [x,plist(xs)],
    listp=p=>(p===null)?[] : [p[0], ...listp(p[1])]
  equ={list:[plist,listp], peano:[n=>plist(Array(n).fill(1)), p=>n(listp(p))], nGo:10} // since we dont support [x,...xs] in unify
}
useEquiv=([f,back], get_op)=>go(st, get_op(f), equ.nGo, back)

class GroupCnt extends Map {
  inc(k) {let i=this.get(k)||0; this.set(k,i+1); return i}
  incZ(v_0,k) { let v=this.inc(k); return v==0? v_0:v}
}
if(`number duplicate names`){
  let g=new GroupCnt; State.nameDup=g;
  eqSym[0]=k=>Symbol(k+g.incZ("",k));
  State.onRun=st=>{st.clear(); g.clear();}
}

lg(canUnify([1],[2]), canUnify([1],[2,5]),
  st.unify({name:"dse",boy:true}, {boy:true,name:"dse"}),
  st.unify({name:"dse",boy:true}, {boy:false,name:"sed"}),
  st.unify({a:true}, {}), 10100
)
{
  let {eq,all,one,puts}=go;
  lg(
    st.go((a,b,c)=>all(eq(a,1), eq(b,2), eq(c,3))),
     st.go((a,b,c)=>all(eq(a,1), eq(b,2), eq(c,a)))
  )
  lg(
    st.go((a,b,c)=>all(eq(a,b), eq(b,c), eq(c,"good"))),
     st.go((a,b,c)=>all(eq("good",a), eq(b,c), eq(c,"good")))
  )
  lg(
    st.go(x=>one(eq(x,1),eq(x,2)),2),
    st.go((x,y,z)=>all(eq(x,5), eq(z,9), eq(y,1), eq(z,9)))
  )
  lg(
    st.go((x,y)=>eq([3,x], [y, [5,y]]) ),
    st.go((a,b,c)=>eq([3,b,2], [3,9,c]) ),
    st.go((x,y)=>eq({name:"dse",boy:x}, {boy:true,name:y}) ),
    st.go((x,y)=>all(eq({boy:true,name:y}, {name:"dse",boy:x}), eq(y,"dse")) ),
    st.go((x,y)=>puts((x1,y1)=>one(all(eq(y1,y),eq(x,x1)), eq(x,0) ) ), 2),
    st.go((x,y,z)=>all(eq(x,z),eq(y,1)))
  )
}
/**
关于 mk(x=>(x+1=n), _=>ey) 的接口，我想了很久，觉得这个 _=>ey 还是略鸡肋，因为它打算设计为 window 的 property ，这不线程安全（虽然 js 真会多线程吗哈哈）

其实这个要用 eval() 和 with 吧我也觉得还行，毕竟能实现 提取x=1+n；说(x) 这种幻想语言，那是我梦中的联动……喔是嵌入法
认真人谁会想到 (()=>{let a;eval("a=1");return a})() 有用呢？但是这能弥补 ES5 没的 ES6 destruct... 岂不是能让PL圈外人喊我大佬(自恋ing)

老实说之前一直觉得 Ruby 才能有这种能力，突然脑门一闪，JS 的 with,eval,toSource 也真足够啊

退一万步讲，我是希望尽量少字符串的，毕竟同时享受A语言的高亮，还能应用B的语义，多爽啊。

后来我想了个法子，不止在求 binding (变量上下文)时用 with ，也干脆在真 mk() 时也动态去添加变量好了，这样 _=>ey 就没啥价值，因为单 {ey:()=>eval(s)} 太弱智，而且你能发现它本身没调用语义，只能 with(defineProperty) ...

于是我想， mk 必须有更隐含的元编程 boilerplate ，只传一个闭包，那么这种表达式：

1.要有不影响求值结果的方法 2.要有调用语义，不然怎么eval 3.求值尽量靠前，比如(**)算符

JS 里 o.a,o[k],o.f() 都有调用语义，可是很难不改变结果，再生点 new,delete,typeof, void 还有这里没用的 await/yield
如果用 && || 的弱类型特性，也可以，但有冲突的风险（逻辑式也有这两类关系）

如果放开思路，广为诟病的隐式转型或可一试——toString 方法和 + 运算
（试了下 -* / == 甚至 ** >> 都会有... 而且 a>1, a++ 乃至一元 +-~ 居然也会。。。结果值自动强转，这尼玛是有多动态
（可惜 JS 没语义重载，不然一定会变成拿 % 格式化字符的 Python
然后 a^[123] 这个转型有点意思，可以试试

最终我没找到，但我有了这种想法：

let x; mk(_=>Y|| x+1*2==n )
对比下  mk(x=>x+1*2==n, _=>ey) ，是不是好看很多

let a,b = mk(_=>Y|| a+b==3, 2); ab各是长2数组
let [[a,b]] = mk((a,b)=>a+b==n, {n})

- 如果第二参的上下文给了，执行，不重组 vals
- 收集上下文，{Y:0} 给予 eval 支持、with 给予变量名查询，若结果 undef 则初始化变量，否则收集起；如果没
- 返回最后一个变量的值

啊！突然发现有闭包上下文的 eval() 后可以动态解释其中符号，不必用 placeholder 值了…… 话说一开始就是为内联局部变量做的，现在参数也都能内联
汗！ eval binding 什么的不需要 Y 这种符号在当前词法上下文才能拿到，而且 Y 也只是在栈顶…… 我们的选择显然是 Proxy 就足够了
 */