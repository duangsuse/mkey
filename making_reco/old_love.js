love=a=>(x,y)=>(r=> a*y+r - a*Math.sqrt(r)) (x**2+y**2)

e=document.body.appendChild(document.createElement("canvas")), N=400
{let l=(c,v)=>{c.width=c.height=v}; l(e,N);l(e.style,N+"px")}
g=e.getContext("2d");

scan=(rnXY,f,d=0.002)=>{
  let [x0,x1,y0,y1]=rnXY, sil=d*2,
    kx=N/(x1-x0),ky=N/(y1-y0), x=x0,y=y0;//k:宽高之长与xy值-像素位置比率,x,y-起点 映射至宽,高N画布

  for(;y<y1;y+=d)for(x=x0/*注意*/;x<x1;x+=d)if(Math.abs(f(x,y))<sil) g.fillRect((x-x0)*kx,N-(y-y0)*ky, 1,1);
}
scan([-3,3, -5, 1],love(2.23))

//给你的爱心上色<3
e.onclick=ev=>{ g.fillStyle="red"; bfsClosen(g,ev.offsetX,ev.offsetY, (x,y)=>{g.fillRect(x,y,1,1)})  }
bfsClosen=(g,x0,y0,f_xy,test=(i,a)=>a[i+3]==0)=>{
  let a=g.getImageData(0,0,N,N),nA=(N*N), //RGBA
   w=a.width, pd=[-1,1,-w,w], p=(x,y)=>y*w+x, ps=[p(x0,y0)],pNo=new Set;
  a=a.data, chk=p=>!test(p*4,a);
  if(chk(ps[0]))return;//才源点,不符合
  while(pNo.size!=nA-1){
    let p0=ps.shift(),d,p1; if(p0==null)return;//队空
    for(d of pd){p1=p0+d; if(chk(p1)||pNo.has(p1))continue; f_xy(p1%w, p1/w); ps.push(p1); pNo.add(p1)}
  }
}
