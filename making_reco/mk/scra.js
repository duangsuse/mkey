const
splitOneOf=(cs,s,f)=>{
  let i=0,N=s.length,i0=i,  a=[];
  for(let k=0;i<N;i++)if((k=cs.indexOf(s[i])) !=-1){a.push(s.slice(i0,i));f(a,k); i0=i+1}  a.push(s.slice(i0));f(a,-1)
  return a
},
H=(ss,...child)=>{
  let i=0, a=splitOneOf(" \u0000",ss.join("\u0000"), (a,k)=>{let i1=a.length-1,s=a[i1], si,sk;
    if(k==1||(si=s.lastIndexOf(":"))!= -1){
      if(k==1){s=Object(s);s.inn=child[i];i++}else
      {sk=s.slice(si+1); s=Object(`${s.slice(0,si)}[${sk}]`); s.key=sk} a[i1]=s}
  })
  return (e,v)=>a.map(x=>{
    let one=!x.endsWith("*"),css=one?x:x.slice(0,-1); return each(e,(e,q1)=>{
      let r; if(q1){if(e.matches(css))r=e; else return null} else r=e.querySelector(css);
      return (r==null)?[e,css]: x.inn?  (one? x.inn(r) : x.inn([...r.children],v)): //妈耶,要支持 H_aCat(a,i,a1,N) 来允许铺平实在麻烦,不能用map
        x.key? r.getAttribute(x.key) : r.textContent.trim()
    })
  })
},
each=(a,f)=>{if(a.length!=void 0){let x,y,r=[]; for(x of a){y=f(x,true);if(y!=null)r.push(y)}; return r}else return f(a,false)}

document.body.innerHTML=`
<li class="video-item matrix"><a href="https://www.bilibili.com/video/BV1QJ411n7dt?from=search&amp;seid=313378082373733150" title="蟑螂能扛得住12级大台风吗？" target="_blank" class="img-anchor"><div class="img"><div class="lazy-img"><img alt="" src="./歪点子 _ 搜索结果_哔哩哔哩_Bilibili_files/668cdcc08cb2dc8ed28922922d2845cffdfc4fc7.jpg@320w_200h_1c.webp"></div><span class="so-imgTag_rb">02:15</span><div class="watch-later-trigger watch-later"></div><span class="mask-video"></span></div><!----></a><div class="info"><div class="headline clearfix"><!----><!----><span class="type hide">日常</span><a title="蟑螂能扛得住12级大台风吗？" href="https://www.bilibili.com/video/BV1QJ411n7dt?from=search&amp;seid=313378082373733150" target="_blank" class="title">蟑螂能扛得住12级大台风吗？</a></div><div class="des hide">
      今天送给蟑螂兄一个新玩具，一个大功率吹风机，听卖家说吹出的风可以达到12级。不知道卖家有没有吹牛，接下来就拿它来吹吹蟑螂，看蟑螂能不能抵御得住12级大台风。
    </div><div class="tags"><span title="观看" class="so-icon watch-num"><i class="icon-playtime"></i>
        20.6万
      </span><i>没</i><span title="弹幕" class="so-icon hide"><i class="icon-subtitle"></i>
        1162
      </span><span title="上传时间" class="so-icon time"><i class="icon-date"></i>
        2020-01-13
      </span><span title="up主" class="so-icon"><i class="icon-uper"></i><a href="https://space.bilibili.com/410018076?from=search&amp;seid=313378082373733150" target="_blank" class="up-name">歪点子实验室</a></span></div></div></li>`

哔视频=H`.info>.headline${H`span.type a:title`}.info>.des .info>.tags*${H`:title span`}img:src .so-imgTag_rb a:href`
console.dir(H`x a${1}b${2}c d`)
