let{sqrt,abs,min,floor}=Math; love=a=>(x,y)=>(r=> a*y+r - a*sqrt(r)) (x**2+y**2) //4quad 新版, 大致算法实验成,溜了 

let $D=document,
g=$D.body.appendChild($D.createElement("canvas")).getContext("2d"),
also=(o,f)=>{f(o);return o};

let
putP=(x,y)=>g.fillRect(x,y,1,1),
cfg={gF:love(2.2), d:0.002,sil:0.02, //sil不可太小(2*d) , 这是单点扫描,不像 scan 有 XY 区间...; love(a 越小结部越浓)
w:0,h:0,
vx:0,vy:0,kx:1,ky:1,
set vpRN(rnXY){
  let [x0,x1,y0,y1]=rnXY, {w,h}=this
  Object.assign(this,{vx:x0,vy:y0,kx:w/(x1-x0),ky:h/(y1-y0)})
},
set wh([w,h]){this.w=w;this.h=h; let e=g.canvas,l=(c,s)=>{c.width=w+s;c.height=h+s};  l(e,"");l(e.style,"px")},
p(a,i,d){let{vx,vy,kx,ky}=this; a[i]=vx+a[i]/kx; a[i+d]=vy+a[i+d]/ky}
}
;

cfg.wh=Array(2).fill(min(innerWidth,innerHeight));

scan=()=>{
  let {w,h, vx,vy,kx,ky, gF,sil,d}=cfg, x,y, Px=vx,Py
  const
    setY=()=>{ Py=vy+y/ky},
    ok=(X0,Y0)=>{
      x++,y++; Px=vx+x/kx; setY(); y--; //now got P X,Y range
      let X,Y;
      for(Y=Y0; Y<Py; Y+=d)for(X=X0; X<Px; X+=d)if(abs(gF(X,Y))<sil)putP(x,h-y);
    }
  for(y=h;y!=0;y--)for(x=0;x<w;){setY();ok(Px,Py)}
}

crosScan=(xC,yC)=>{
  let{w,h, vx,vy,kx,ky, gF,sil}=cfg; //手动内联
  const p=(x,y)=>{putP(x,h-y); return abs(gF(vx+x/kx, vy+y/ky))<sil},
  minMax=(l,p,color)=>v=>{
    g.fillStyle=color;
    let v0=0,v1=l-1, r0,r1; for(;v0!=v1;) {
      if(r0==null){ if(p(v0,v))r0=v0; else v0++; }
      else if(r1==null){ if(p(v1,v))r1=v1; else v1--; }
      else return [r0,r1]
    }return [0,0]
  },
  xl=minMax(w,p,"red")
  yl=minMax(h,(y,x)=>p(x,y),"blue"),
  len=(f,v)=>{let[a,b]=f(v); return b-a}//有内容?

  let [x0,x1]=xl(yC);
  while(len(yl, x0-1))x0--;  //叉出两个 yl 扩张 x 区域
  while(len(yl, x1+1))x1++;
  let [y0,y1]=yl(xC);
  while(len(xl, y0-1))y0--; //y同理
  while(len(xl, y1+1))y1++;
  return [x0,x1,y0,y1]
},
toP_RN=a=>{cfg.p(a,0,2);cfg.p(a,1,2)}

cfg.vpRN=[-3,3, -5, 1]
rect=crosScan(cfg.w/2,cfg.h/2)

//cfg.vpRN=also([...rect],toP_RN)
g.canvas.onclick=ev=>{let a=[ev.offsetX,ev.offsetY]; console.log(...a,cfg.p(a,0,1),a) }
//scan()

quadScan=(x0,x1,y0,y1)=>{
  let{w,h, vx,vy,kx,ky, gF,sil,d}=cfg, q=false, x,y,Px=vx,Py=vy; //手动内联
  const p=(x,y)=>{putP(x,h-y); return abs(gF(vx+x/kx, vy+y/ky))<sil},//p=(x,y)=>abs(gF(x, y))<sil,
    setY=()=>{ Py=vy+y/ky},
    setX=()=>{ Px=vx+x/kx},
    ok=(X0,Y0,hor)=>{
      x++,y++; setX();setY();
      if(hor)y--;else x--;
      let X,Y;
      for(Y=Y0; Y<Py; Y+=d)for(X=X0; X<Px; X+=d)if(p(X,Y)){q=true;putP(x,h-y);}
    }
  quadL(x0,x1,y0,y1, (_1,_2,isHorz)=>{x=_1;y=_2;
    if(0){g.fillStyle="yellow";putP(x,h-y)
    //isHorz?setY():setX();
    g.fillStyle="black";}
    if(p(x,y)){q=true;putP(x,h-y);}//ok(Px,Py,isHorz)
  })
  if(!q){if(0&y1-y0>10)debugger;y1=h-y1,y0=h-y0;if(0)g.strokeRect(x0,y0,x1-x0,y1-y0); return}
  if(x1-x0<2&&y1-y0<2)return;

  const R=quadScan,xC=vC(x0,x1),yC=vC(y0,y1);
  R(x0,xC,yC,y1);R(xC,x1,yC,y1);R(x0,xC,y0,yC);R(xC,x1,y0,yC)
},
quadL=(a,b,c,d,P)=>{
  let x,y, xv,yv;
  //若框 x0+1=x1 即x长=1, 请考虑 2*3 或 3*2
  for(xv of[a,b]) for(y=c;y<d;y++)P(xv,y,false) //左右下上
  for(yv of[c,d]) for(x=a;x<b;x++)P(x,yv,true)
},
vC=(a,b)=>floor(a+(b-a)/2)
g.fillStyle="black"
quadScan(...rect)
