#!/bin/bash

CHAT_ID="xxxxxx"

output=$(basename $(pwd))

for f in *.mp3
do
  newFileName=$(echo $f | sed 's/\.mp3/\.ogg/g' | tr " " "_" | sed 's/\!//g')
  ffmpeg -i "$f" -vn -acodec libopus -b:a 48k "${newFileName}" -y
  curl -F voice=@\""${newFileName}"\" https://api.telegram.org/bot1842565926:AAHwS7j3WvO26JRGiqHcG1U9iUEkAnsgRsA/sendVoice?chat_id=6269548 | jq -r '.result.voice.file_id' >> "${output}.txt"
done

rm *.Identifier
mkdir ${output}_ogg
mv *.ogg ${output}_ogg
