#!/bin/bash

CHAT_ID="xxxxxx"

prepare_for_telegram_voice() {
  INPUT_FORMAT=$1
  FILE_NAME=$2
  newFileName=$(echo ${FILE_NAME} | sed "s/\.${INPUT_FORMAT}/\.ogg/g" | tr " " "_" | sed 's/\!//g')
  ffmpeg -i "${FILE_NAME}" -vn -acodec libopus -b:a 48k "${newFileName}" -y > /dev/null 2>&1
  curl -F voice=@\""${newFileName}"\" "https://api.telegram.org/bot1842565926:AAHwS7j3WvO26JRGiqHcG1U9iUEkAnsgRsA/sendVoice?chat_id=6269548" | jq -r '.result.voice.file_id'
}

prepare_audios_in_directory() {
  output=$(basename $(pwd))
  
  for f in *.mp3
  do
    prepare_for_telegram_voice mp3 "$f" >> "${output}.txt"
  done

  rm *.Identifier
  mkdir ${output}_ogg
  mv *.ogg ${output}_ogg
}
