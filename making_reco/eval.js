function mk(op) {
  const get=(o,k)=>{
    if(k=="Y"){calc=s=>eval(s);return 0}
    if(calc)console.log(calc(k))
    return o[k]
  };
  let calc, base=new Proxy({}, {get,has:(o,k)=>(k in o)||(k=="Y")})
  with(Object.defineProperty({}, "Y",{get:()=>{calc=s=>eval(s); return 1}})){eval(op)} // 看起来不行，op get 不到 "Y" 的 binding
  with(base){return eval(String(op).slice("_=>".length))}
}
//(()=>{let a=1;mk(_=>Y||a)})()

eys="a";
Object.defineProperty(globalThis, "ey", {get:()=>eval(eys)})

{
  let a=1;
  //(f=>console.log(f()))(_=>ey) // 还是不行
}

String.prototype.Y=function(){return eval(String(this))}

{
  let a=1;
  //(f=>console.log(f("a")))(_=>_.Y())
}

const e=eval;
{
  let a=1;
  (f=>console.log(f("a")))(_=>eval(_)) // 原来 eval 是很特殊的函数，它的块作用域是在闭包本层, window.eval 也不行，它作为值也不能
}
//https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/eval#don.27t_use_eval.21
//http://es5.github.io/#x15.1.2.1.1 规范强制禁止了任何简化，包括 .call 等“安全”做法；此外严格模式 eval 会有块级作用域
//https://stackoverflow.com/questions/8403108/calling-eval-in-particular-context

//发现 mk(_=>eval(_)) 设置成全局变量可能内存泄漏，那是不是还要带尾部 mk(0) ，干脆弄了个 run_e, funce 帮填 _=>eval 好了，可是它仍“偷”不来其上下文的变量，但能和外部语言侧统一化定义函数。

//等等，或许可以 eval(mk) 来引入，可仍有内存泄漏问题

a=2; (()=>{ eval(`let a=1`); return a})(); a==2

mk.toString=console.log;ey1=""
eval(mk+ey1)
