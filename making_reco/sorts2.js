const
n=o=>o.length,$YN=f=>[f(1),f(0)],//抱歉
升=1, 正序=(a,b)=>a==b||(升?a<b : a>b),
令序=(o,a,b)=>{let va=o[P.i(a)],vb=o[P.i1(b)]; if(!正序(va,vb)){o[a]=vb;o[b]=va;P.upd()}  },
[插入,冒泡]=$YN(q=>a=>{ //交换排序们
  let i,i1=n(a)-1; if(i1<1)return a;
  if(q) for(;i1!=-1;i1--)  for(i=0;i<i1; i++) 令序(a,i,i1);
  else for(;i1!=-1;i1--)  for(i=1;i<=i1; i++) 令序(a,i-1,i); //0止i1 和 1至i1
}),
_排=(i0,i1,f)=>{
  let iC=i0+Math.floor((i1-i0)/2); if(iC==i0)return;
  P.ptr("iC",dep)(iC); iC=f(i0,iC,i1); dep++;_排(i0,iC,f); /*0<iC<1*/  _排(iC,i1,f);dep--; //好深
},
_排深先=(i0,i1,f)=>{
  let iC=i0+Math.floor((i1-i0)/2); if(iC==i0)return;
  _排深先(i0,iC,f); /*0<iC<1*/  _排深先(iC,i1,f); f(i0,iC,i1);
},
快排=a=>{
  _排(0,n(a), (i0,iC,i1)=>{for(i=i0;i<iC;i++)for(let im=iC;im<i1;im++) 令序(a,i,im); return iC}) // O(nL*nR) 即地排序复杂度牛，用临时组本应 O(n) 靠 iC a1 iL iR 的
},
快快排=a=>{ //v 吓人的缓存,肝了半天
  _排(0,n(a), (i0,iC,i1)=>{let _1=P.vstr("a1"), a1=a.slice(i0,i1),iL=i0,iR=i1-1,x,vC=a[iC]; a1.splice(iC,1); while(n(a1)!=0){x=_1(a1).shift(); a[正序(x,vC)?P.i(iL++):P.i1(iR--)]=x; P.upd()} _1("OK"); a[iR]=vC;return iR })
},
合并排=(a,子=插入)=>{
  let 合并=(i,iB,i1)=>{
    //let iO=i,N=iB-i; while(i<N){a[iO++]=正序(a[i],a[iB])? a[i++] : a[iB++] } //没有保护ab,最坏情况它都能被覆盖
    let aa=a.slice(i,iB),b=a.slice(iB,i1) ,iO=i,x;
    while(n(aa)&&n(b)){a[iO++]=(正序(aa[0],b[0])?aa:b).shift(); P.upd() }
    for(x of n(aa)>n(b)?aa:b){a[iO++]=x; P.upd() }
  }
  _排深先(0,n(a), (i0,iC,i1)=>{用排(子,a,i0,iC); 用排(子,a,iC,i1); 合并(i0,iC,i1); }) // 它只要左右单独有序，不需右整体>左
  //_排深先(0,n(a), (i0,iC,i1)=>{if(dep!=d0){用排(子,a,i0,iC); 用排(子,a,iC,i1);} 合并(i0,iC,i1); }) // 不需右最小>=左大
},
用排=(f,a,i0,i1)=>{
  //f(new Proxy(Array(i1-i0),{get:i=>a[i0+i], set:(i,v)=>{a[i0+i]=v; return true}}))
  let _i=P.i,_i1=P.i1; P.i=v=>{_i(i0+v);return v}; P.i1=v=>{_i1(i0+v);return v}, _b=P.vstr("b")//子指针
  let b=a.slice(i0,i1); f(_b(b)); for(let i=i0,ib=0;i<i1;i++,ib++)a[i]=b[ib];
  P.i=_i;P.i1=_i1;
},
合并=function*(a,i,iB,i1=n(a)){//还有指针版
    let aa=a.slice(i,iB),b=a.slice(iB,i1) ,iO=i,x;
    while(n(aa)&&n(b))yield(正序(aa[0],b[0])?aa:b).shift()
    for(x of n(aa)>n(b)?aa:b)yield x
}//[...合并([5,6,7,1,2,5], 0,3)]
dep=2;
const doc=document,S=doc.getSelection(),SR=()=>S.getRangeAt(0),
// 嵌套层级： (a,i0始行号)=>(k,di针行差)=>ia=>移i0+di&重复移到词尾&选至词首;判断清除首同k;填足' '*j;插入j,k &移i0
sel={
  get s(){return S.toString()},
  set s(v){SR().deleteContents(); if(!v.nodeType)v=doc.createTextNode(v); SR().insertNode(v)},
  ln(i){
    let r=SR(),e0=r.startContainer.parentNode,e;
    let nd=i+1 -n(e0.childNodes);
    if(nd>0)while(nd--)e0.append("\n");//nd个空行
    e=e0.childNodes[i]; e.__proto__={__proto__:e.__proto__,get s(){return this.textContent.slice(0,-1)},set s(v){this.textContent=v+"\n"}};
    r.setStart(e,0); return e
  }
},
mvIns=(s,i,ss, sep_dup=null)=>{
  let nFil=i-n(s), sF=nFil>0?" ".repeat(nFil):"";
  return(sep_dup==null||nFil>=0||/\s/.test(s[i]))? s.slice(0,i)+sF+ss+s.slice(i)
  : s.slice(0,i)+/(\S*)/.exec(s.slice(i))[1] +sep_dup+ss
},
noOp=(x=>x),
newA=(n,op=noOp)=>{let a=Array(n),i=0;for(;i<n;i++)a[i]=op(i); return a};

