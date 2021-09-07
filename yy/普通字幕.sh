#!/bin/bash
PY=python
src=$(dirname $0)
export VOSK_MOD=small-cn-0.3
[ -f a.srt ]||time $PY $src/stt.py $1&&lrc_merge -o b.srt -dist 0.1 a.srt

srt-process -f print --input b.srt  2>/dev/null #校对字幕各行
$PY $src/atag2srt.py b.srt '""'>c
$PY $src/atag2srt.py c>c.srt
