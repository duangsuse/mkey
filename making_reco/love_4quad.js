let{sqrt,abs}=Math;

love=a=>(x,y)=>(r=> a*y+r - a*sqrt(r)) (x**2+y**2)

let $D=document,
e=$D.body.appendChild($D.createElement("canvas")),
g=e.getContext("2d");

draw=()=>{};
(onresize=()=>{let l=(c,s)=>{c.width=innerWidth+s;c.height=innerHeight+s}; l(e,"");l(e.style,"px");draw()})()

let hasStep=0^1, putP;
(onclick=()=>{
  hasStep^=1
  putP=!hasStep?(x,y)=>Promise.resolve(g.fillRect(x,y,1,1)) : (x,y)=>new Promise(res=>setTimeout(()=>res(g.fillRect(x,y,1,1)), 1))
})()

vp_xy=[-0.8,.156], k_xy=[1,1],

eachP=f=>{
  let ix=0, iy=0, w=e.width,h=e.height, [x,y]=vp_xy,[kx,ky]=k_xy,//越大区域大 采样率持平
    dx=kx/w,dy=ky/h, x0=x;
  for(;iy<h;iy++, y+=dy)for(ix=0,x=x0;ix<w;ix++, x+=dx)f(x,y,ix,iy);
}


scan=async(rnXY,f,d=0.012)=>{//基本分像素搜索
  let {width:w,height:h}=g.canvas,
    [x0,x1,y0,y1]=rnXY,sil=d>0.01? d+d*0.65 : 2*d,
    kx=w/(x1-x0),ky=h/(y1-y0), x,y, Px,Py; //如何把 rnXY 放大到画布?
  const
    intoP=()=>{Px=x0+x/kx, Py=y0+y/ky;}, //迭代画布系快了很多
    ok=(Px0,Py0)=>{
      x++,y++; intoP(); y--; //now got P X,Y range
      let X,Y;
      for(Y=Py0; Y<Py; Y+=d)for(X=Px0; X<Px; X+=d)if(abs(f(X,Y))<sil)return true;
      return false
    }

  for(y=h;y!=0;y--)for(x=0;x<w;)
    if(intoP()|ok(Px,Py)) await putP(x,h-y);
}
crosScan=f=>{//从画布四边扫向中心. 或可靠 vp_xy 实现移动后仍能正确扫心
  let // 但 scan 只是把有移动与缩放的区间放到画布，没靠屏幕系，故画布缩放会失真
  p=(x,y)=>f(x,y)<sil,
  minMax=(l,p)=>v=>{
    let v0=0,v1=l-1, r0,r1; for(;v0!=v1;) {
      if(r0==null){ if(p(v0,v))r0=v0; else v0++; }
      if(r1==null){ if(p(v1,v))r1=v1; else v1--; }
    }return [r0,r1]
  },
  xl=minMax(w,p)
  yl=minMax(h,(y,x)=>p(x,y)),
  len=(f,v)=>{let[a,b]=f(v); return b-a}//有内容

  let [x0,x1]=xl(w/2);
  while(len(yl, x0-1))x0--;  //叉出两个 yl 扩张 x 区域
  while(len(yl, x1+1))x1++;
  let [y0,y1]=yl(h/2);
  while(len(xl, y0-1))y0--; //y同理
  while(len(xl, y1+1))y1++;
  return [x0,x1,y0,y1]
},
fourScan=f=>rnXY=>{
  let[x0,x1,y0,y1]=rnXY, q=false;
  quadL(rnXY, (x,y)=>{})
  if(q|| x1-x0<2&&y1-y0<2)return;

  let R=fourScan(f),xC=vC(x0,x1),yC=vC(y0,y1);
  R(x0,yC,xC,y1);R(xC,yC,x1,y1);R(x0,y0,xC,yC);R(xC,y0,x1,yC)
},
quadL=(rnXY,P)=>{
  let x,y, xv,yv;
  //若框 x0+1=x1 即x长=1, 请考虑 2*3 或 3*2
  for(xv of[x0,x1]) for(y=y0;y<y1;y++)P(xv,y) //左右下上
  for(yv of[y0,y1]) for(x=x0;x<x1;x++)P(x,yv)
}

//预期: cros有xy红蓝动画、four有黄绿动画，心跳 a 参数有动画
//拖动,右键框选缩放:ky=先移动再比h, 双击扫描

setTimeout(()=> scan([-3,3, -5, 1],love(2.23)), 1000)

julC=null,
mandel=(nIter=60)=>{
  let f=(Px,Py)=>{
    let x=0,y=0, i=0,x1=0;
    if(julC!=null){x=Px,y=Py; [Px,Py]=julC} //0,0+N(P x y) vs. Pxy+N C
    do {
      x1=x*x-y*y +Px; y=2*x*y +Py; x=x1
    } while(i++ <nIter&&(x*x+y*y)<4)
    return i-1
  }
  eachP((x,y,sx,sy)=>{let i=f(x,y);if(i==0)return; g.fillStyle=`hsl(0,100%,${i/nIter*100}%)`;putP(sx,sy)})
}
draw=mandel


//
scan_LPerf=()=>{
  Pfn=f=>(x,y)=>{let{vx,vy,kx,ky}=cfg; return f(x+vx/kx, y+vy/ky)}
  let {w,h, vx,vy,kx,ky, gF,sil,d}=cfg, x,y, Px,Py
  ok=(X0,Y0)=>{let X1,Y1, X,Y;
    Pfn((_1,_2)=>{X1=_1,Y1=_2})(x+1,y+1)
    for(Y=Y0; Y<Y1; Y+=d)for(X=X0; X<X1; X+=d)if(abs(gF(X,Y))<sil)putP(x,h-y);
  }, P=Pfn(ok);
  for(y=h;y!=0;y--)for(x=0;x<w;x++)P(x,y);
}