doc.body.toggleAttribute("ContentEditable");

(eTa=doc.body.appendChild(doc.createElement("div"))).innerHTML=`
<div style="border: 1px solid;white-space: pre;
  resize: both;overflow: scroll;
  min-height: 200px; font: 20pt Consolas,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New,monospace;">
`

PVis=Object.assign((e0,a,i0=1)=>{
  S.selectAllChildren(e0.firstChild);
  let U=()=>PVis._a.push(e0.textContent)/*帧*/, upd=()=>{sel.ln(i0).s=a.toString();U();return 1}; upd()
  return{
  ptr:(k,di=-1)=>ia=>{
  let j=ia==0?0:n(a.slice(0,ia).toString())+1, e=sel.ln(i0+di);
  e.s=mvIns(e.s.replace(k,""),j,k,"");U();
  return ia
  },
  vstr:(s_pre="", di=2)=>o=>{
    sel.ln(i0+di).s=`${s_pre} ${o}`;U(); return o
  },upd,
  anim:(a=PVis.out(),i=0)=>({e0,a,
  set i(v){e0.textContent=a[i];i=v},
  play(dt=500){return new Promise(done=>{let N=n(a),o=setInterval(()=>{if(this.i+1>=N)clearInterval(o)&done(); this.i++},dt) })},
  get i(){return i}
})}
}, {_a:[], out:()=>PVis._a.splice(0,n(PVis._a)) })

if(0){let pv,a,Pi;
pv=PVis(eTa.children[0],a=[],2); Pi=pv.ptr("i"),Piz=pv.vstr("x=")
for(let i=100;i<105;Piz(i++)){a.push(i);pv.upd();Pi(i-100)}
console.log(an=pv.anim())
an.play(500)
}

入=[],P=PVis(eTa.children[0],入); P.i=P.ptr("i");P.i1=P.ptr("i1")
乱=N=>入.splice(0,n(入),...newA(N).sort(()=>Math.random()<0.5?-1:1))

//merge,shell(分组),TimSort,minmax, cocktail,bogo猴子
//std::sort Introsort,ins bottom-up merge,,odd-even 冒泡,梳comb冒泡,二分gnome,gravity,shatter,flash
乱(10);P.upd();合并排(入);P.anim().play(200)
//但是不支持暂停和调位/速 ，也没有数值渲染 xy=iv散点/柱形
//AudioContext{dest,createX} Oscillator{type=square,freq=Hz,connect,start/stop} note[0], 1000 * 256 / (note[1] * tempo), 100
示队列=(q)=>{
  let f=P.vstr("刚刚:");
  f(q? "先进先出队列(FIFO)" : "后进先出队列(LIFO)，即栈")
  for(let s of q? ["点击按钮a,向框b输入\"哈\",HTTP请求被回复,窗口关闭","小鸭子,它的朋友,它朋友的朋友"]:["前端DOM数据视图/模板,服务器/软件运维,数据库,开发后端服务程序","JQ-缩写DOM/Vue/Angular,各种Linux/WAF反带/Webmin,Postgres/Mongo/MySQL,JavaEE"]){
  s.split(",").forEach(k=>{ 入.push(k); P.upd(); P.i1(n(入)-1); f("添") })
  while(n(入)){f(`泡 ${q?入.shift():入.pop()}`);P.upd()}
  }
  if(q){f`主线程绘制循环：poll()等待新事件……`
  f`线程任务不可分叉/打断，需以队列按时序得空调度执行`}else{
  f`为何叫技术栈?`;f("x这么理解：越后学越难，易先忘")
  f("前端框架确定，再选后端更自然；全栈服务~")}
  an=P.anim();an.play()
}

playSeq=(a,kwav="sine",tempo=100)=>{
let au=new AudioContext,o;
(o=au.createOscillator()).connect(au.destination);
o.type=kwav; o.start();
let play=(v)=>{o.frequency.value=v; } // start/stop 只能一次，区别同音高大概要两个 osc 交替发声?，麻烦

let sq=()=>{if(n(a)==0)return o.stop();
  let[v,dt]=a.shift(); play(v);
  setTimeout(sq,1000 * 256 /(dt*tempo));
};sq()
}

doc.body.onclick=()=>playSeq("ÈD,ÈD,ÈD,@H,︵P,ńP,ÈD,@H,︵P,ńP,ÈD,︵D,ȐD,ȐD,ȐD,ɋH,︵P,ńP,£D,@H,︵P,ńP,ÈD".split(",").map(s=>(([a,b])=> [a==65536?0:((523-64)+a), b-64])([...s].map(c=>c.charCodeAt(0))) ))
