love=a=>(x,y)=>(r=> a*y+r - a*Math.sqrt(r)) (x**2+y**2)

e=document.body.appendChild(document.createElement("canvas")), N=400
{let l=(c,v)=>{c.width=c.height=v}; l(e,N);l(e.style,N+"px")}
g=e.getContext("2d");

hasStep=0 //scan和bfsClosen 变非阻塞 允许屏幕刷新绘制步骤
bfsOrd="LRUD";isDFS=0 //填色广度搜索顺序
putP=(x,y)=>!hasStep?Promise.resolve(g.fillRect(x,y,1,1)) : new Promise(res=>setTimeout(()=>res(g.fillRect(x,y, 1,1)), 1) )

scan=async(rnXY,f,d=0.002)=>{
  let [x0,x1,y0,y1]=rnXY, sil=d*2,
    kx=N/(x1-x0),ky=N/(y1-y0), x=x0,y=y0;//k:宽高之长与xy值-像素位置比率,x,y-起点 映射至宽,高N画布

  for(;y<y1;y+=d)for(x=x0;x<x1;x+=d)if(Math.abs(f(x,y))<sil) await putP((x-x0)*kx,N-(y-y0)*ky);
}
setTimeout(()=> scan([-3,3, -5, 1],love(2.23)), 1000)//毫秒
addEventListener("click",()=>{hasStep=1},{once:1})//愿意等一下吗？

//给你的爱心上色<3
e.onclick=ev=>{ g.fillStyle="red"; bfsClosen(g,ev.offsetX,ev.offsetY, putP)  }
bfsClosen=async(g,x0,y0,f_xy,test=(i,a)=>a[i+3]==0)=>{ //RGBA, i+3:透明
  let a=g.getImageData(0,0,N,N),w=a.width,
   pd=[], ps=[y0*w+x0],pNo=new Set;
  let o={L:-1,R:1,U:-w,D:w},k; for(k of bfsOrd)pd.push(o[k]);
  a=a.data;
  if(!test(ps[0]*4,a))return;//才源点,不符合.
  let p0,d,p1;
  while((p0=isDFS? ps.pop() : ps.shift()) !=null){
    for(d of pd){p1=p0+d; if(!test(p1*4,a)||pNo.has(p1))continue; await f_xy(p1%w, p1/w); ps.push(p1);pNo.add(p1)}
  }
}
