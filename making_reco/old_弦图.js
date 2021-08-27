const{abs,sqrt,sin,cos,atan2,PI}=Math,
$D=document,g=$D.body.appendChild($D.createElement("canvas")).getContext("2d"),
plusRL=([x,y],r,l)=>[x+l*cos(r),y+l*sin(r)],
rad=d=>d*PI/180,rFull=rad(360),
KR=2, Tur=(p0)=>({p0,ps:null, r:g.moveTo(...p0)||rad(-90),//向上
  l(v){let p,{ps,r,p0}=this;this.p0=p=plusRL(p0,r,v);let [x,y]=p;if(ps){p0.push(r);ps.push(0?p: p0);} g.lineTo(x,y);g.stroke(); g.moveTo(x,y)},
  //dirPs(){let a=this.ps,i=1,N=a.length; for(;i<N;i++)a[i-1][KR]=a[i][KR]; a[N-1][KR]=this.r; return a.splice(0,N)}
})
let tu=Tur([0,0]); tu.l(-10); tu.r=0;  tu.l(15)

Nang=(l,n)=>{let N=n; while(n--){tu.l(l); tu.r+=rFull/N}},
lines=a=>{let p=a[0],i=1,N=a.length; g.moveTo(...p);for(; i<N;i++){p=a[i];g.lineTo(...p);g.moveTo(...p)} g.lineTo(...a[0]); g.stroke() },
dis=([x,y],[x1,y1])=>{x-=x1,y-=y1; return sqrt(x*x+ y*y)}

l=140,lC=20, kl=lC/l,rC=atan2(lC,l-lC)
tu.ps=[]; Nang(l,4)
console.log(a0=tu.ps)

let a1=a0,l1, nI=20;while(nI--){l1=dis(a1[0],a1[1]) ;  lines(a1=a1.map((a,i)=>plusRL(a,a0[i][KR], l1*kl ) )); for(let i=0;i<4;i++)a0[i][KR]+=rC; }

g.font="10pt sans"
a0.forEach((p,i)=> g.fillText("p"+i,...p.slice(0,2)))

rTurn=rad(90), rHalf=rad(180)//,rFull=rad(360)
if(0)Tur=(p0)=>({p0,ps:null, r:g.moveTo(...p0)||rad(-90),
  l(v){let p,{ps,r}=this;this.p0=p=plusRL(this.p0,this.r,v);let [x,y]=p;if(ps){p.push(r);ps.push(p);} g.lineTo(x,y);g.stroke(); g.moveTo(x,y)},
  dirPs(){let a=this.ps,K=2,i=1,N=a.length; for(;i<N;i++)a[i-1][K]=a[i][K]; a[N-1][K]=this.r; return a.splice(0,N)}
})

//let tu=Tur(1?[0,0]:[w/2,h/2])
tu.r+=rTurn; tu.l(50)

Nang=0? (n,l)=>{let N=n; while(n--){tu.l(l); tu.r+=r360/N}} : (l,n,q=true)=>{//n<0&&(n=abs(n))
  let N=n;n=abs(n);q=n>3?q:false; while(n--){tu.l(l); tu.r+=q? rFull/N : rHalf+rHalf/N } //270三遍是star,草没rad
},lines=a=>{let p=a[0],i=1,N=a.length; g.moveTo(...p);for(; i<N;i++){p=a[i];g.lineTo(...p);g.moveTo(...p)} g.lineTo(...a[0]); g.stroke() },
subRR=([x1,y1],[x0,y0])=> Math.atan2(y1-y0,x1-x0)
tu.ps=[];
Nang(150,5-1,)
console.log(a0=1?tu.ps :tu.dirPs()) //v y=lC,x=lC另一半 =右上锐角
lC=50,rC=1?Math.atan2(lC,150-lC): 1?Math.asin(lC/150) :a0[1][KR]-a0[0][KR]
rRT=a0[1][KR]

a1=a0, nI=5;while(nI--){ //奇怪,极座标角度应该是2pi模，过大该回滚的啊……怎么会不能累加 // 噢... 四象限符号不对,转过了就错了.. 但提高 l/lC 能减缓变形速度
lines(a1=a1.map((a,i)=>plusRL(a,a0[i][KR], lC) ))
for(let i=0;i<4;i++){ a0[i][KR]+=rC; if(0&a0[i][KR]>2*PI)a0[i][KR]=subRR(a1[i],a1[i-1]); }
let rE=a0[4-1][KR]; if(0&rE>2*PI)for(let i=0;i<4;i++)a0[i][KR]=rE-2*PI;

if(a0[0][KR]+1*rC>rad(180)&nI>=0){0?a0.push(a0.shift()) :a1.forEach(p=>g.fillRect(...p,5,5)); for(let i=0;i<4;i++)a0[i][KR]*=-1}//+=1?rC/2 :rad(150/10)/*l55*/ }
}
//以向量的方式得每点下次点。考虑左上角，在不断右下转过90度后(此时它在右上)，它会开始朝左方向旋转——然而其对应点始终是第0，其实此刻它已经相当于右上角，可以左移全部的角度重新对应后加上溢出90的角度

