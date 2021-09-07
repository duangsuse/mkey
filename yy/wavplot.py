'''
https://zhuanlan.zhihu.com/p/57944345
https://qastack.cn/superuser/733061/reduce-background-noise-and-optimize-the-speech-from-an-audio-clip-using-ffmpeg
https://github.com/wxbool/video-srt-windows
三、利用Python库画出音频文件波形图
我们在这里利用Python以及前面介绍的wave库，辅以numpy，Matplotlib来尝试绘制temp.wav文件的波形.
下面我们来简单讲述一下绘制波形的步骤：（以temp.wav为例子）
1、通过wav库获得temp.wav的头文件中的信息，如采样率／声道数等等.
2、提取出DATA区域的信息、用numpy将string格式数据转化为数组、判定声道数将DATA区域数据进行处理； 得到每个绘制点的时间（x坐标）
4、用matplotlib库提供的方法绘制出波形图
'''
from os import path
import glob
import wave as we
import numpy as np
import matplotlib.pyplot as plt
from pydub import AudioSegment

def main(extension_list = ('*.mp4', '*.flv')):
  #os.chdir(video_dir)
  for extension in extension_list:
      for video in glob.glob(extension):
          wav_filename = path.splitext(path.basename(video))[0] + '.wav'
          AudioSegment.from_file(video).export(wav_filename, format='wav')
          on_audio(wav_filename)

def on_audio(fp):
  song = AudioSegment.from_wav(fp)
    wavdata, wavtime = drawWave(path.abspath(fp))
    plt.title("wav's Frames")
    plt.subplot(211)
    plt.plot(wavtime, wavdata[0], color='green')
    plt.subplot(212)
    plt.plot(wavtime, wavdata[1])
    plt.show()

def drawWave(path):
    wavfile = we.open(path, "rb")
    params = wavfile.getparams()
    framesra, frameswav = params[2], params[3]
    datawav = wavfile.readframes(frameswav)
    wavfile.close()
    datause = np.fromstring(datawav, dtype=np.short)
    datause.shape = -1, 2
    datause = datause.T
    time = np.arange(0, frameswav) * (1.0 / framesra)
    return datause, time

main()
