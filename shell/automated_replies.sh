#!/bin/bash

base=$(dirname "$0")

. $base/utils/common_functions.sh
. $base/api/telegram_functions.sh
. $base/api/giphy_functions.sh
. $base/api/voice_faker.sh
. $base/utils/audio_converter.sh

update_offset=1

get_language() {
    curl -X POST \
        -H "Authorization: Bearer "$(gcloud auth application-default print-access-token) \
        -H "Content-Type: application/json; charset=utf-8" \
        -d @request.json \
        "https://translation.googleapis.com/language/translate/v2/detect"
}

response_vocice_faker() {
    VOICE_MODEL_TOKEN=$1
    MESSAGE=$2
    audio_url=$(fake_voice "${VOICE_MODEL_TOKEN}" "${MESSAGE}" | tail -n 1)
    echo "Generated audio URL: ${audio_url}"
    mkdir -p $base/tmp
    curl -s -o $base/tmp/temp.wav "${audio_url}"
    voice_file_id=$(prepare_for_telegram_voice wav $base/tmp/temp.wav)
    rm -rf $base/tmp
    replyWithTelegramVoice "$chat_id" "$message_id" "${voice_file_id}"
}

fetchMessages() {
    messages=$(getTelegramMessages $update_offset)
    text=$(echo $messages | jq -r '[.[] | {update_id: .update_id, id: .message.message_id, chat_id: .message.chat.id, text: .message.text}]')
    length=$(echo $text | jq -r 'length')

    for((i=0;i<$length;++i)); do
        update_offset=$(echo $text | jq -r ".[$i].update_id + 1")
        t=$(echo $text | jq -r ".[$i].text")
        chat_id=$(echo $text | jq -r ".[$i].chat_id")
        message_id=$(echo $text | jq -r ".[$i].id")
        new_log
        if [[ ${message_language} == "EN" ]]; then
            echo "New Reply Notification - No English!"
            echo "Received message: ${t}"
            replyTelegramMessage "$chat_id" "$message_id" "A mi en inglés no!!"
        elif [[ $t == *"/start"* ]]; then
            echo "New Telegram Notification"
            echo "Received message: ${t}"
            sendTelegramMessage "${chat_id}" "Así no funsiona esto kabesa"
        elif [[ $t == *"/gif"* ]]; then
            echo "New Gif sent"
            search_term=$(echo $t | cut -d ' ' -f2-)
            echo "Search term: ${t}"
            sendTelegramAnimation "${chat_id}" "$(search_gif $(shuf -i 1-50 -n 1) "${search_term}")"
        elif echo $t | grep -iqF "maripili"; then
            echo "New Reply Notification to message: ${t}"
            replyTelegramMessage "$chat_id" "$message_id" "$(cat $base/resources/maripili.txt | head -n $(shuf -i 1-6 -n 1) | tail -n 1)"
        elif echo $t | grep -iqF "chiquito dime"; then
            echo "New Telegram Voice with Chiquito voice"
            echo "Received message: ${t}"
            tts=$(echo $t | cut -d ' ' -f3-)
            response_vocice_faker "TM:farceb1p554n" "$tts"
        elif echo $t | grep -iqF "darth vader dime"; then
            echo "New Telegram Voice with Chiquito voice"
            echo "Received message: ${t}"
            tts=$(echo $t | cut -d ' ' -f4-)
            response_vocice_faker "TM:ssrc0c3kqf5w" "$tts"
        elif echo $t | grep -iqF "chiquito"; then
            echo "New Reply Notification to message: ${t}"
            RANDOM_NUMBER=$(shuf -i 1-10 -n 1)
            if [ "${RANDOM_NUMBER}" -gt "3" ]; then
                replyWithTelegramVoice "$chat_id" "$message_id" "$(cat $base/resources/chiquito_voices.txt | sort -R | tail -n 1)"
            else
                replyTelegramMessage "$chat_id" "$message_id" "$(cat $base/resources/chiquito.txt | sort -R | tail -n 1)"
            fi
        elif echo $t | grep -iqF "homer"; then
            echo "New Reply Notification to message: ${t}"
            replyWithTelegramVoice "$chat_id" "$message_id" "$(cat $base/resources/homer_voices.txt | sort -R | tail -n 1)"
        elif echo $t | grep -iqF "lopera"; then
            echo "New Reply Notification to message: ${t}"
            replyTelegramMessage "$chat_id" "$message_id" "$(cat $base/resources/lopera.txt | head -n $(shuf -i 1-12 -n 1) | tail -n 1)"
        elif cat $base/resources/insultos.txt | grep -iqE "$(echo "${t}"| sed 's^ ^\| ^g')"; then
            echo "New Reply Notification to message: ${t}"
            # replyTelegramMessage "$chat_id" "$message_id" "$(cat $base/resources/bocasucia.txt | head -n $(shuf -i 1-8 -n 1) | tail -n 1)"
        elif echo $t | grep -iqF "/desertores"; then
            echo "New Telegram Notification to Desertores"
            new_msg=$(echo $t | cut -d ' ' -f2-)
            sendTelegramMessage "${DESERTORES_CHAT_ID}" "${new_msg}"
        else
            echo "No reply notification to received message: ${t}"
            echo "Chat ID: ${chat_id}"
        fi
    done
}

while true;
do
    # Get messages from telegram and reply if necessary
    fetchMessages
done
