const
undef=void 0,NO=null, $Y=true,$N=false,
fthis=f=>function(...a){return f(this,...a)}, noOp=(x=>x), just=k=>(()=>k), $YN=f=>[f($Y),f($N)], //argName?
n=o=>o.length,ss=s=>s.split(" "),
[isNon,isObj,isNum,isStr,isFunc,isBool]=ss("undefined object number string function boolean").map(s=> v=>(typeof v===s)),
isNul=o=>o===null,isNun=v=>v==null, elv=(a,b)=>!isNun(a)?a:b;

fthis((o,x)=>o-x).call(1,2)==-1; noOp(1)==1; just(9)("whatever")==9;
!isNul(undef)&&!isNon(NO);

const
ext=(T,o)=>{let s,f;for(s in o){f=o[s];if(isFunc(f))f=fthis(f);
  if(reCond(/^([gs]et)_(.+)/,k=>$N&(o[k]={value:f}),m=>o[m[2]]=isFunc(f)?{[m[1]]:f} : {set:f[1],get:f[0]}, s))delete o[s]
} Object.defineProperties(T.prototype||T,o)},
reCond=(re,op,y,s)=>{let m=re.exec(s); return isNul(m)?op(s):y(m)},
withV=(o,k,v,f)=>{let old=o[k],r; o[k]=v;r=f(); o[k]=old; return r},
once=(f,key=noOp,d=new Map)=>(isNul(d)? (...a)=>{ let r;if(!d){r=f(...a); d=$Y;} return r } : (...a)=>{
  let k=key(...a),r=d.get(k); if(isNon(r))d.set(k,r=f(...a)); return r
}).let(f1=>isNon(f)? f_=>{f=f_; return f1} : f1)

ext(Object,{let:(o,op)=>op(o),also:(o,f)=>{f(o);return o},takeIf:(o,p)=>p(o)?o:NO})
ext(Array,{
  mapWhile(a,p,op){let ys=[],x,y; for(x of a) {y=op(x); if(!p(y))break;  ys.push(y)} return ys },
  firstRes(a,op,p){let x,y;for(x of a)if(p(y=op(x)))return y;  return NO},
  zip:(a,b,op=(...a)=>a)=>a.map((x,i)=>op(x,b[i])),
  map_:(a,op)=>a.forEach((x,i)=>a[i]=op(x,i))||a,
  fold:(a,f)=>{let r=f(),x;for(x of a)r(x); return r()},
  sum:a=>a.reduce((n,x)=>n+x, 0)
})
ext(Function,{get_P:f=>P.of(f)});

(f=>{let nt=0, c=f(k=>++nt&&k-1); return c(0)+c(0)+c(2)+nt })(once())==-1*2+3;

const
[recP,rec]=$YN(q=>f=>{let f1,run=n(f)==1?x=>f1(x):(...a)=>f1(...a); if(q)run.give=(...a)=>(f1=(n(a)!=0)?f(...a):f(run)); return q?run : f1=f(run)}),
fold0=(zero,plus)=>(ac=zero)=>x=>isNon(x)?ac:(ac=plus(x,ac)),
foldTo=(init,op,done=foldTo.op)=>(a=init())=>x=>isNon(x)?done(a):op(a,x),
unfold=v=>isObj(v)&&!v.get?Object.entries(v):[...v]//v_asd

foldTo.op=noOp;
asNum=(nd=10)=>fold0(0,(d,n)=>n*nd+d),
asAry=n=>foldTo(()=>Array(n).also(a=>{a.i=0-1}),(a,x)=>{a[++a.i]=x}),
[asObj,asMap]=$YN(q=>foldTo(q?()=>Object.create(NO):()=>new Map, q?(o,[k,v])=>{o[k]=v} : (d,[k,v])=>{d.set(k,v);} )),
[asList,asJoin]=(ls=> [ls(),(sep="",f=ls)=>withV(foldTo,"op",a=>a.join(sep), f)])(()=>foldTo(Array,(a,x)=>a.push(x)));

