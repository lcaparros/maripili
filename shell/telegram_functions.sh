#!/bin/bash

TOKEN="${BOT_TELEGRAM_TOKEN}"

TELEGRAM_API_URL="https://api.telegram.org/bot${TOKEN}"

sendTelegramMessage() {
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

sendTelegramAnimation() {
    CHAT_ID="$1"
    ANIMATION_URL="$2"

    echo "New Telegram Notification"
    echo "Chat ID: ${CHAT_ID}"
    echo "Animation: ${ANIMATION_URL}"

    curl \
        --request GET \
        --data "chat_id=${CHAT_ID}" \
        --data-urlencode "animation=${ANIMATION_URL}" \
        "${TELEGRAM_API_URL}/sendAnimation"
}
