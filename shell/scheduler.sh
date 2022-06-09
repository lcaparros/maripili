#!/bin/bash

base=$(dirname "$0")

. $base/telegram_functions.sh
. $base/giphy_functions.sh

desertores_morning() {
    echo "Sending new Good Morning message to Desertores"
    morning=$(cat $base/morning_phrases.txt | head -n $(date +%d) | tail -n 1)
    sendTelegramAnimation "${DESERTORES_CHAT_ID}" "$(search_gif $(date +%j) goat)"
    sendTelegramMessage "${DESERTORES_CHAT_ID}" "${morning}"
}

desertores_night() {
    echo "Sending new Good Night message to Desertores"
    sendTelegramMessage "${DESERTORES_CHAT_ID}" "A ustedes!!"
}

scheduler() {
    new_log
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