love=a=>(x,y)=>(r=> a*y+r - a*Math.sqrt(r)) (x**2+y**2)

e=document.body.appendChild(document.createElement("canvas")), N=900
{let l=(c,v)=>{c.width=c.height=v}; l(e,N);l(e.style,N+"px")}
g=e.getContext("2d");

scan=(rnXY,f,d=0.002)=>{
  let [x0,x1,y0,y1]=rnXY, sil=d*2,
    kx=N/(x1-x0),ky=N/(y1-y0), x=x0,y=y0;//k:宽高之长与xy值-像素位置比率,x,y-起点 映射至宽,高N画布

  for(;y<y1;y+=d)for(x=x0/*注意*/;x<x1;x+=d)if(Math.abs(f(x,y))<sil) g.fillRect((x-x0)*kx,N-(y-y0)*ky, 1,1);
}
//scan([-3,3, -5, 1],love(2.23))

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


mandel=()=>{
  let z=[0,0],m2=0;
  return (ix,iy)=>{
    if(m2>2)return Infinity;
    let[x,y]=z;
    z[0]=c+ x*x-y*y;z[1]=c+ 2*x*y;
    [x,y]=z; m2=x*x+y*y;//dot(z,z)
  }
}
if(0)scan([.275,.28,.006,.01], mandel())
//https://www.cnblogs.com/bluebean/p/11177088.html
//https://blog.csdn.net/weixin_28710515/article/details/89739231
  //https://www.shadertoy.com/view/3lsXWH
  //https://ide.wy-lang.org/?file=mandelbrot_1

//https://dev.to/foqc/mandelbrot-set-in-js-480o
//https://blog.mythsman.com/post/5d2aa68cf678ba2eb3bd340c/
//https://www.cnblogs.com/easymind223/archive/2012/07/05/2578231.html

  let
cReal=[-2,1],cImag=[-1,1]
colors = Array(16).fill("").map((_, i) => i==0 ? '#000' : `#${(2**12 * Math.random() |0).toString(16)}`)

mandel=(nIter=80)=>{
  let y=0,x=0,
  [r0,r1]=cReal,[c0,c1]=cImag,
  c, calc=()=>{
    let z = [0,0], i = 0, p=[0,0], d=[0,0];
    do {
        let[x,y]=z;
        p[0]=Math.pow(x, 2) - Math.pow(y, 2);
        p[1]=2 * x * y

        z[0]=p[0] + c[0];z[1]=p[1] + c[1]
        d = Math.sqrt(Math.pow(z[0], 2) + Math.pow(z[1], 2))
        i += 1
    } while (d<=2 && i < nIter)
    return i//, d<=2 always true
  };
  for(;y<N;y++)for(x=0;x<N;x++) {
    c=[r0+(x/N)*(r1-r0), c0+(y/N)*(c1-c0)];
    g.fillStyle=cycGet(colors, calc()); g.fillRect(x,y,1,1);
  }
}
cycGet=(a,i)=>a[i%a.length] //-1 %i1 +1 ?

mandel()
