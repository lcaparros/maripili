#!/bin/bash

BOT_TELEGRAM_TOKEN="1842565926:AAHwS7j3WvO26JRGiqHcG1U9iUEkAnsgRsA"
BOT_GIPHY_API_KEY="s1jYOseq17JoSgfz6dQ3BiLGLoibRbZT"

base=$(dirname "$0")

. $base/telegram_functions.sh
. $base/giphy_functions.sh

update_offset=1

fetchMessages() {
    messages=$(getTelegramMessages $update_offset)
    text=$(echo $messages | jq -r '[.[] | {update_id: .update_id, id: .message.message_id, chat_id: .message.chat.id, text: .message.text}]')
    length=$(echo $text | jq -r 'length')

    for((i=0;i<$length;++i)); do
        update_offset=$(echo $text | jq -r ".[$i].update_id + 1")
        t=$(echo $text | jq -r ".[$i].text")
        chat_id=$(echo $text | jq -r ".[$i].chat_id")
        message_id=$(echo $text | jq -r ".[$i].id")
        if [[ $t == *"/start"* ]]; then
            echo "New Telegram Notification"
            echo "Chat ID: ${chat_id}"
            echo "Message: ${t}"
            sendTelegramMessage "${chat_id}" "Así no funsiona esto kabesa"
        elif [[ $t == *"/gif"* ]]; then
            echo "New Telegram Notification"
            echo "Chat ID: ${chat_id}"
            echo "Message: ${t}"
            sendTelegramMessage "${chat_id}" "Casi te mando un gif..."
            # search_term=$(echo $t | cut -d " " -f 2)
            # gif=$(getGiphyGif "${search_term}" "${BOT_GIPHY_API_KEY}")
            # sendTelegramMessage "${chat_id}" "${gif}"
        elif echo $t | grep -iqF "chiquito"; then
            echo "New Reply Notification"
            echo "Chat ID: ${chat_id}"
            echo "Replied message id: ${message_id}"
            replyTelegramMessage "$chat_id" "$message_id" "$(cat $base/chiquito.txt | head -n $(shuf -i 1-49 -n 1) | tail -n 1)"
        fi
    done
}

while true;
do
    # Get messages from telegram and reply if necessary
    fetchMessages
done
