//插入冒泡,快排,合并排 四排序算法 文本可视化
const
n=o=>o.length,ss=s=>s.split(" "),$YN=f=>[f(1),f(0)],doc=document,//抱歉 缩写区
newA=(n,op=noOp)=>{let a=Array(n),i=0;for(;i<n;i++)a[i]=op(i); return a},noOp=(x=>x),NO=null,

lnReplace=e0=>i=>{ //移到行i覆盖, i->多j
  let nd=i+1 -n(e0.childNodes), e;
  if(nd>0)while(nd--)e0.append("\n");//补齐nd个空行
  e=e0.childNodes[i]; e.__proto__={__proto__:e.__proto__,get s(){return this.textContent.slice(0,-1)},set s(v){this.textContent=v+"\n"}};
  return e
},
wordIns=(s,i,ss)=>{ //移到列j插入
  let nFil=i-n(s), sF=nFil>0?" ".repeat(nFil):""; //补齐空列
  return(nFil>=0||/\s/.test(s[i]))? s.slice(0,i)+sF+ss+s.slice(i)
  : s.slice(0,i)+/(\S*)/.exec(s.slice(i))[1] +ss //位置含词 不得打断它
},
_el=(t,...c_ee)=>{t/*tag*/=t.nodeType?t:doc.createElement(t); while(typeof c_ee[0]=="function")c_ee.shift()(t); for(let x of c_ee)t.append(x); return t},
el=new Proxy(_el, {get:(o,k)=>o[k]||(o[k]=(...a)=>_el(k,...a))}),
ref=(o,k)=>v=>(v==NO)?o[k]:(o[k]=v), also=(o,f)=>{f(o);return o};

console.log(_r=["a 1 x", "a 0 x", " 0 x", "abc 1 h", "abc 4 h", "i 1 i1"], _r.map(s=>wordIns(...ss(s)) ), wordIns(" i",0,"i1"))

//配置
升=1, 正序=(a,b)=>a==b||(升?a<b : a>b),
令序=(o,a,b)=>{let va=o[P.i(a)],vb=o[P.i1(b)]; if(!正序(va,vb)){o[a]=vb;o[b]=va;P.upd()}  },
乱=(a,N)=>a.splice(0,n(a),...newA(N).sort(()=>Math.random()<0.5?-1:1)),

cfg={kAlg:1,kDisp:0,code_pre:"乱(入,10); app.e.innerText='' ",dt:400, osc:"sine",rnOsc:[]},
app={e:NO,eFi:NO,ed:NO,c0:"algCode",ao:NO,ops:[]}, //P,入
dep=2;//递归行深

wStyle=s=> e=>{e.style.cssText=s}, wA=o=> e=>{for(let k in o)if(k[0]=="F") e["on"+k.slice(1)]=ev=>o[k](ev.target); else e.setAttribute(k,o[k])}, // DOM 创建助
href=(tag,u)=>new Promise((res,rej)=>{let e=doc.head.appendChild(el(tag,wA({src:u})));e.onload=res;e.onerror=rej})

addLabel=(s,e)=>el.span(el.label(wA({for:s}),s+"："), e)
el.inp=(id,type,vr)=>addLabel(id, el.input(wA({id,type,value:vr(),checked:vr(),Fchange:type=="checkbox"? e=>vr(e.checked) : e=>vr(e.valueAsNumber||e.value)  })) );
el.opt=(id,o,vr)=>addLabel(id, also(el.select(wA({id, Fchange:n(o)?e=>vr(e.selectedIndex) : e=>vr(e.value)})), e=>{let v0=vr(),c=e.options,k;if(n(o)){for(k of o)c.add(new Option(k)); c[v0].selected=1} else for(k in o)c.add(new Option(k,o[k],/*isDeftSel*/0,o[k]==v0)) } ))
;//el(doc.body,el.opt("ff",{red:"red",no:""},ref(doc,"bgColor")))

