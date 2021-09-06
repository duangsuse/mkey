#speech to text ; use hachiko-bapu lrc_merge -o b.srt -dist 0.1 a.srt 
import vosk,json, srt #Model(file),XRecognizer
from subprocess import Popen, PIPE
from itertools import chain
import sys,os#stderr,env
vosk.SetLogLevel(-1)
FP_MOD=(lambda k:os.path.expanduser(f"~/.local/share/kdenlive/speechmodels/vosk-model-{k}"))(os.getenv("VOSK_MOD","small-en-us-0.15"))

ss=str.split
def strmRecog(fp, fpMod=FP_MOD, nSamp=16000,nBlk=4000):
  o=vosk.KaldiRecognizer(vosk.Model(fpMod),nSamp)
  o.SetWords(True)
  s=Popen([*ss("ffmpeg -loglevel quiet -i"), fp, *ss(f"-ar {nSamp} -ac 1 -f s16le -")], stdout=PIPE).stdout
  return lambda:s.read(nBlk),o

def recog(read,rec):
  kProg=0; one=lambda x:json.loads(x)["result"]
  while True:
    data = read()
    print(f"\rat: {kProg}", file=sys.stderr, end="",flush=True)
    kProg += 1
    if len(data) == 0: break
    if rec.AcceptWaveform(data): yield one(rec.Result())
  try: yield one(rec.FinalResult())
  except KeyError: pass#不需要 [if x!=None] 喽

ls=[x for x in recog(*strmRecog(*sys.argv[1:]))]
t=lambda x,k:srt.timedelta(seconds=x[k])
ls1=[srt.Subtitle(i, t(x,"start"), t(x,"end"), x["word"]) for i,x in enumerate(chain(*ls))]
#breakpoint()

def wf(fp,s):
  with open(fp,"w", encoding="utf8") as f:f.writelines(s)

wf("a.srt", srt.compose(ls1))