rec(f=>x=>x==0?x: f(x-1)+1)(10);
[1,2,3].fold(asNum())==123;
[[1,2],[5,1]].let(a=>unfold(a.fold(asMap))==a);
[1,2].fold(asAry(2))==[1,2].fold(asList);
[1,2].fold(asJoin("x",()=>asAry(2)))=="1x2";
[1,2,4,5].fold(asJoin())=="1245";

const
next=g=>g.next().value,
coll=(f,k,v=NO)=>{
  let q=f.name.endsWith("Map"),ao, t=q? new f() : f(ao=[]),a,b,  ks=(f=noOp)=>t().let(N=>ao.splice(0,n(ao)).map_(a=>a[0].reverse()&&f(a) ) );
  if(!isNon(k))for([a,b]of isNul(v)? unfold(k) : (isStr(k)?ss(k):k).zip(v))q?t.set(a,b):t(a,b);
  if(q)return t;
  t[Symbol.iterator]=ks;
  t.keys=()=>ks().map_(r=>r[0]);
  let o={
    get:(t,k)=>!isFunc(t[k])? t(k) : t[k], // match->[prefix,v], sub(k).keys()
    set:(t,k,v)=>{t(k,v); return $Y}
  }; for(k in o)t[k]=fthis(o[k]);
  return new Proxy(t, o)
},
trie=(a)=>{
  let md=()=>new Map, no=isNon, KZ=trie.KZ, p0=md(), // recursive Paths imp. with single-route hint&zerocopy
  rec=(d,k,v)=>{
    if(no(k)) { let k,v, vZ=d.get(KZ), nMe=0,nR,nA,i;
      d.delete(KZ);if(!no(vZ)){a.push([[],vZ]);nMe++} //leaf 1st
      for([k,v] of d.entries()) { nR=rec(v,undef,undef);nMe+=nR; for(i=0,nA=n(a)-1;i<nR;i++)a[nA-i][0].push(k) }
      d.set(KZ,vZ);
      return nMe
    }
    let ki=next(k),q,p1; if(q=no(ki))ki=KZ; //endq?
    if(no(v)) {
      p1=d.get(ki);
      return q? p1 : rec(p1,k,v);
    }
    if(q)return $Y|d.set(ki,v);
    let initP=()=>{
      let p=d.get(ki); if(no(p)){ d.set(ki,p=md()); d.s=[...k]; return rec(p,d.s[Symbol.iterator](),v) }
      return $N&rec(p,k,v);
    }
    if(no(d.s))return initP()
    else if(!initP()){d.s=undef; return $N}
  }
  return (k,v)=>rec(p0, no(k)?k:k[Symbol.iterator](), v)
},
Instype=(set=>(x,memb)=>{set(x.constructor,memb)(x); return x})(
  once((T,o)=>{let K="__proto__"; ext(o,o); o[K]=T.prototype; return o.of= x=>{x[K]=o;return x} }), noOp, coll(trie));
