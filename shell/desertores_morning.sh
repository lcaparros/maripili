#!/bin/bash

BOT_TELEGRAM_TOKEN=""
BOT_GIPHY_API_KEY=""
CHAT_ID="6269548"

base=$(dirname "$0")

. $base/telegram_functions.sh
. $base/giphy_functions.sh

# Get the daily good morning goat gif from giphy and send it to telegram Desertores channel
morning=$(cat $base/morning_phrases.txt | head -n $(date +%d) | tail -n 1)
sendTelegramAnimation "${CHAT_ID}" "$(search_gif $(date +%j) goat)"
sendTelegramMessage "${CHAT_ID}" "${morning}"
