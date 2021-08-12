/*记得递等式(分步计算)吗？来做个支持输出部分结果的四则 计算器！

如何解析？利用 s(1)预判, s(-1) 消耗的字符流！ 跳过空格？利用 noWhite 过滤流
如何执行？ ops.reduce(r op[k] r(0) r(1) , atom) 。r 在平时递归计算子树i ，保留步骤时令结果存入当前层二项目副本。
如何协程？ask() 层直接保存并 throw 回顶层，下次将得参数，改掉自己！
*/
const
undef=void 0,NO=null, $Y=true,$N=false,
noOp=(x=>x), just=k=>(()=>k), $YN=f=>[f($Y),f($N)],
n=o=>o.length,ss=s=>s.split(" "), div=(a,b)=>Math.floor(a/b),

callr=(o,k0,k1,...a)=>calcK(k=>(...a1)=>o[k0+k+k1].call(o,...a,...a1)),
extr=(T0,c)=>{ let k,K="__proto__",O=callr(Reflect,"","Property",c),m;for(k in c){f=fthis(c[k]); (m=/^([gs]et)_(.+)/.exec(k))?O.define(m[2],{[m[1]]:f})&O.delete(k) : c[k]=f;} c[K]=T0.prototype; return o=>(o[K]=c)&&o },
fthis=f=>function(...a){return f(this,...a)}, calcK=(f,o={})=>new Proxy(o,{get:(o,k)=>{let v=o[k]; if(v===undef)v=o[k]=f(k); return v}}),

feed=(s,i=0)=>n=>{
  let take=n=>n==1?s[i]: (s=>s===""?undef:s)(s.slice(i,i+n)), sloc=feed.fold_sloc(),o=Object.create(NO)
  if(n<0){n=-n; s1=take(n); i+=n} else
  s1=(n!=0)?take(n) : PPos([s,i,sloc,o])
  return s1
}
feed.fold_sloc=noOp;

PPos=extr(Array,{
  error(a,msg){ throw Error(`Parse "${a[0].slice(0,feed.nVp)}" fail @${a[1]}, "${a.peek}: ${msg}"`) },
  get_peek:a=>{ let nV=div(feed.nVp,2), [s,i]=a; return s.slice((nV>i)?0: i-nV, i)+"^"+s.slice(i,i+nV); },
  get_n:([s,i])=>s.length-i,
  get_sloc:a=>a[2]()
})

/*Ops.reduce 细节

reduce 本身不递归，它提供基于 t[], ti[] 父层索引号及 atom 的 r 函数展开下层并储其于此层 t[ti]
这样顶层必须先求值，故有 deep() 将逆序栈变为前序递归 reduce() 遍历

以 t(i) 的子树递归设计说明数组建模 AST, 选择何时深项先是可以的

以前后序队列 reduce() 有个问题，递归返回前根节点收集不到下层数组，但根随时需要整体副本，这个方法基于 r(i) 后层先赋值到自身[i] 可以，但动态建组不易理解(而且副本也不整体)

这样 deep() 就必须是 [+ a b] 形式的深数组，但如果咱格局打开， r() 靠 reduceRO 直接不存在，一切建模成栈更改时可 reduce 回嵌套数组，也能够(但没树路径)。

reduce(ops,f,f_n1)=>{
  lay=(t,copy)=>{ if(atom)ret copy(f_n1(t)); copy(t=[...t]);  f(i=>rec(t[i], x={t[i]=it})&t[i], r=>{copy(r)}) }
  lay(ops.a, {ops.tTop=it})
}

Ops{ a,kOrd=0~2; maxFirst(optab{s:[l,r,read_r?, f]},xs?); opto(); deep(); run(f_n1); toString; tTop; onCalc=(t,i,v,o)=>o.tTop }
其中 Symbol 是算符其它单项。

所做的 t[i] 复制&传指针是为即时链上结果，每层递归让下层复制树并最终自己归纳其结果，仅有可能被修改时才复制(所以后序栈不能用于这种模式 它[a nul]不整体)

toString 当包含项优先级比自己小时，加括号
刚刚想 1+(2*3) 里的直接换6 (二项皆叶子)有没有毛病，突然发现只是少了初末状态喔，那这东西干嘛这简单？
*/

let
tTop,
onCalc=(...a)=>console.log(n(a)==1?a.join():a[3].join(), [...a]),
runOps=(f,f_n1,t0)=>{
  let put=(t,copy)=>{ copy(t=[...t]); f(t,i=>{let tt=t[i];if(!n(tt)/*atom*/)return (t[i]=f_n1(tt)); put(tt, x=>{t[i]=x}); onCalc(tt,t,i,tTop);return t[i]}, copy);   } //若内容拿需先求值，此接口暴露OK
  onCalc(t0);put(t0,x=>{tTop=x});onCalc(tTop)
}

`1+2*3+4`
runOps((k,t,r)=>r(eval(`${t(1)}${k[0]}${t(2)}`)), i=>i, ['+',['+', 1,['*',2, 3]], 4])

