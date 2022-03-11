#!/bin/bash

TOKEN="${BOT_TELEGRAM_TOKEN}"

TELEGRAM_API_URL="https://api.telegram.org/bot${TOKEN}"

sendTelegramNotification() {
    CHAT_ID="$1"
    MESSAGE="$2"

    echo "New Telegram Notification"
    echo "Chat ID: ${CHAT_ID}"
    echo "Message: ${MESSAGE}"

    curl \
        --request GET \
        --data "chat_id=${CHAT_ID}" \
        --data "parse_mode=Markdown" \
        --data-urlencode "text=${MESSAGE}" \
        "${TELEGRAM_API_URL}/sendMessage"
}

