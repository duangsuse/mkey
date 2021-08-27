//单向位图线化渐变、 Vec2 飘雪

const{round}=Math,
ldir={D:1,U:-1,R:2,L:-2, v:1},//亦可0235 -1 -4
lfor=(g,f_lv, dir=ldir.v,v01=[0,-1])=>{
  let {width:w,height:h}=g.canvas, l=(dir%2!=0? h:w), d=round(dir/2),v; map_(v01,i=>i<0?l-i:i);f_lv(l,v01,f=>{
    let [v0,v1]=v01
    if(d>0)for(v=v0; v<v1; v+=d)f(v); else for(v=v1; v>=v0; v+=d)f(v);
  })
},
map_=(a,op)=>{for(let i=0,N=a.length;i<N;i++)a[i]=op(a[i]);  return a},
imgAFlood=(g,im)=>{
  gHid.drawImage(im,0,0);
  lfor(g, (h,rn,f)=>{
    while(rn[1]!=0)f(y=>{
      lfor(g, w=>x=>{
        g.putImageData(gHid.getImageData(x,y,1,1),x,y)
      },dir.v+1) // 通过奇偶的修改取 oppsite length, 比如现在y向就对应x, 其实用正负更好,毕竟 -1 得另个方向更小的d, 没有暖用,而正负纵横可得同方向
    })
    rn[1]-=1;
  })
}, // 虽然有两边的长度，但绘制方法是没有按方向 get(l,lw,n=1) 的形式的，必须提供完整 xywh, 只有正-另侧长 不知道放第几参数, 于是可以用 func* 生成(dir,v0,v1,nPx=1) 的xywh 流收集，再用个 aaa, abb, abc 式异步 rfill 遍历器填充图像；最好是能利用 CanvasPattern 但复用始末点xy,算wh,y-repeat 较麻烦,要2项排序减
rand1P=(a,b)=>Math.random() * (b-a +1) + a,
setRand=(o,k,va)=>{
  let i=0,ia=0,N=k.length;
  for(;i<N;i++,ia+=2)o[k[i]]=rand1P(va[ia],va[ia+1])
},
doc=document,tg=(e0,k)=>e0.appendChild(doc.createElement(k)),
eG=tg(doc.body,"canvas"),g=eG.getContext("2d")
let w,h

tg(doc.head,"style").innerText=`
canvas {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
`;
(onresize=()=>{ w=eG.width=eG.offsetWidth;h=eG.height=eG.offsetHeight; })()

class Snow{
  //仅位&速向量
  constructor(){this.reset()} //v 0,-w, h,2h
  reset(){setRand(this,"l x y vx vy".split(" "), Snow.partic)}
  upd(g){let{x,y,l, vx,vy}=this;
    g.moveTo(x,y);g.arc(x,y,l, 0, 2*Math.PI);
    this.x+=vx;this.y+=vy;
    if(x<-l || y>h+l)this.reset() //这些符号位增减关系麻烦的很.. 很难可配置
  }
  static partic=[.5,2.7, 0,1.5*w, -2*h,0, -.5,-2.5, .5,3]
} //四个方向 与宽高距离, vxy 速度都有区间可调，粒子动画难死了

snow=(N,nC,bg,fg)=>{
  let a=Array(N).fill().map(()=>new Snow)//全局化可允不同配
  return()=>{g.fillStyle=bg;g.fillRect(0,0,w,h);
    for(let i = 0, ww=Math.floor(N / nC); i < nC; ++i) {
    for (let j0=(i*ww),j=0; j<ww; ++j){g.beginPath();a[j0+j].upd(g);
    g.closePath();g.fillStyle=fg;g.fill();}
  }}
}

f=snow(9000,100, "hsla(0,0%,10%, 0.5)","white")
ru=()=>{f();requestAnimationFrame(ru)}
ru()
//这次写个 fire 的...
