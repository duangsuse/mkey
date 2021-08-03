/* 
状态机是形如 [] 的数组状 Map ，其K=状态编号，V=[test,a,b]
test "abc" 内字符，:a~z 区间，null 总是
a,b 正数 action, 负跳转, 0无动作

这是一个确定状态机(DFA)，因为它没有复数个成立后项 a* ，非确定的 NFA 则仅有多个成立后项没有不成立 b ；可以用 bfs 算法匹配 NFA
^骗你的！*FA 都只有成立状态转移，它们执行中是总在收集规则列表的，SNFA-endIdx->NFA-finIdxs->DFA

action(s,o) 是数 no 则默认为 o.token(s,no)
"ab" 转化为 a=>b->act
a+ 为 a=>a->a : err ，如"0"出现并重复
a* 为 a=>a->a
a? a=>a->0

"1234"
("kotlin"|"kiot")
("a "|"b ")
{buildTree().toDFA()} {minimize()}{minimize().compressed()} String(randInt(0,2000)*3)
removeRange/If, Bits

Graph: NFA
  node(-1){"Final"; "red"}
  node(beginCell){"blue"}
  each(i,d=node(i){!i.isDum "$i: ${i.charClass}"})=>i.out.each(j)=>link(d, node(j))
DFA
  each(i,d=node(i){i.isFin "red"})=>zip(i.outs,i.ranges).each([o,r])=>link(d,node(o)){if(expand)r.expand else String(r)}
*/
stx_=(a,act)=>s=>{
  let i=0,i0=i, st=0,c,s1,stk=[],tok=[], test=(k,s)=>{let r= k==""?true: (k[1]!="~")? k.includes(s):2, i=1; while(r>1){if(k[i-1]<=s&&s<=k[i+1])return r==2; i+=2;r=s[i]=="~"?2:s[i]=="-"?3:false}  return r},
  err=(sm)=>{throw [sm,s,i0,i,st,c,a[st]]}, ok=s=>tok.push(s);
  for(c of s) { let[p,a,b]=a[st]; s1=test(p,c)?a:b; if(s1>0)(s1==2)?stk.push(st):(s1==3)?(st=stk.pop()): act[s1]({s:s.slice(i0,i), w:act[0],err,ok}); else if(s1!=0){i0=i;st=-s1} i++}
  return tok
}
stx=(ss,...v)=>{ // :nick, a~z, nrtfb, "str"
  let o=[0], i=0,N=ss.length, s="", w=v=>String.fromCharCode(o.push(v)-1), ow=x=>o[x.charCodeAt(0)];
  for(;i<N;i++)s=ss[i]+(v[i][1]?w(v[i][0])+w(v[i][1]): w(v[i])+"\u0000");
  s=/"(\\.|.)*"/[Symbol.replaceAll](s, m0=>`$${w(JSON.parse(m0))}`);
  let a=[],act=[...nick._act],k,ak,ai,  trOp=f=>(typeof f!="function")?f: act.push(f)-1, mkKW=(s,ia,ib)=>{let i=0,N=s.length,st,if(ib==1)ib=act.push(o=>o.err(`match ${s}`))-1; for(;i<N;i++)st=a.push([s[i],i==N-1?ia :st+1,ib])-1  };
  for(k of /\s+/[Symbol.split](s)) {
    if(k.startsWith("init")){act[0]=ow(k[4]);continue}
    ai=k.slice(-2).map(x=>trOp(ow(x)))
    if(k[0]=="$"&&k.length==2){mkKW(ow(k[1]), ...ai);continue} // 如果是大量关键字最好把 Trie 引进来构造重试转移图
    ak=(k[0]==":")?nick[k] : k;//abc, a~c
    a.push(ak,...ai)
  }
  return stx_(a,act)
}
nick={
  w:"a~zA~Z", d:"0~9", s:" \n\t\r\u000b\u000c", ["."]:null,
  _act:[0,o=>o.err(o.s), 0,0]
}
if(0){
t1=stx`:w${1} :0~9${2} " "${3}`
t1(" a1ba")=="1211"
t1("Daniel13265")"11111122222"
try{t1("!")}catch(ex){ex.i0==0&ex.i==0}

t2=stx`:s${0} :w+${1}`
t2("one two three")=="one two three".split(" ")

t3=stx`:d${1} :.${2}`
t3("1")==1
t3("a")==2

stx`"hello"${1} :w+${2}` //咱这里不会做子集覆盖检查，子集手检在前，以其为先；而 a~bd~f 等多区间是由 o.ck 区分 action 的，也没 merge,inverse,fromSorted 改写操作

t4=stx`": "${-1} :.+${(s,{w,ok})=>{w.v=s;ok(w)}} :w+${(s,{w})=>{w.k=s}} init${{k:0,v:0}}`
t4("apple: a kind of fruit")==["apple","a kind of fruit"]
t4("shocking: !!!")==["shocking","!!!"]
}
