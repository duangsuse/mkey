#speech to text ; use hachiko-bapu lrc_merge -o b.srt -dist 0.1 a.srt 
import vosk,json, srt #Model(file),XRecognizer
from subprocess import Popen, PIPE #ffmpeg

from itertools import chain, tee
import sys,os#stderr,env
def fexec(*a):b=[(x if isinstance(x,list) else x.split()) for x in a];return Popen(chain(*b), stdout=PIPE).stdout
vosk.SetLogLevel(-1)
FP_MOD=(lambda k:os.path.expanduser(f"~/.local/share/kdenlive/speechmodels/vosk-model-{k}"))(os.getenv("VOSK_MOD","small-en-us-0.15"))
isAll=not os.getenv("NOBUF")#nobuf=realtime

try:ksAudrec=[x[:-1].decode() for x in fexec("arecord -L").readlines() if x[0]!=b" "[0]]
except:ksAudrec=[]

def strmRecog(fp, fpMod=FP_MOD, nSamp=16000,nBlk=4000):
  o=vosk.KaldiRecognizer(vosk.Model(fpMod),nSamp)
  o.SetWords(True) #maxAlter,spkModel
  s=fexec(f"ffmpeg -loglevel quiet{'' if (fp not in ksAudrec) else ' -f '+('dsound' if os.name=='nt' else 'alsa')} -i", fp, f"-ar {nSamp} -ac 1 -f s16le -")
  return lambda:s.read(nBlk),o

def recog(read,rec):
  iPrg=0; one=lambda x:json.loads(x)["result"]
  while True:
    data = read()
    print(f"\rat: {iPrg}", file=sys.stderr, end="",flush=True);iPrg += 1
    if len(data) == 0: break
    if rec.AcceptWaveform(data): yield one(rec.Result())
  try: yield one(rec.FinalResult())
  except KeyError: pass#不需要 [if x!=None] 喽

def wf(fp,s):
  with open(fp,"w", encoding="utf8") as f:
    if isAll: f.writelines(s)
    else:
      for x in s:f.write(x);f.flush()

if __name__=="__main__":
  a=sys.argv[1:]
  ls=((lambda wz:chain(*wz)) if isAll else chain.from_iterable) (recog(*strmRecog(*a[:2],*map(int, a[2:]) )) )
  t=lambda x,k:srt.timedelta(seconds=x[k])
  ls1=(srt.Subtitle(i, t(x,"start"), t(x,"end"), x["word"]).to_srt() for i,x in enumerate(ls))
  #breakpoint()

  wf("a.srt", ls1)#no srt.compose

if 0:#对照组: VOSK 的分词根本密集到不能拿来做字幕
  l0,l1=tee(wz)
  ls=chain(*l0) if isAll else chain.from_iterable(l1)
  t=lambda x,k:srt.timedelta(seconds=x[k])
  ls1=(srt.Subtitle(i, t(x,"start"), t(x,"end"), x["word"]).to_srt() for i,x in enumerate(ls))
  sys.stdout.writelines("".join(map(lambda x:x["word"],s))+"\n" for s in l1)

'''
modprobe snd-aloop pcm_substreams=1
aplay -l; arecord -l
https://qastack.cn/superuser/733061/reduce-background-noise-and-optimize-the-speech-from-an-audio-clip-using-ffmpeg
https://ccoreilly.github.io/vosk-browser/

https://dt.iki.fi/record-system-output-alsa
https://www.cnblogs.com/zhangxiuyuan/p/12016911.html
https://blog.csdn.net/weixin_39715290/article/details/116857400
https://www.jianshu.com/p/6e61010333f9
https://blog.csdn.net/leixiaohua1020/article/details/39702113 SDL
https://www.cnblogs.com/oler/p/13437701.html V4L2

import os,argparse;c=argparse.Namspace(**os.environ)
wordz=recog(stdin.buffer.detach(),

from fcntl import fcntl
import selectors
def flg(f,fl, kGET=3):fcntl(f,kGET+1,fcntl(f,kGET)|fl)
fIn=stdin.buffer.detach()
flg(fIn,2048)#nonblock

sel=selectors.DefaultSelector()
sel.register(fIn,selectors.EVENT_READ, once)
while True:
  for ev,fl in sel.select(): ev.data(ev.fileobj)
'''
