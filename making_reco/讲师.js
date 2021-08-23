const//示范y函数,t迭代式的动画,测试曼分形和隐函数搜索视口参数正常,还有其缩放动画；本最好是同时兼容三类绘图的v0k视口,从而允许缩放历史,区分繁故仅示算法
{sqrt,abs,round, sin,cos,PI}=Math,
$D=document,
[eG,eTa]=["canvas","textarea"].map(k=>$D.body.appendChild($D.createElement(k))),
g=eG.getContext("2d"),
find=(v0k,f)=>{//v 可作 g&cFind 上的方法
  let {d,dsov,dvis, bgSov,bgVisf}=cFind, [x,y0,kx,ky]=v0k
  let ix=0, iy=0, dx=kx/w,dy=ky/h, y=y0
  for(;ix<w; ix+=1,x+=dx)for(iy=0,y=y0;iy<h; iy+=1){//竟把y给ix=0,迭麻了
    let X,Y,l, X1=x+dx, Y0=y; y+=dy; for(X=x; X<X1; X+=d)for(Y=Y0; Y<y; Y+=d)
    {l=abs(f(X,Y)); if(l<dvis){g.fillStyle=(l<dsov)?bgSov:bgVisf((dvis-l)/dvis); g.fillRect(ix,h-iy,1,1)} }
  }
},cFind={d:0.05,dsov:0.02,dvis:0.5,  bgSov:"red",bgVisf:near=>`rgba(${rate(120,255,near)} , 30, 99, ${near}`},
rate=(a,b, k)=>a+ k*(b-a),
view=rn2P=>{let a=rn2P,[x0,y0,x1,y1]=a; a[2]=(x1-x0),a[3]=(y1-y0); eG.height=h=(a[3]/a[2])*w; return a},
o={set wh([w,h]){let e=g.canvas,l=(c,s)=>{c.width=w+s;c.height=h+s};  l(e,"");l(e.style,"px")},
p:(a,i)=>{ a[i]=vx+a[i]/kx; a[i+1]=vy+a[i+1]/ky} }//你们去cFind吧,这样 find 就还是全局的了?

let {width:w,height:h}=eG;

anim=(dur,v,f, ease=x=> -cos(x*PI)/2 +0.5)=>new Promise(done=>{//亦可有 anim(时,[o,{width:200}, {height:20} ],(o,w,h)=>) API, lv=v1-v0缓存,*v[i]=v0[i]+lv[i]*k
let dt=tf/dur, t=0.0,t1=1.0*nRep, id=setInterval(()=>{ f(...v.map( ([v0,v1])=> rate(v0,v1,ease(t)) ) ); (t<t1)?(t+=dt): done(v)&clearInterval(id)}, tf)
}),
mandel=(nIter=60)=>(Px,Py)=>{
  let i=0, x=0,y=0,x1=0;
  if(julC!=null){x=Px,y=Py; [Px,Py]=julC} //0,0+N(P x y) vs. Pxy+N C; 别用do while
  while(i<nIter&&(x*x+y*y)<4) {i++;
    x1=x*x-y*y +Px; y=2*x*y +Py; x=x1} return i/nIter//即 Z=Z*Z+C, 2xy=xy+yx,mod=sqrt(xx+yy) <2
}
let tf=(1000/ 60), nRep=4*2, julC=null

gCached=(f,frac=1000,c=new Map)=>a=>{g.clearRect(0,0,w,h); a=round(a*frac)/frac; let b=c.get(a); (b!=null)?g.putImageData(b,0,0) :f(a)&c.set(a,g.getImageData(0,0,w,h))} //round缓存命中率好

eTa.rows=20;eTa.value="再见烂码".repeat(100); eTa.select();
0&&anim(2000, [[0,eTa.textLength], [60,30]], (i,n)=>{eTa.selectionEnd=round(i); if(i%4==0)eTa.setRangeText("别找麻烦".repeat((i-1)/4).padEnd(i,"！") ); eTa.cols=n})

zip=(a,b)=>a.map((x,i)=>[x,b[i]]),
getOrCalc=(d,k,init)=>{let v=d.get(k);if(v===void 0)d.set(k,v=init()); return v},
gXYCached=(f,fst,frac=1000,c=new Map)=>(x,y)=>{
  const tu=v=>round(v*frac)/frac, cc=v=>getOrCalc(c,v,()=>new Map) //y*frac+abs(x)
  y=tu(y),x=tu(x); let s,b; //if(b!=null){if(y==0) g.putImageData(b,0,y);return 1}else{c.set(s,g.getImageData(0,y,w,1));return f(x,y)}
  //if(b==null){s.set(x,b=f(x,y))}return b //(b!=null)?b : c.set(s,r=f(x,y))&&r
  if(fst[0]){fst[0]=false; s=cc(y),b=s.get(x); (b!=null)?g.putImageData(b,0,0)&(fst[1]=false) :cc(fst[3]).set(fst[2],g.getImageData(0,0,w,h))&g.clearRect(0,0,w,h); fst[2]=x,fst[3]=y}
  return fst[1]?f(x,y): Infinity;
}//还是按照每帧左上点弄吧
if(1){cFind.bgVisf=i=>`hsl(122,35%,${i*100}%)`
cFind.d=1;cFind.dsov=.1;cFind.bgSov="cadetblue";cFind.dvis=20/60;
let a=[true,true,0,0], f=gXYCached(mandel(), a)//gCache不适用多参
anim(5000, zip(view([-2,-1,.5,1]), [-0.8,.156,1,1]), (...v)=>{a[0]=true,a[1]=true;  find(v,f)})
}
[0.3,3.3];

love=(a,c=0.5)=>(x,y)=>x*x+(y-abs(x)**c)**2 -a

0&&view([-2,-2, 2,3])&find(view([-2,-2, 2,3]), love(2.4))//闭包创建还是让人易错,经常忘给a; 说起来 x&y, y/x, t 函数的区分还是要靠参数名啊...

if(0)for(let l=f=>2*f(t)-f(2*t), t=0;t<2*PI;t+=0.1) putP(l(sin), l(cos)) //都得有x0y0 x1y1
if(0)for(let x=vx,dx=kx/w;x<w;x+=dx)putP(x,(f(x)-y0)*ky) //x 于 0~w 映射数学世界, (y-y0)*ky 映射回屏幕
