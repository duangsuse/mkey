import wave
from functools import reduce

def zipsWave(ab,c, op, nR=1024):
  c.setparams(ab[0].getparams())
  while True:
    r=[x.readframes(nR)for x in ab]; N=min(map(len,r))
    if N==0:break
    cc=bytearray(N)
    for i in range(N): cc[i]=reduce(lambda aa,bb:op(aa[i],bb[i]), r)
    c.writeframes(cc)

nR=2048
def zipsWave1(ab,c,op):
  (a,b)=ab
  c.setparams(a.getparams())
  while True:
    aa=a.readframes(nR);bb=b.readframes(nR); N=min(len(aa),len(bb)) #len(min(aa,bb,key=len))
    if N==0:break
    cc=bytearray(N)
    for i in range(0,N): cc[i]=op(aa[i],bb[i])
    c.writeframes(cc)

def wf(isW, fp): return wave.open(fp,'w' if isW else 'r')

from sys import argv
d0=0;i=0; iDZ=0
def no2Z(d,d1): #本来是必须连续0的，现在是一个0后面的d也算...
  global d0,i,iDZ; i+=1
  q=(d0==0 and d==0); d0=d #或者 abs(d0-d)<vMin 云云,也可以是 or 对区间取舍各有效果
  #if q:print(i,d1) #看d=0的i误差多大
  if q:iDZ=d
  else:q=d==0 and i-iDZ<600 #可惜最后误差还是太大
  return (d+d1)%0xff if q else d
zipsWave1([wf(0,x)for x in argv[1:-1]] , wf(1,argv[-1]), (lambda d,d1: d1 if d==0 else d)if 0 else no2Z) #但轨1仍有可能非空白区含0 ，此刻轨2值就会变成噪点
