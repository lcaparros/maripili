#!/bin/bash

BOT_TELEGRAM_TOKEN=""
BOT_GIPHY_API_KEY=""
CHAT_ID=""

base=$(dirname "$0")

. $base/telegram_functions.sh
. $base/giphy_functions.sh

# Get the daily good morning goat gif from giphy and send it to telegram Desertores channel
sendTelegramMessage "${CHAT_ID}" "A ustedes!!"
