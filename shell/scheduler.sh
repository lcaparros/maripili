#!/bin/bash

CHAT_ID="6269548"

base=$(dirname "$0")

. $base/telegram_functions.sh
. $base/giphy_functions.sh

desertores_morning() {
    morning=$(cat $base/morning_phrases.txt | head -n $(date +%d) | tail -n 1)
    sendTelegramAnimation "${CHAT_ID}" "$(search_gif $(date +%j) goat)"
    sendTelegramMessage "${CHAT_ID}" "${morning}"
}

desertores_night() {
    sendTelegramMessage "${CHAT_ID}" "A ustedes!!"
}

scheduler() {
    while [ "$1" != "" ]; do
        case $1 in
            -m | --morning )
                desertores_morning
                ;;
            -n | --night )
                desertores_night
                ;;
            * )
                echo "Usage: $0 [-m | --morning] [-n | --night]"
                exit 1
        esac
        shift
    done
}

scheduler $@