let Ops,_infA=(n,f)=>{let inf=!isFinite(n), a=inf?[]:Array(n); f(inf? (...x)=>a.push(...x):a); return a},buildA=w=>_infA(Infinity,w)
{
  let  op=x=>"+*".includes(x)||typeof x==="symbol", ord=[//post,pre,deep; g=f_item
    (a,f,g)=>{let st=[],f_=(o,b,a)=>f(o,a,b); for(x of a)st.push(!op(x)?g(x): f_(x,st.pop(),st.pop())); return st[0]}, //k是st pop rev, t同k[i], r返回
    (a,f,g)=>{let i=0, r=()=>{let x;return !op(x=a[i++])?g(x): f(x,r(), r())}; return r()}, //k是a[i..], t是 r() 保既求小层>i 算再取
    (a0,f,g)=>{let r=x=>!Array.isArray(x)?g(x):f(x[0],r(x[1]),r(x[2])); return r(a0)} // 支持 onCalc, 上2只能给 o 本身
  ], ordK=(k,f)=>o=>{if(o.kOrd!=k){o.a=k==2?o.reduce(f):buildA(w=>o.reduce(f(w)) ).filter(x=>x!==undef); o.kOrd=k} return o},
  T=extr(Object,{
    reduce:(o,f,f_n1=noOp)=>ord[o.kOrd](o.a,f,f_n1),
    stack:ordK(0,w=>(o,a,b)=>{w(a,b,o)}),
    opto:ordK(1,w=>(o,a,b)=>{w(o,a,b)}), //大意了，不能用插入..
    deep:ordK(2,(o,a,b)=>[o,a,b]),
    run:f_leaf=>{
      //提供 k,t,r 的接口给非 deep; 提供 onCalc
    },
    toString:o=>{
      let a0=o.deep(), r=(a,lout)=>{ //优先级前序遍历,其实可分左右
        if(Array.isArray(a))return `${a[1]} ${a[0]} ${a[2]}`
        let l=o.tab[l][1]; return (l<lout)? `(${r(a,l)})`:`${r(a,l)}`
      }
      return r(a0,Infinity)
    }
  })
  Ops=(a,tab)=>T({a,kOrd:0,tab,tTop:null,onCalc:(t,i,v,o)=>o.tTop})
}

o=Ops(ss("1 2 3 * + 4 +"))
/*
为使 p?a:b 等语法能受分步求值的关照，动苏决定把 OpNArg (即Mixfix) 作为 atom 解析返加入 ktr 求值模型，引起了争论。

反：只有它和&&等极少数表达式有部分求值，没必要复杂化模型
正：a・b 式计算都有了分步求值，这框架已经很大了，而且 ktr 加入逆波兰栈也对泛化力有应得的帮助
反：原逆波兰支持 k 操作不直观，只有前缀法能支撑 ktr 的选择求值 t
正：那就只支持非惰性t，反正一转化的事；而且 op(a,b,c) 这种操作也应可分步骤
反：那么 class,func 这些定义呢？一个 {} 块要分步执行，也该做成表达式？ const 是不是常量折叠也算上？
正：理论上 {} 以内不是 for break 这些都可以用 ktr 形式，但 ktr 是记录顺序的，又不是给那些定义设计，不难吗？
反：那 return, delete, var, switch,try, typeof 这些语法呢？
正：要知道 . [ ( instanceof 都只是特殊右项的算符，<<  &是特殊参类型的算符而 typeof 是一元算符，s. 和 try, delete 可以作为单项但 {} 是Unit表达式!
反：循环不能作表达式？
正：总之Java这些顶层就是定义，方法体{}就是表达式，里面的 while 之类没求值步骤

[f,l,r,read_r?] 对前尾缀算符均有建模( r=-1/-2
负责判断算符前尾左右的是 bool 量

ops 看起来比以前 Trie 的版本效率低(而且有二重Map.get)，但其数据可序列化缓存，知道 optab 就能重复利用
 */

noWhite=(s,pWs,i0=0,tok=0)=>d=>{ //实际上i0是据s取的
  if(tok==0)pWs(s); return s(d)
},
noP=null,
re=c=>s=>{let a=[]; while(c.test(s(1)))a.push(s(-1)); return a.join("")},
plet=(p,op)=>s=>(r=>r==noP?r:op(r))(p(s)),
num=plet(re(/\d/), parseInt)

num(noWhite(feed("   567"),re(/\s/)))==567;

one=(...ps)=>s=>{let p,r;for(p of ps)if((r=p(s))!=noP)return r; return noP},

atom=one(num, plet(re(/[+\-*/]/), Symbol))
/*
noWhite 的到这里就结束了，要处理 spans/wsBefore 上层基本就要负责 按行:高亮背图更新&查询(k,i) ，那就要 行号Ta

那 {print("")} 都是存参数个数 1 的表达式了……

利用 OpNAry, 支持非二项运算，结果除了调用?:连{}if都成了返回 object 生效 的表达式？

后来发现 for,for-of,while 这些带参的{}也能做成返回循环次数(调试器用) 的 nA+N 参表达式…… 自带序列化? 顶层定义以下皆表达式？

var 则成了引入局部名副作用的一组赋值…… 只是词法域 Vars{inc(f{args,set nlocal,_maxDi})/dec, set,find, i,di, j} 表达式都不是

只有 delete Ref 不是表达式，语义写在单项求值里?

是否用 ter(tree,eval,ret) 取代 ktr(const,tt,res) 分组，决定是保留，r 和子项 t 才有对应性k


Vars 是动态作用域的抽象，它与 VarStack 共享 consts 数组和全局表
at(k)得到 VarRef 供 Stack 求值时利用，S. 上有这些操作

push(fn,arg,()=>t(3)) 调用
make(fn) 若 maxDi 非0以栈slice创建闭包
get(vref) 取局部、上部、全局、常量


Vars 在解析和执行阶段都有用到！它在解析期把 name str 变成局部量编号，执行时却要 S. 去取这些编号

语法(SOMe)和语义(Ops)阶段重复多吗？其实只有 +-* / ! 这些运算符有重叠，数据大部分不通用；所以 Vars 只负责 .st("scop") 存与解析流，总体结束时 .grab() 下 S. 对象，它提供 get, push/make 的 atom,optab 给 Ops.run 执行

对于 Java class, AXML 等有常量池的结构，scanjs 读存前置常量池，暴露 get(k), add(v)，提供基 p.let 的解引用方法，在写入临时buf时收集出常量池并整理顺序即可

*/