trie.KZ=Symbol("Val");
{
a=coll(trie,"a b c",[1,2,3])
a.set("a1",2)
a.keys()

let oF,o={get_x:s=>s.slice(1)}
Instype(Object("1"), o).x==""; oF=o.of;
//debugger
}
/*trie=(p0=new Map,KZ=Symbol.for("Val"),f=null)=>(k,v)=>(k=k[Symbol.iterator]())&& (f=(d)=>{let ki=next(k),q=no(ki),p;if(q)ki=KZ; p=d.get(ki); if(no(v))return q?p:f(p); if(no(p))d.set(ki,p=new Map); q?d.set(ki,v):f(p)})(p0)
no=v=>v===void 0, next=g=>g.next().value
((a,t=trie())=>{a.forEach(e=>t(...e)); return a.map(([k,_])=>t(k)) })(Object.entries({he:1, h:2, beg:3, b:4}))

这就好比把 ab 对应到 a/b/v.txt 的 mkdir&touch ，或者 cd&cat ，就是拿到k上级引用[KZ]取点值 结束，顺带了 mkdir-p 的递归边走边创建；啊听说 Suffix Trie 能压缩连续单子项，Trie 本质是 DFA 自动机，还有二进制按(2,4)位 Trie 变种 Radix ，Trie 还可以进一步加指针压缩子串，双数组，Huffman 算法和 KMP 搜索，可以解 LCS,LCSeq,LCA,GCD?，吓怕宝宝了。
谈到算法侧你会好奇我干嘛递归，那大概是为省行数？
trie=(p0=new Map,KZ=Symbol.for("Val"))=>(k,v)=>{let ki,p=p0;if(no(v)){for(ki of k)p=p.get(ki); return p[KZ]} else{for(ki of k)p.set(ki,p=p.get(ki)||new Map); p[KZ]=v} }

这里的 Trie 是为 scan 的 Suf1Trie ，在 set 上添加了 [NANO] 的特殊键保存唯一后路径(但不是惰性创建)，实现上 abc,adb 这 d/ 层初次创建还是单一的，只能有一个父层持 [NANO] 重复创建时给删除掉，如复制 k iter 时发现只有单项，惰性创建 Map([KZ,v]) 且无 [NANO]
*/

triee=(p0=new Map,KZ=Symbol.for("Val"),KN=Symbol.for("Nano"))=>(k,v)=>{
  let p=p0,ki,r, isM=p=>p.constructor===p0.constructor;
  if(no(v)){for(ki of k)p=p.get(ki); r=p.get(KZ); return isM(r)? r.get(KZ):r}
  let N=n(k),i=0, pNano; r=k;k=k[Symbol.iterator]();
  for(ki of k){p=p.get(ki);i++; if(no(p)||p.get(KN)){pNano=p;break} } // no ab:create, a^db, ^:NANO
  for(ki of k){p=p.get(ki);i++;
    if(i==N)p.set(KZ,v); else // 节点能有值有子，是必须
    if(i==N-1)p.set(ki,v); else { // 单项序列不 NANO 优化
      if(no(p)){p.set(ki,p=new Map); p.set(KN, [r.slice(i),v])} // a^bc:1, ^:NANO[k,v]
      else{if(!no(pNano))pNano.delete(KN); if(!isM(p))p=new Map([[KZ,p]])} // ab^cd:2, ^:Map{KZ:1, d:2}
      continue;
    }
    break;
  }
}

const no=isNon,
trier=(p0=new Map,KZ=Symbol.for("Val"),KN=Symbol.for("Nano"))=>(k,v)=>{ // 压缩前缀树
  let p=p0,i=0,ki,r, isM=p=>p.constructor===p0.constructor;
  if(no(v)){
    for(ki of k){p=p.get(ki); if(isM(p)&&(r=p.get(KN))&!no(r))return k.slice(i)==r[0]?r[1]:undef; i++} //t("v",1);t("vr",2)
    return isM(p)? p.get(KZ) : p} // ab=1;^b=1 ; abc=2;^b[Z]=1
  let N=n(k), pNano,q=$Y;
  for(i=0;i<N;){ki=k[i]; r=p.get(ki); if(no(r)||(isM(r)?r.has(KN):$Y|(r=NO))){pNano=r;break} p=r;i++} // 自首个 no,[KN] 起
  for(;i<N;){ki=k[i]; r=p.get(ki);
    if(no(r)){ if(i==N-1){p.set(ki,v);return;}  if(q&&p!==p0)p.set(KN,[k.slice(i), v]);else q=$Y; p.set(ki,p=new Map); } // 0..<N-1 是一个处理，p0 没 NANO
    else{if(pNano)pNano.delete(KN); isM(r)?(p=r):p.set(ki,p=new Map([[KZ,r]])); } i++ // 只有单路径-值是 NANO，重复前缀不能合并-更新p到父层nano 
  }
  p.set(KZ,v); //比一行 trie 有记单路径：set 时若创建先清除父层nano，(首次)再记下余路径；惰性末端：[KZ] 不默认创建，但 get 时k尽除v外也可是 Map[KZ,v] 中点值；set 时按某路尽v创建中点值继续
} //^ 相当于 set("abc", 前先检查 ab 等前缀是不是重添加，在取置时 if==KN[0] 跳就能实现 like, like-ly 的树形后缀匹配，只要路径前缀 NANO 就可以跳
{
d=new Map; t=trier(d) //^ 再加get仅取前缀和封装 p0 子路径,keys 的操作 ！ match 和 search
t("hel",1)
//debugger
}



