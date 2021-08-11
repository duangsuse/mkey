optab={且:[2,"&"],是:[3,"="]} //级小者容大靠顶层；级大者先算靠末端；叶节点不是同法算

const
n=o=>o.length,x1=o=>o[n(o)-1], //助 长度、末项
popWhile=(p,f,xs)=>{while(n(xs)&&p(x1(xs)))f(xs.pop())},

evalSExp=o=>n(o)? (([k,...a])=>eval(`(a,b)=>a${k}b`) (...a.map(evalSExp))/*先求子项*/ )(o) : o/*叶:str,num,...*/;
console.log(evalSExp(['*',1,['-', 5, 2]])) //n(o)试数组 等同于 AST Op(*, Lit(1), Op(-  于 eval():Int 操作基于子类型函数覆盖 区别求值

const
infix=(xs,w, sP="()")=>{
  [...sP].forEach(k=>{optab[k]=0}) //*仅初次
  let st=[], pu=x=>st.push(x),l=x=>optab[x][0], //逆波兰算符重排-至后序。整理 xs 操作顺序写至 w(): 1*2+3= [1 2 * 3 +]
    close=()=>st.splice(st.indexOf(sA)-1,n(st)).reverse().forEach(w),
    [sA,sB]=sP, x;
  for(x of xs) !(x in optab)?w(x) : (
    x==sA?pu(x) : (x==sB)? popWhile(x=>x!=sA,w, st)&st.pop() : // (1+2)* 孤立内部优先级
    n(st)&&l(x1(st))>=l(x)? close()&pu(x) : pu(x) // 遇 +*  升序直接等 close:*+ ，降序 1*2+ 则先 close 前* 再等+之参数
  )
  close();
},

reduceRO=(a,op,st=[])=>{
  for(let x of a) st.push(!(x in optab)? x : op(x, ...st.splice(n(st)-2,n(st)) )/*actual call*/)
  return st[0]
};

sco={N:9, a:1,b:2}, //eval作用域，浏览器端必要，但会影响整个{}内部变量名
binop=(k,sa,sb)=>{
  let _r;with(sco){_r=eval(`[${sa},${sb}]`)}
  let [a,b]=_r //叶子:JS表达式
  return k=="是"? (a==b) : k=="且"? (a&&b) : null //枝:二中缀运算
}

`a是1且b是2
N是N且(1-1)是0
"x"是"x"是true且1
"x"是("x"是true)
(N是N且false)`.split("\n").map(s=>/\s+|([()且是])/[Symbol.split](s).filter(m=>m!="") )
.forEach(a=>{let b=[]; infix(a,x=>b.push(x)); console.log(b,reduceRO(b,binop)) }) // infix,RO 实应封作同 class(optab)


/*如何实现递等式(带计算过程)？它同样能实现 coroutine 协程和调试器！

求值时别看子树返回值，而是把当前层的副本交给它！表达式顶层仍有值，于是外包一层无值的 [] 让它放结果。
这种方法 (1+2)+3 时这左项会重复2次(1,2 常量各一次)，才是 3+3=6 ，故封装 r(t[i]=tt) 去求子树，遇常量不通知 on_exp(t,i,v,t_top) ，且基于上层隐含本层 t 参数

以上，yield x 只需throw回顶层，存既算值待下次；调试器可以 on_exp 提供步过/入/查覆值的操作 更能！
*/

/*atom和(op a b)有何区别？

从数据类型它们是一样的！但顶层有可能是单个 atom ，故有必要切分语义

为折叠表达式时方便，这适合以特殊类型封装，避免对op结果重复应用 atom 语义。

 */