//界面交互: 文本动画框, (算法 渲染 dt 排序前动作)
el(doc.body, app.e=el.div(wStyle(`border: 1px solid;white-space: pre;
  resize: both;overflow: scroll;
  min-height: 200px; font: 20pt Consolas,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New,monospace;`)),
   el.hr(),
   el.inp("升序","checkbox", v=>v==NO?升:(升=v) ),
   el.opt("算法", ss("插入 冒泡 快速 合并").map(k=>`${k}排序`).concat(ss("例0 例0b 例1 例2")), ref(cfg,"kAlg") ),
   el.opt("渲染方式", ss("文本 柱形 散点"), ref(cfg,"kDisp") ), //修改P变量添加支持略麻烦，和 osc 参数“可听化排序”下期做
   el.inp("帧时差", "number", ref(cfg,"dt")),
   el.inp("预备","",ref(cfg,"code_pre")),
   el.button(e=>e.onclick=()=>{
     let cs,ce; if((ce=app.ed.session)!=NO){  cs=ce.getValue(); if(app.c0!=cs){eval(cs);app.c0=cs}; }//手动编辑
     eval(cfg.code_pre); P.upd(); app.ops[cfg.kAlg](入); console.log(app.ao=P.anim(),入); app.eFi.lastChild.value=n(app.ao.a) }, "记录!"),
   app.eFi=el(el.inp("播放#","number",v=>v==NO?0 : (app.ao.i=v)), wA({Fclick:e=>{let c=app.ao; if(c.tid){clearInterval(c.tid);c.tid=0;e.value=c.i} else c.play(cfg.dt)  } })),
   el.hr(),
   app.ed=el.pre(wStyle(`min-height:200px`))
).toggleAttribute("ContentEditable")

editCode=async(e,theme="ace/theme/tomorrow")=>{
  if(!window.ace){ await href("script","https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.12/ace.js"); ace.config.set("basePath", "https://unpkg.com/ace-builds@1.4.12/src-noconflict"); }
  let ed=ace.edit(e); ed.setOptions({theme, mode:"ace/mode/javascript", highlightActiveLine:true, wrap: "free"});
  return ed;
},
_code=f=>String(f).slice(n("function(){\n"),-1);

PVis=Object.assign((e0,a,i0=1)=>{ //< 可视模型本尊
  let ln=lnReplace(e0), U=()=>PVis._a.push(e0.textContent)/*帧*/, upd=()=>{ln(i0).s=a.toString();U();return 1}; upd()
  return{//画布操作
  ptr:(k,di=-1)=>ia=>{
    let j=ia==0?0:n(a.slice(0,ia).toString())+1, e=ln(i0+di);
    e.s=wordIns(e.s.replace(k,""),j,k,"");U();
    return ia
  },
  vstr:(s_pre="", di=2)=>o=>{
    ln(i0+di).s=`${s_pre} ${o}`;U(); return o
  },upd,
  anim:(a=PVis.out(),i=0)=>({e0,a,tid:0,//既录播放
  set i(v){e0.textContent=a[i];i=v},
  play(dt=500){return new Promise(done=>{let N=n(a),o=setInterval(()=>{if(this.i+1>=N)clearInterval(o)&done(); this.tid=o; this.i++},dt) })},
  get i(){return i}
})}
}, {_a:[], out:()=>PVis._a.splice(0,n(PVis._a))})

//四算法
入=[],P=PVis(app.e,入);
P.i=P.ptr("i");P.i1=P.ptr("i1");