//eH{id,mk,mock},bindG

//(a b): ul li>rec, a:#text
const
el=(tag,...ee)=>{tag=isStr(tag)?document.createElement(tag):tag; while(isFunc(ee[0]))ee.shift()(tag); for(let x of ee.flat())tag.append(x); return tag},
lexPrefix=s=>[].also(r=>{
  let i0=0,m0, m, f=m=>{
    if(i0!=0)r.push([m0,s.slice(i0,m.index)]);
    m0=m[0];i0=m.index+1; //.^wtf .k1
  };
  while(m=_reCmd.exec(s)) f(m); f({index:n(s)});
}),
wCmd=s=>(ops=>e=>ops.forEach(([k,v])=>_cmd.get(k)(e, v))) (lexPrefix(s)),
_le=(t="UL")=>({
  render:rec(f=>a=>n(a)? el(t, a.map(x=>{let r,e=el("li",r=f(x)); if(r.tagName==t)e.classList.add("t-rec"); return e})) : el("span", a)), // 提示：可预检查下级、不设 str 入口，顶层就只能是多项
  scrape:rec(f=>e=>e.tagName==t? [...e.children].map_(ee=>f(ee.childNodes[0])) : e.textContent),
  edit:()=>el("div",wCmd(".tree"), el("br"), el("a",e=>e.onclick=ev=>{
    let e0=e.parentNode,eT=e.previousSibling, q=eT.toggleAttribute("ContentEditable")
    e.innerText=q? "done":"edit"; if(q)eT.addEventListener(..._noTog); else eT.removeEventListener(..._noTog)&e0.dispatchEvent(new Event("change")); //难看，该用启监听配对
  },
    wCmd("_position=absolute _right=9px _top=5px _cursor=cell;edit"))).bind((e,a)=>e.children[0].let(e=>a?e.replaceWith(le.render(a)) : le.scrape(e)))
}),le=_le(),
[newer,orig]=$YN(q=> (me=>(a,b)=>elv(b,!isFunc(b)?me(a,b):(r=>me(a,r))(b(a)) ))(q? once((a,b)=>b,noOp) : once((a,b)=>a,(a,b)=>b||a)) ) //无论如何返回右值或查询

