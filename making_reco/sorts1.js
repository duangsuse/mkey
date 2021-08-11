const
n=o=>o.length,$YN=f=>[f(1),f(0)],//抱歉
升=1,令序=(o,a,b)=>{let va=o[P.i(a)],vb=o[P.i1(b)]; if(!(升?va<vb : va>vb)){o[a]=vb;o[b]=va;P.upd()}  },
[插入,冒泡]=$YN(q=>a=>{
  let i,i1=n(a)-1; if(i1<1)return a;
  if(q) for(;i1!=-1;i1--)  for(i=0;i<i1; i++) 令序(a,i,i1);
  else for(;i1!=-1;i1--)  for(i=1;i<=i1; i++) 令序(a,i-1,i); //0止i1 和 1至i1
}),
快排=a=>{
  let 排=(i0,i1)=>{
    let iC=i0+Math.floor((i1-i0)/2),i; if(iC==i0)return;
    //for(i=i0;i<iC;i++)令序(a,i,Math.min(i1-1,i+iC+1)); /*0<iC<1*/
    for(i=i0;i<iC;i++)令序(a,i,iC); /*0<iC<1*/ for(i=iC+1;i<i1;i++)令序(a,iC,i)
    排(i0,iC); 排(iC+1,i1);
  }
  排(0,n(a))
}
const doc=document,S=doc.getSelection(),SR=()=>S.getRangeAt(0),
// 嵌套层级： (a,i0始行号)=>(k,di针行差)=>ia=>移i0+di&重复移到词尾&选至词首;判断清除首同k;填足' '*j;插入j,k &移i0
sel={
  mvI:(k,d=-1,isSel=0)=>{S.modify(isSel?"extend":"move",d>=0?"forward":"backward",k||"character")  },
  mkI:(q=0)=>q?S.collapseToEnd():S.collapseToStart(),
  get s(){return S.toString()}, //v 不行，text会被自动切分
  set s(v){SR().deleteContents(); let r=SR(),e=r.startContainer,i=r.startOffset,s=e.textContent;if(e.nodeType==Node.TEXT_NODE)return (e.textContent=s.slice(0,i)+v+s.slice(i)); if(!v.nodeType)v=document.createTextNode(v); SR().insertNode(v)},
  get j(){let old=SR().startOffset; sel.mvI("lineboundary"); return old-SR().startOffset},
  set j(v){let r=SR(); r.setStart(r.startContainer,v)},
  ln(i){let r=SR(),e0=r.startContainer.parentNode,e=e0.childNodes[i]; r.setStart(e,0); return e}
}

doc.body.toggleAttribute("ContentEditable");

(eTa=doc.body.appendChild(doc.createElement("div"))).innerHTML=`
<div style="border: 1px solid;white-space: pre;
  resize: both;overflow: scroll;
  min-height: 200px;">
`//换行貌似会复制父? 行号要求每行都以s=插入才可
//S.selectAllChildren(eTa.children[0]); SR().startContainer

function* lnWords(i){
  sel.ln(i);sel.mkI(); sel.mvI(0,1); if(sel.s=="\n") return; sel.mvI(); sel.mvI("lineboundary",1); let j1=SR().startContainer.nodeType==Node.TEXT_NODE? sel.j : SR().startOffset; //算不好
  while(SR().startOffset!=j1){sel.mvI("word",1);sel.mvI("word",-1,1); yield sel.s; sel.mkI(1)}
}

PVis=(e0,a,i0=1,ln=doc.createTextNode("\n"), nR=2)=>{
  let nd=i0+1 -n(e0.childNodes); nd+=nR;
  if(nd>0)while(nd--)e0.append(ln.cloneNode());//nd个空行
  let upd=()=>{S.selectAllChildren(e0.firstChild);sel.ln(i0).textContent=a.toString()}; upd()
  return{
  ptr:(k,di=-1)=>ia=>{
  for(let k1 of lnWords(i0+di))if(k1==k){sel.s="";break} // 完了 sel 传参过于灵活
  let j1=sel.j, N=n(a.slice(0,ia).toString()), nd=j1+1-N;
  if(nd>0){sel.s=" ".repeat(nd);sel.mkI()}
  sel.j=N;sel.s=k; return ia
  },
  vstr:(s_pre="", di=2)=>o=>{
    sel.ln(i0+di).textContent=`${s_pre} ${o}`; return o
  },upd
  }
}

{let pv,a,Pi;
pv=PVis(eTa.children[0],a=[],5,void 0&&doc.createElement("hr")); Pi=pv.ptr("i")
for(let i=0;Pi(i)<5;i++){a.push(i);pv.upd()}
debugger
}
//这个有一些毛病，mvI 本来是选择行/词 .s= ins 本来是避免String 拼接的，但 tarea 最好的建模是每行一个 text标签，它不能用 insertNode 插入标记k ；反而现在有方法读取更改一整行，不如直接 str.replace 好了
//已经消去很多 sel 隐式参数了，很多行为还是难预测

//execCommand undo/redo 大概也是想编辑器想疯了，应该存[]的
