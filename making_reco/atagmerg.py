import wave
def wf(isW, fp): return wave.open(fp,'w' if isW else 'r')

def tagYN(ln,c,op): # 0~rn.start, rn1.last~len: N, inn: YNYN...
  i0=0;q=False;  cN=c.nchannels*c.sampwidth #第一次知道音轨不是 rate*nchannel:num 还带 width 的buf?难道读取时不该拼好吗(话说开始时把rate理解为/60按分钟算了，呵
  def f_(i):
    nonlocal i0,q
    i=int(i)
    op(i0,i,q); i0=i
    q=not q
  f=lambda T: f_(c.framerate*cN*float(T))
  for (a,b,k) in map(lambda x:x[:-1].split("\t"), ln):f(a);f(b)
  f_(c.nframes*cN)

def merg(f,fa,fb,fc):
  def rd(s):return wf(0,s).readframes(-1)
  a=rd(fa);b=rd(fb)
  c=wf(1,fc)
  cfg=wf(0,fa).getparams(); c.setparams(cfg)
  def cat(i,i1,q): print("B" if q else "A",i,i1);c.writeframes(b[i:i1] if q else a[i:i1])
  tagYN(open(f,"r"), cfg,cat)

from sys import argv
merg(*argv[1:])