四法=function(){
[插入,冒泡]=$YN(q=>a=>{ //俩交换排序
  let i,i1=n(a)-1; if(i1<1)return a;
  if(q) for(;i1!=-1;i1--)  for(i=0;i<i1; i++) 令序(a,i,i1);
  else for(;i1!=-1;i1--)  for(i=1;i<=i1; i++) 令序(a,i-1,i); //0止i1 和 1至i1
});

快排=a=>{ // O(nL*nR) 复杂度,即地排序
  _排(0,n(a), (i0,iC,i1)=>{for(i=i0;i<iC;i++)for(let im=iC;im<i1;im++) 令序(a,i,im);})
},
合并排=a=>{
  let 合并=(i,iB,i1)=>{//v 有序即地合并aa,b 序列
    let aa=a.slice(i,iB),b=a.slice(iB,i1), _O=P.ptr("iO",1),_b=P.vstr("bord") ,iO=i,x;
    while(n(aa)&&n(b)){a[_O(iO++)]=_b(正序(aa[0],b[0])?aa:b).shift(); P.upd() }
    for(x of _b(n(aa)>n(b)?aa:b)){a[_O(iO++)]=x; P.upd() }
  }
  _排深先(0,n(a), (i0,iC,i1)=>{if(i1-i0==2)return 令序(a,i0,iC)/*会快点*/;  合并(i0,iC,i1)})
},


_排=(i0,i1,f)=>{
  let iC=i0+Math.floor((i1-i0)/2); if(iC==i0)return;
  P.ptr("iC",dep)(iC); f(i0,iC,i1); dep++;_排(i0,iC,f); /*0<iC<1*/  _排(iC,i1,f);dep--; //好深
},
_排深先=(i0,i1,f)=>{
  let iC=i0+Math.floor((i1-i0)/2); if(iC==i0)return;
  dep++;_排深先(i0,iC,f); /*0<iC<1*/  _排深先(iC,i1,f);dep--;  P.ptr("iC",dep)(iC);  f(i0,iC,i1); //副本
},

用排=(f,a,i0,i1)=>{ //待更新 TimSort,ShellSort 呦
  if(i1-i0<2)return;
  let _i=P.i,_i1=P.i1; P.i=v=>{_i(i0+v);return v}; P.i1=v=>{_i1(i0+v);return v}//子指针
  let b=a.slice(i0,i1); f(P.vstr("b")(b)); for(let i=i0,ib=0;i<i1;i++,ib++)a[i]=b[ib];
  P.i=_i;P.i1=_i1;
};

Object.assign(app.ops,[插入,冒泡, 快排,合并排]);
}

//四示例
例队列=q=>()=>{
  let f=P.vstr("刚刚:");
  f(q? "先进先出队列(FIFO)" : "后进先出队列(LIFO)，即栈")
  for(let s of q? ["点击按钮a,向框b输入\"哈\",HTTP请求被回复,窗口关闭","小鸭子,它的朋友,它朋友的朋友"]:["前端DOM数据视图/模板,服务器/软件运维,数据库,开发后端服务程序","JQ-缩写DOM/Vue/Angular,各种Linux/WAF反带/Webmin,Postgres/Mongo/MySQL,JavaEE"]){
  s.split(",").forEach(k=>{ 入.push(k); P.upd(); P.i1(n(入)-1); f("添") }) //^队栈操作
  while(n(入)){f(`泡 ${q?入.shift():入.pop()}`);P.upd()}
  }
  if(q){f`主线程绘制循环：poll()等待新事件……`
  f`线程任务不可分叉/打断，需以队列按时序得空调度执行`}else{
  f`为何叫技术栈?`;f`x这么理解：越后学越难，易先忘`
  f`前端框架确定，再选后端更自然；全栈服务~`}
}

app.ops.push(0,0,0,0,
()=>{
let i,Piz=P.vstr("x="), a=app._1st,b=a+5; Piz(`从${a}数至${b},左添加`);P.i(0)
for(i=b;i>=a;Piz(i--)){入.unshift(i);P.upd()}
},
()=>{
let i,Piz=P.vstr("x="), a=app._1st,b=a+5; Piz(`从${a}数止${b},添加`)
for(let i=a;i<b;Piz(i++)){入.push(i);P.upd();P.i(i-a)}
},
例队列(1),
例队列(0)
  )
app._1st=100;

editCode(app.ed).then(o=>{app.ed=o; o.session.setValue(_code(四法)) })
.catch(()=>eval(_code(四法)));
