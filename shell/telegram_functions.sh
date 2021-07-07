#!/bin/bash

TOKEN="${BOT_TELEGRAM_TOKEN}"
CHAT_ID="$1"

TELEGRAM_API_URL="https://api.telegram.org/bot${TOKEN}"

sendTelegramNotification() {
    echo "New Telegram Notification"
    echo "Chat ID: ${CHAT_ID}"
    echo "Message: $2"

    curl \
        --request GET \
        --data "chat_id=${CHAT_ID}" \
        --data "parse_mode=Markdown" \
        --data-urlencode "text=$2" \
        "${TELEGRAM_API_URL}/sendMessage"
}

