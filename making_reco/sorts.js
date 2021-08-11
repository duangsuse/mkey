const
n=o=>o.length,$YN=f=>[f(1),f(0)]/*抱歉*/,总=k=>()=>k,
升=1,令序=(o,a,b)=>{let va=o[P.i(a)],vb=o[P.i1(b)]; if(!(升?va<vb : va>vb)){o[a]=vb;o[b]=va;P.upd()}  },
[插入,冒泡]=$YN(q=>a=>{
  let i,i1=n(a)-1; if(i1<1)return a;
  if(q) for(;i1!=-1;i1--)  for(i=0;i<i1; i++) 令序(a,i,i1);
  else for(;i1!=-1;i1--)  for(i=1;i<=i1; i++) 令序(a,i-1,i); //0止i1 和 1至i1
}),
快排=a=>{
  let 排=(i0,i1)=>{
    let iC=i0+Math.floor((i1-i0)/2),i; if(iC==i0)return;
    for(i=i0;i<iC;i++)令序(a,i,iC); /*0<iC<1*/ for(i=iC+1;i<i1;i++)令序(a,iC,i)
    排(i0,iC); 排(iC+1,i1);
  }
  排(0,n(a))
}, //v 下为列表常见操作，无 add,splice,fill,concat 等长度改变因为(默认它是靠)项复制就太无趣，亦无join,sum,avg因其是归纳(只遍历)操作
逆序=a=>{let i,i1,va;for(i=0,i1=n(a)-1; P.i(i)!=P.i1(i1); i++,i1--){va=a[i];a[i]=a[i1];a[i1]=va;P.upd()} }, //被保留的位置先被覆盖
二分找=(a,x)=>{},
带序合并=(a,b)=>{},
搜索=(a,x,i0=0)=>{},
KMP搜索=a=>{
//步长从1变n(a)；取共同前缀、左移(查模式N字共同前后缀长总数 再试)；
},
搜子串=(a,aa,i0=0)=>{},
判串始=(a,aa)=>{},
取子序列=(a,i,i1,d=1)=>{},
子串=(a,i,n)=>取子序列(a,i,i+n),
切分=(a,sep=",")=>{},
替换=(a,x,x1,n=-1)=>{},
iN=(i,n)=>i<0? n+i : i,
映=(a,op)=>{let N=n(a),b=Array(N),i=0;for(;i<N;i++)b[i]=op(a[i]); return b}, //映滤排组归
滤=(a,p)=>{},
滤首串=(a,p,pNeg=总(0))=>{},
分两组=(a,p)=>{},
排=快排,
组=(...a)=>(op=>a.sort()[0].map((x,i)=>op(x,...a.slice(1).map(b=>b[i]) )) )(!n(a[n(a)-1])? a.pop() : 建行),
建行=(...a)=>a,
组下项=(a,op)=>{let N=n(a),b=Array(N-1),i=1;for(;i<N;i++)b[i-1]=op(a[i-1],a[i]);  return b},
归=(a,op,x0)=>{let ac=a[0]||x0, x; if(ac==undefined)throw a;  for(x of a)ac=op(ac,x); return ac},
铺平=a=>{},
周而复始=a=>{},
列乘=(...a)=>{},
列乘项非同=(...a)=>{}, //permutations(range(2)), product(*[list(range(2))]*2)
交替=(...a)=>{}, //eachNext(=interleave) 反组
拼合=(...a)=>{}, //concat 反分块
分块=(a,n,xfill)=>{}, //提供 xfill 即 windowed 否即 chunked
举组合=(...a__n)=>{},
举组合单项复=(...a__n)=>{},
迭复制=(a,n)=>{}, //tee
叠加迭=(a,op="")=>{}, // s.slice(-1): 我不是你,不是你,是你,你
叠右迭=(a,op)=>叠加迭(a.reverse()).reverse(); //你不是人->人是不你: 人,是人,不是人,.

/*关于 Textarea 文本帧实现说点。接口是 ptr("i", -1)(a某索引) 在上一行插入
最开始打算背后藏个 Grouping(ln to k) ，就是靠 k-i 表每行单独更新，可咱没有独立「帧」的概念，不可能说 i,j 都更新了才算一帧，一些情况指针是不变不调用
如果不能这样有中间结构就显得太冗，移到行；空白填足长，再去搜索删除同文本项；如果插入位已有就跳后插&k。

至于动画 undo到起点&Interval redo()*step (方便每个指都移动时允分帧)即可
它不能 canvas 化，数据是基 toString 可视化 slice 定位
为排序下
*/
const doc=document,
sel={
  mvI:(k,d=-1,isSel=0,n=1)=>(o=>{for(let i=0;i<n;i++)o.modify(isSel?"extend":"move",d>=0?"forward":"backward",k||"character")  })(doc.getSelection()),
  get s(){doc.getSelection().toString()},
  set s(v){},
  get j(){}//行i这个在此渲染没意义，子图i0 才有意义；同样选区 i0,1 和整体内 pos=base~r.sum()+r.i 在基扩节点不同时也意义不大
},
fthis=f=>function(...a){return f(this,...a)}, exter=T=>{let k,K="__proto__",po; for(k in T)T[k]=fthis(T[k]); return o=>{po=o[K];o[K]=T;T[K]=po} }//给最新的 x.ctor

doc.body.toggleAttribute("ContentEditable");
