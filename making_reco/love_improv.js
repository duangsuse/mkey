let{sqrt,abs,floor}=Math;

love=a=>(x,y)=>(r=> a*y+r - a*sqrt(r)) (x**2+y**2)

e=document.body.appendChild(document.createElement("canvas")), N=400
{let l=(c,v)=>{c.width=c.height=v}; l(e,N);l(e.style,N+"px")}
g=e.getContext("2d");

let gDire=[..."LRUD"], bfsOrd="",isDFS=0,hasStep=0^1, putP; //填色:广度搜索顺序
(onclick=()=>{
  hasStep^=1
  putP=!hasStep?(x,y)=>Promise.resolve(g.fillRect(x,y,1,1)) : (x,y)=>new Promise(res=>setTimeout(()=>res(g.fillRect(x,y,1,1)), 1))
})()
onmouseout=()=>{isDFS^=1} //v 随机搜索序
e.onclick=ev=>{  g.fillStyle="red"; console.log(bfsOrd=shuffle(gDire).slice(randInt(0,4)).join("")); bfsClosen(g.getImageData(0,0,N,N),ev.offsetX,ev.offsetY, putP); ev.stopPropagation()}

scan=async(rnXY,f,d=0.002)=>{
  let {width:w,height:h}=g.canvas,
    [x0,x1,y0,y1]=rnXY, sil=d*2,
    kx=w/(x1-x0),ky=h/(y1-y0), x,y, Px,Py;
  const
    intoP=()=>{Px=x0+x/kx, Py=y0+y/ky;},
    ok=(Px0,Py0)=>{
      x++,y++; intoP(); y--; //now got P X,Y range
      let X,Y;
      for(Y=Py0; Y<Py; Y+=d)for(X=Px0; X<Px; X+=d)if(abs(f(X,Y))<sil)return true;
      return false
    }

  for(y=h;y!=0;y--)for(x=0;x<w;)
    if(intoP()|ok(Px,Py)) await putP(x,h-y);
}
setTimeout(()=> scan([-3,3, -5, 1],love(2.23)), 1000)

bfsClosen=async(bmp,x0,y0,f_xy,test=(i,a)=>a[i+3]==0)=>{ //RGBA, i+3:透明
  let w=bmp.width,a=bmp.data,
   pd=[], ps=[y0*w+x0],pNo=new Set;
  let o={L:-1,R:1,U:-w,D:w},k; for(k of bfsOrd)pd.push(o[k]);

  if(!test(ps[0]*4,a))return;//才源点,不符合.
  let p0,d,p1;
  while((p0=isDFS? ps.pop() : ps.shift()) !=null){
    for(d of pd){p1=p0+d; if(!test(p1*4,a)||pNo.has(p1))continue; await f_xy(p1%w, p1/w); ps.push(p1);pNo.add(p1)}
  }
}

mandel=(nIter=80)=>{
  let x,y, n=abs(nIter), f=(Px,Py)=>{
    let x=0,y=0,i=0, t;
    if(nIter<0){x=Px,y=Py;
      do{t=x*x-y*y +-.8; y=2*x*y +.156; x=t} while(i++ <n&&(x*x+y*y)<4)
    }
    else do {
      t=x*y; x=x*x-y*y+Px; y=2*t +Py;
    } while(i++ <n&&(x*x+y*y)<4)
    return i
  } //v 妈耶原来 C 是参数，这个 i/-nIter 还害得我查错了半天
  for(y=0;y!=N;y++)for(x=0;x!=N;x++){g.fillStyle=`hsl(0,100%,${f(...intoImag(x,y))/n*100}%)`;g.fillRect(x,y,1,1)}
}
cRI=[-2,1,-1,1],
//intoImag=(([r0,r1,c0,c1])=>(x,y)=>[r0+(x/N)*(r1-r0), c0+(y/N)*(c1-c0)] )(cRI);
intoImag=(x,y)=>[(x/N)*3-2,(y/N)*3-2]//妈的原来是 vp_xy 啊
mandel()
randInt=(a,b)=>a+floor(Math.random()*(b-a)),
shuffle=a=>[...a].sort(()=>Math.random()<0.5?-1:1),
randPick=a=>a[randInt(0,a.length)],
repeat=(n,f)=>{for(let i=0;i<n;i++)f(i)}//bfsOrd="";repeat(randInt(1,4+1),()=>{bfsOrd+=randPick("LRUD")})