{let eq=f=>(e,s)=>f(e,...s.split("=").map_(decodeURIComponent)), k=x=>(e,s)=>e[x]=s; //值escape
_cmd=coll(Map, ". # _ , ;", [(e,s)=>e.classList.add(s), k("id"), eq((e,k,v)=>e.style[k]=v), eq((e,k,v)=>k==""?(e.textContent=decodeURIComponent(v)): e.setAttribute(k,v)), k("innerText") ]); //丑死了，该支持变量
_reCmd=/[\.#_,;]/g;
_noTog=["click",ev=>{if(!ev.target.classList.contains("t-rec"))ev.stopPropagation()},$Y]
}

orig(1,x=>x+1)==2; orig(2)==1;

(_2=> ext(Element,{set_data:_2(newer), bind:(e,f)=>{ ext(e,{set_data:_2(f)}); return e}}) )(f=>[f,f].map_(fthis))

doc=document;
el(doc.body, ed=le.edit())
ed.data=[1,2,[3,[2.5],4],5];

qs=(css,e0=doc.body,op=NO)=>e0.querySelectorAll(css).let(r=>!isNul(op)? r.forEach(op): n(r)==1?[r[0]]:[...r]); //不区分qs1去lets真是最烂的设计
enaTRec=(summ=le.scrape)=>qs(".t-rec", doc.body, e0=>{
  let e=e0.children[0],eS=e0.appendChild(el("summary")),ec=e.style,q, tog=(ev)=>{ev.stopPropagation();
    q=ec.display=="";
    $YN(q1=> (q1?ec:eS.style).display=(q1?q:!q)? "none":"");q=!q;
    e0.style.listStyleType="disclosure-"+(q?"open":"closed");
    e0.style.cursor=(q?"n":"s")+"-resize";
    if(!q)eS.innerText=summ(e);
  };
  e0.onclick=tog;
})
doc.head.append(el("style",`li.t-rec{list-style-type:none;cursor:row-resize} .tree{border:1px solid green;position:relative} li>span{user-select:text}`)); // ul>li ul 嵌套、展开折叠、编辑通知、拖拽

qs("li", doc.body,e=>{e.draggable=$Y; e.ondragend=ev=>{let eT=doc.elementFromPoint(ev.clientX,ev.clientY); if(eT.matches("li,span"))try{eT.insertAdjacentElement("beforeBegin",ev.target);}catch{} }});
//^搞个懒初始化
enaTRec();

bindCan=(id,mode,w,h)=>{ //不是很多浏览器支持 CSSUnparsedValue 和 registerProperty ，只好用URL
  let e=doc.getElementById(id),c=e.style,f,eref,g;
  if(f=doc.getCSSCanvasContext)g= f.call(doc, mode,id,w,h);
  eref=qs(".g-ref").filter(e=>e.style.background.includes(`url("#${id}")`));
  let kfn=c.MozOrient==""? "moz-element(#": f? "webkit-canvas(" :NO;
  if(!g){g=e.getContext(mode); e.width=w;e.height=h;}
  if(kfn)eref.forEach(e=>{e.style.backgroundImage=`-${kfn}${id})`  });
  else {
    g.flush=()=>{let u=`url(${e.toDataURL()})`; for(let e of eref)e.style.backgroundImage=u;} //之前 polyfill 是穷举 sheet -webkit-canvas 来支持全部，id 也没想好 g:e=1:N groupby g 的
    return g
  }
  g.flush=just(undef);
  return g
},
noScroll=e=>{ // 关于 scroll 有个问题，clip:text 是不支持的，所以看起来滚动条无效或(若字不透明)重影，或可用同位 span 去 -margin 但要同步 value ，干脆外部 scroll
  let c=e.style; c.overflow="hidden";c.resize="none"; c.border=0;c.padding=0;
  setTimeout(()=>{
    let e0=e.parentNode; if(!e0.style.overflow)e0.style.overflow="hidden scroll";//好吧，看来这条儿会挡住内容 //box-sizing, outline, appearance, max-height, text-overflow
    (e.oninput=()=>{c.width=e0.offsetWidth-5+"px";c.height=e.scrollHeight+"px";})()
    new MutationObserver(cs=>{e.oninput()}).observe(e0, {attributes:$Y, attributeNames:["style"]});
  }); //md DOM 原来支持 timerRate!
  
}//^ resize 事件可以(利用scroll?)周期检查，可以复制到新 doc 里监听 resize createEvent('HTMLEvents') init("resize")
//了解到 resizer 实质靠 style 属性调整宽高(汗)，那么 MutationObserver(observe e0,fn(records{type,target,add/removed Nodes,Sibling},o), {characterData,attribute Name?s,childList,subtree}OldValue? ; takeRecords;disconnect) 就能监听变更了, webkit 不支持 DOMAttrModified

//啊不愧是异步监听队列，真丝滑！

code=s=>encodeURIComponent(s[0].replaceAll(".","%2e"))
const LOREM=code`Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et 
dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex 
ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu 
fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
 mollit anim id est laborum`;

el(doc.body,el("canvas",wCmd("#g")),el("div",wCmd("_resize=both_overflow=overlay"),el("textarea",noScroll,wCmd(`.g-ref_background=url(%23g) _color=transparent  _-webkit-background-clip=text _background-clip=text _font-size=xxx-large _caret-color=red _width=320px_height=200px,=${LOREM}`))))
g=bindCan("g","2d",200,200) //^FF 开始 bgclip 有点无效，可能加了非 -webkit(text 是扩充值) 就能用了
g.fillRect(0,0,50,50);g.flush();

div=(a,b)=>Math.floor(a/b),
wh=e=>e.tagName? [e.offsetWidth,e.offsetHeight] : (e=>[e.width,e.height])(e.canvas),
randPick=a=>a[Math.floor(Math.random()*n(a))],
animTC=(cs=ss("#233D4D #ee0000 #66ccff #673ab7 #8ACB88"),nm=[10,10])=>{ //md hexcolortool.com, color-hex.com 的工具 split-map 都不知道，色集都不支持，CSS grad(90deg, 不如
  let [n,m]=nm, [w,h]=wh(g), ww=div(w,m),hh=div(h,n),
  f=()=>{let y=0,x=0;
    for(;y<h;y+=hh,x=0)for(;x<w;x+=ww){ g.fillStyle=randPick(cs); g.fillRect(x,y,ww,hh); }
    g.flush();
    requestAnimationFrame(f);
  };f()
}
//setTimeout(animTC,2000) // Houdini 带来的 CSS.paintWorklet.addModule &registerPaint id, (g,size,prop)=> 与 background/mask-image:paint(id) 也是可选项，利用自定义 registerProperty 甚至可以实现协调CSS侧进行动画calc与补间
//想必比拼接 url() 好，但似乎内存快照找不到对应数量的临时DataURL字符串；Paint 的问题就是数据封送太麻烦
//module 可以用 ObjectURL(Blob(String(f 来实现，但 file: URI 是不能加载 worker 的(本地http么

//white-space:pre-wrap; line-break:word; word-break:break-word; word-wrap, overflow-wrap 怎么这么多自动换行啊
//显然自动折行ta的h就是预算的，外部h不影响内部，而软折行ta完全不看外部宽高


/*
textarea 内容利用 background 切边去显示彩字，不支持 scroll ，必须完整显示才行
显然：内部 ta 是 !ovf,!resize,scroll=h更新，w 尽量贴近外div (如无WK布局扩展则只能 listen style Mutation&设置内整体宽高)，无边框和焦点边线，外则 resize 且 scroll ovf:hidden auto
::scrollbar, ::-thumb 的 w,border 啥的可以限制下
参看MDN发现 overflow-wrap (即 word-wrap) 对文本编辑器仅三值很友好
*/

"family size weight"; "border-width padding"; "line-height letter-spacing word-spacing text-indent text-align text-overflow white-space word-break overflow-wrap font-feature-settings" //no writing-mode, text-transform, LT:0 absolute

//然后 selection rangeAt, base/extent 与其非 Element 选择 start/end offset 和 container ，没有只设 offset 的 API ，只能选择 getSelection().setBaseE 的；r.cloneContents() 很灵性能 toS 但是 frag node 的形式，性能不咋，也有 modify("extend","fwd","line"),cAC,del,contain 但没用；Text 的 ins, surr(cut-extract&move), selContents 未简写用；见 https://developer.mozilla.org/zh-CN/docs/Web/API/Range/getBoundingClientRect

//i,i1,s,e0,g, xywh(可断,offset,在e0内部就无需靠txt-pad重叠加边距参数),ij,breakLn; upd,iXY, mvI("line") mvI(1,-1,"word"),mvI([1,0]),isI, {change s,sel,I}
//配对g因为此种 ta 实现目标本身是有 measure 选区 xywh 和背景 flush, scroll 动态绘制
//基础 Editor 的 line number, code folding 也要靠 w/h 和 selection 实现，代码折叠和行号一起；(自动换行时)行号按行长降序，添加i,h当它y溢出了，再渲染余下部分；代码折叠在行修改时更新，收=选&外提到Attr,放=选&插，span 里 E, -E 后缀标记折叠区始末

//role=code,presentation,tooltip tabindex aria-hidden wrap="off" autocorrect="off" autocapitalize="off" autocomplete="off" spellcheck="false" aria-label="Editor content;Press Alt+F1 for Accessibility Options." tabindex="0" role="textbox" aria-roledescription="editor" aria-multiline="true" aria-haspopup="false" aria-autocomplete="both" 

//.minimap-shadow {box-shadow: #dddddd -6px 0 6px -6px inset;}
/*.hidden,.hoverbox{ overflow: hidden;
    z-index: 50;
    user-select: text;
    -webkit-user-select: text;
    -ms-user-select: text;
    box-sizing: initial;
    animation: fadein .1s linear;
    line-height: 1.5em;*/
//Tab: -4, charNL, j=-1, lineno, hlActiLine, find&regex replace, /i \b, "range/fwd", onrepeat; undo/redo/autosave
//DOMRect{minus, posit(e,$Y)}
/*
     const nonWordCharacters = this.getNonWordCharacters();
    const lowercaseLetters = 'a-z\\u00DF-\\u00F6\\u00F8-\\u00FF';
    const uppercaseLetters = 'A-Z\\u00C0-\\u00D6\\u00D8-\\u00DE';
    const snakeCamelSegment = `[${uppercaseLetters}]?[${lowercaseLetters}]+`;
    const segments = [
      '^[\t ]+',
      '[\t ]+$',
      `[${uppercaseLetters}]+(?![${lowercaseLetters}])`,
      '\\d+'
    ];
    if (options.backwards) {
      segments.push(`${snakeCamelSegment}_*`);
      segments.push(`[${_.escapeRegExp(nonWordCharacters)}]+\\s*`);
    } else {
      segments.push(`_*${snakeCamelSegment}`);
      segments.push(`\\s*[${_.escapeRegExp(nonWordCharacters)}]+`);
    }
    segments.push('_+');
    return new RegExp(segments.join('|'), 'g');

 */

feed=(s,i=0)=>n=>{
  let take=n=>n==1?s[i]: (s=>s===""?undef:s)(s.slice(i,i+n)), sloc=feed.fold_sloc()
  if(n<0){n=-n; s1=take(n); i+=n} else
  s1=(n!=0)?take(n) : Instype([s,i,sloc], {
    error(a,msg){ throw Error(`Parse "${a[0].slice(0,feed.nVp)}" fail @${a[1]}, "${a.peek}: ${msg}"`) },
    get_peek:a=>{ let nV=div(feed.nVp,2), [s,i]=a; return s.slice((nV>i)?0: i-nV, i)+"^"+s.slice(i,i+nV); },
    get_n:([s,i])=>s.length-i,
    get_sloc:a=>a[2]()
  })//Instype ._d .st(k,init)
  return s1
}
feed.fold_sloc=noOp;

noWhite=(s,p_ws)=>n=>{
  me.tok=0; me.span=[[0,0,""]]; me.wsBefore=new Map; me.skip=skip; //k /* 注释除号
  span={i:a=>a[0],i1:a=>a[1],str:(a,s)=>s?s.slice(a.i,a.i1):a[2]} //草
}
//feed,eTakeIf,runP,slicerP,noWhite

//More,One,Paired,Seq

//P={cvt,noo,calm,errs,of:{or,tok,calm,showBy,toString},pars} //top,concat,mod,seeLeft,needWs1


trieS=(d,a)=>(k,v)=>{
  let p=d,kk,p1,N, pfix=(a,b)=>{let i=0,N=Math.min(n(a),n(b));for(;i<N;i++)if(a[i]!==b[i])return i;  return N} //v 但 p= 后要立刻切到下层，而不是继续这层；每段只需判 不存在?创建 不是点?重设:没事 步过
  //for([kk,p1] of p)if(N=pfix(k,kk)){console.log(kk,N,k);if(!p.has(kk)||(p1=p.get(kk)).constructor!=Map||0&(p=p1))p.set(kk.slice(0,N), p=p.delete(kk)? new Map([[kk.slice(N),p1]]) : new Map);k=k.slice(N);}
  //out:while(1){for([kk,p1] of p)if(N=pfix(k,kk)){k=k.slice(N);console.log(kk,N,k,p1);if(!p1.get||!(p1=p1.get(kk))||0&(p=p1))p.set(kk.slice(0,N), p=p.delete(kk)? new Map([[kk.slice(N),p1]]) : new Map);else continue out; break} break}
  //p.set(k,v)
  //path:while(1){for([kk,p1]of p)if(N=pfix(kk,k)){p=p1.get?p1: p.set(kk.slice(0,N), p.delete(kk)&&new Map([[kk.slice(N),p1],[k,v]]) ); k=k.slice(N);console.log(k,kk,p);continue path} p.set(k,v);break}
  //,rec=(p,k)=>{for(let[kk,p1]of p)if(N=pfix(kk,k))if(p1.get)return rec(p1,k.slice(N)); else return p.set(kk.slice(0,N), p.delete(kk)&&new Map([[kk.slice(N),p1],[k.slice(N),v]]) );  p.set(k,v)}; rec(d,k)//原来既创 p1 不能递归 set,，终于 //v if(!p1.get){p.set(k,v);break out}p=p1,k=k.slice(N);continue out} 改了半天啊 tha thb trx 切不开
  out:while(1){for(let[kk,p1]of p)if(N=pfix(kk,k))if(p1.get&N==kk.length){p=p1,k=k.slice(N);continue out} else {if(N==kk.length&&p1.get){p=p1,k=k.slice(N);continue out}else p.set(kk.slice(0,N), p.delete(kk)&&new Map([[kk.slice(N),p1],[k.slice(N),v]]) );break out}  p.set(k,v);break}
}
ts=trieS(d=new Map)
ss("pub pri pro").forEach(ts)
ss("abstract continue for new switch assert default goto package synchronized boolean do if private this break double implements protected throw byte else import public throws case enum instanceof return transient catch extends int short try char final interface static void class finally long strictfp volatile const float native super while true false").forEach(ts)
//ss("try transient this").forEach(ts)

slicerP=Object.assign((opre, dOk=0)=>s=>{
  let q=!isFunc(opre), sR=opre, re=q?isStr(sR)?RegExp("^"+sR):RegExp("^"+sR.source,sR.flags):NO,
    d=1, s0="", m0=null,  ml0=0,i1=0,  {step,op_exc_i1,re_exc_eof}=slicerP;
  const
    len=(m)=>{let sum=0,i=1,N=n(m); for(;i<N;i++) sum+=isNul(m[i])?0:n(m[i]);  return sum}, // must have ()capture
    finish=(skip,m)=>skip(-(len(m)+dOk))&&[...m].slice(1)
  for(;;d+=step) { let sNew=s(d); if(isNon(sNew)||n(sNew)==n(s0))return q? isNul(m0)?NO:finish(s,m0) : m0;  s0=sNew;
    if(q){ m=re.exec(s0); if(!isNul(m)) if(len(m)==ml0)return finish(s,m); else m0=m,ml0=len(m); }
    else try{m0=opre(s0);}catch(ex){
      if(!re_exc_eof.test(ex.message)) i1=op_exc_i1(ex);
      if(i1==null)throw ex; if(i1!=0){m0=opre(s0.slice(0,i1)); s(-i1); return m0;}
    }
  }
}, {
  step:3,
  op_exc_i1:ex=>reCond(/(\d+)/,just(NO),parseInt,ex.message),
  re_exc_eof:/(end)|(eof)/i
})

slicerP(JSON.parse)(feed("1"))==1;
slicerP(/(a)/)(feed("abc"))==["a"];
slicerP(/f([\w\d])k/,2)(feed("f2k"))==2;
