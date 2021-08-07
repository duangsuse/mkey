from PIL import Image, ImageDraw, ImageFont
try:
  from cv2 import UMat, VideoCapture, VideoWriter;import cv2,srt
  from numpy import array #mapMatWithPIL
except:pass

from itertools import cycle, repeat
from collections import namedtuple

def calcItemColors(img, layout):
  (w, h) = img.size
  (ww, hh, m, n, padLeft, padTop) = layout
  img_pixs = img.resize((m, n), Image.BICUBIC, box=(padLeft, padTop, w-padLeft, h-padTop))

  for i in range(0, n):
    for j in range(0, m):
      (y, x) = (padTop + i*hh, padLeft + j*ww)
      yield (x, y, img_pixs.getpixel((j, i)) )

def calcItemLayout(wh, wh_item, c):
  (w, h) = wh
  (ww, hh) = tuple((l+sp)*c.scale for (l, sp) in zip(wh_item, c.spacing))
  (m, n) = tuple(int(v) for v in [w / ww, h / hh])
  (padLeft, padTop) = tuple(int(l*c.scale / 4) for l in [(w % ww), (h % hh)])
  return (ww, hh, m, n, padLeft, padTop)

def drawMontageText(img, xyc, seq, cfg):
  draw = ImageDraw.Draw(img)
  for (x, y, color) in xyc:
    c1 = cfg.calcColor(color)
    if c1 != None: draw.text((x, y), next(seq), font=cfg.font, fill=(c1))

# util funcs
def let(op,x):return op(x) if x!=None else x

def hexcolor(s):s=s.lstrip("#");return tuple(int(s[i:i+2], 16) for i in range(0, len(s), 2))
def isColorNear(c0, nmax, c):
  diff = map(lambda c: abs(c[0] - c[1]), zip(c, c0) )
  return sum(diff) < nmax

def mapPIL_UMat(mat, op):
  img = Image.fromarray(array(mat))
  return UMat(array(op(img)))

def cv2VideoInfo(cap):
  props = [cv2.CAP_PROP_FRAME_COUNT, cv2.CAP_PROP_FRAME_WIDTH, cv2.CAP_PROP_FRAME_HEIGHT]
  return (cap.get(cv2.CAP_PROP_FPS),) + tuple(int(cap.get(p)) for p in props)

def expandSrt(srt, fps, N, placeholder):
  indexed = [placeholder for _ in range(N)]
  no = lambda t: int(t.total_seconds() * fps)
  for srt in srts:
    start, end = no(srt.start), no(srt.end)
    indexed[start:end] = repeat(srt.content, end - start)
  return indexed

# font(size), scale, spacing; key_color
class Montage(namedtuple("Mon", "font text key_color scale spacing calcColor back_color newSize".split())):
  def __new__(cls, cfg, size):
    t=super(Montage,cls)
    cfg.back_color = let(hexcolor, cfg.mon_background) or cfg.key_color
    cfg.newSize=tuple(int(l*cfg.scale) for l in size)
    o=t.__new__(cls,**dict(e for e in cfg._get_kwargs() if e[0] in t._fields))
    o.updLayout()
    return o
  def updLayout(self):
    if len(self.text) == 0: return
    self.layout = calcItemLayout(self.newSize, self.font.getsize(self.text[0]), self) #spacing

  def runOn(self, image):
    areas = calcItemColors(image, self.layout)
    newImage = Image.new(image.mode, self.newSize, self.back_color)
    drawMontageText(newImage, areas, cycle(self.text), self) #calcColor
    return newImage

from time import time, strftime

def playCvMontage(cap, mon, title="Montage", filename="mon.avi", srt=None, placeholder="#"):
  (fps, N, _, _) = cv2VideoInfo(cap)
  vid = VideoWriter(filename, VideoWriter.fourcc(*"FMP4"), fps, mon.newSize)
  ary = expandSrt(srt, fps, N, placeholder) if srt != None else None

  cv2.namedWindow(title, cv2.WINDOW_NORMAL)
  T0 = time()
  index = 0
  qnext, img = cap.read()
  while qnext:
    if srt != None:
      s0 = mon.text; s1 = ary[index]
      if s1 != s0: mon.text = s1; mon.updLayout()
    img1 = mapPIL_UMat(img, mon.runOn) 
    cv2.imshow(title, img1)
    vid.write(img1)

    key = chr(cv2.waitKey(1) & 0xFF)
    if key == 'q': break
    elif key == 'p':
      duration = time() - T0
      print("%i time=%.3fs %.3ffps" %(index, duration, index/duration) )
    qnext, img = cap.read()
    index += 1
  vid.release()

from mimetypes import guess_type
import argparse,os.path

def ArgP(*a,**kw):
  a=list(a);a.insert(1,None)#usage
  ags=list(popwhile(a,lambda x:isinstance(x,list)))
  r=argparse.ArgumentParser(*a,**kw)
  for ag in ags:
    o=r.add_argument_group(ag[0])
    for i in range(1,len(ag)):
      (k,t,v_deft,help)=ag[i]
      o.add_argument(k,type=t,default=v_deft,help=help, nargs=v_deft if k[0]!='-' else None)
  return r

def popwhile(a,p):
  while p(a[-1]):yield a.pop()

class FileNameArg(argparse.FileType):
  def __call__(self, s):
    return super().__call__(s).name

app = ArgP("montage","Draw montage pictures built from cycle char sequence, with font(size), scale, spacing", [
  "basic params",
  ("-font", FileNameArg("r"),None, "font path supported by Python Pillow library"),
  ("-font-size", int, 10, "size of font (e.g. 14)"),
  ("-scale", float, 1.0, "scale for input image"),
  ("-spacing", lambda s:tuple(int(x)for x in s[1:].split(",")) , (0,0), ":h,v horizontal,vertical padding each item"),
  ("-text", str, "#", "cycling montage text"),
  ("images", FileNameArg("r"),"+", "images to generate montage")
],[
  "background key color",
  ("-key-color", str, "#FFFFFF", "key color for new bitmap"),
  ("--key-thres", int, 20, "color fuzzy match(sum all channels) threshold"),
  ("-subtitle", argparse.FileType("r"),None, "subtitle file for -text"),
  ("--subtitle-placeholder", str, "#", "placeholder for subtitle"),
  ("--mon-background", str, None, "replacement back-color for mon (default -key-color)")
])

def main(args):
  cfg = app.parse_args(args)
  cfg.font = ImageFont.truetype(cfg.font, cfg.font_size) if cfg.font != None else ImageFont.load_default()
  cfg.key_color = hexcolor(cfg.key_color)
  cfg.calcColor = lambda c: None if isColorNear(cfg.key_color, cfg.key_thres, c) else c
  readSrt = lambda it: srt.parse(it.read())

  print(f"{cfg.font_size}px, rgb{cfg.key_color} ±{cfg.key_thres} {cfg.spacing}")
  for fp in cfg.images:
    (name,_) = os.path.splitext(fp)
    ft=guess_type(fp)[0].startswith
    if ft("video/"):
      cap = VideoCapture(fp)
      (fps, N, w, h) = cv2VideoInfo(cap)
      print(f"{fps}fps*{N} {w}x{h}")

      playCvMontage(cap, Montage(cfg, (w, h) ), filename=f"{name}_mon.avi", srt=let(readSrt, cfg.subtitle), placeholder=cfg.subtitle_placeholder)
      cap.release()
    else:
      img = Image.open(fp)
      Montage(cfg, img.size).runOn(img).save(f"{name}_mon.png")

from sys import argv
if __name__ == "__main__": main(argv[1:])
