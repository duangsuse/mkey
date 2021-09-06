from srt import Subtitle,timedelta, parse #pipe(Eq(parse,compose), each(prop("start end content"), join("\t")), join("\n"))
import sys; proc=eval(f"lambda x,so:{' '.join(sys.argv[2:])or 'x'}")
# 有点鸡肋,hachiko-bapu 的 lrc_merge 也能做但太重, 
def catT1(a,b): #若没zip2保存, 左移动 t0 的话整个会乱掉, 必须知道右边是啥移 t1
  if (a.end-a.start).seconds<0.1:a.end=b.start
def item(s, t=lambda n:timedelta(seconds=float(n))):
  (a,b,ln)=s.split('\t')
  t0=t(a); t1=t(b)
  return(t0,t1,proc(sys.stderr.write(f"{t0}>")and input() if ln.isspace() else ln, s))

def zip2(f,f1,z):
  x=next(z)
  for x1 in z:f(x,x1);yield f1(x);x=x1
  yield f1(x)
fp=open(sys.argv[1],'r'); ts=timedelta.total_seconds
print(
  "\n".join(map(lambda x: f"{ts(x.start)}\t{ts(x.end)}\t{proc(x.content,x)}",  parse(fp.read()))) if fp.name.endswith(".srt")
  else "".join( zip2(catT1,Subtitle.to_srt,(Subtitle(1+i,*item(ln)) for i,ln in enumerate(fp) )) )
)
