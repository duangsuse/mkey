doc=document
doc.head.innerHTML=`<style>hr{width:50px;height:50px; position:absolute}</style>`
cs=[]
"red green blue".split(" ").forEach((k,i)=>{c=doc.body.appendChild(doc.createElement("hr") ).style; c.margin= i*5+"px"; c.background=k;cs.push(c) })

onclick=(择=>{
  cs.push(cs.splice(parseInt(择),1)[0] )
  //let n=cs.length;cs.forEach((c,i)=> c.zIndex=n-i )
  cs.forEach((c,i)=> c.zIndex=i ) //好家伙，居然是越大越浅层 "越后画..
})(prompt`要前置的, 0~2`)

//本来还说要给 midiy 做 除了 序列和视口 都“统一”的设计…… 想想混乱
