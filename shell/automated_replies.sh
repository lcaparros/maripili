#!/bin/bash

base=$(dirname "$0")

. $base/telegram_functions.sh
. $base/giphy_functions.sh

update_offset=1

get_language() {
    curl -X POST \
        -H "Authorization: Bearer "$(gcloud auth application-default print-access-token) \
        -H "Content-Type: application/json; charset=utf-8" \
        -d @request.json \
        "https://translation.googleapis.com/language/translate/v2/detect"
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
        message_language=$(get_language $t)
        echo "Message: $message_language"
        if [[ ${message_language} == "EN" ]]; then
            echo "New Reply Notification - No English!"
            echo "Chat ID: ${chat_id}"
            echo "Message: ${t}"
            replyTelegramMessage "$chat_id" "$message_id" "A mi en inglés no!!"
        elif [[ $t == *"/start"* ]]; then
            echo "New Telegram Notification"
            echo "Chat ID: ${chat_id}"
            echo "Message: ${t}"
            sendTelegramMessage "${chat_id}" "Así no funsiona esto kabesa"
        elif [[ $t == *"/gif"* ]]; then
            echo "New Gif sent"
            echo "Chat ID: ${chat_id}"
            search_term=$(echo $t | cut -d ' ' -f2-)
            echo "Search term: ${t}"
            sendTelegramAnimation "${chat_id}" "$(search_gif $(shuf -i 1-500 -n 1) "${search_term}")"
        elif echo $t | grep -iqF "chiquito"; then
            echo "New Reply Notification"
            echo "Chat ID: ${chat_id}"
            echo "Replied message id: ${message_id}"
            replyTelegramMessage "$chat_id" "$message_id" "$(cat $base/chiquito.txt | head -n $(shuf -i 1-49 -n 1) | tail -n 1)"
        elif echo $t | grep -iqF "lopera"; then
            echo "New Reply Notification"
            echo "Chat ID: ${chat_id}"
            echo "Replied message id: ${message_id}"
            replyTelegramMessage "$chat_id" "$message_id" "$(cat $base/lopera.txt | head -n $(shuf -i 1-12 -n 1) | tail -n 1)"
        elif echo $t | grep -iqF "/desertores"; then
            echo "New Telegram Notification"
            echo "Chat ID: ${chat_id}"
            new_msg=$(echo $t | cut -d ' ' -f2-)
            echo "Message: ${new_msg}"
            sendTelegramMessage "${chat_id}" "${new_msg}"
        fi
    done
}

while true;
do
    # Get messages from telegram and reply if necessary
    fetchMessages
done
