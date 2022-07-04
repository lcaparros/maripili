#!/bin/bash

TOKEN="${BOT_TELEGRAM_TOKEN}"

TELEGRAM_API_URL="https://api.telegram.org/bot${TOKEN}"

getTelegramUpdates() {
    offset="$1"
    options="$2"
    curl \
        --silent \
        --request GET \
        --data "offset=${offset}" \
        --data "allowed_updates=[$options]" \
        "${TELEGRAM_API_URL}/getUpdates"
}

getTelegramMessages() {
    getTelegramUpdates $1 '"message"' | jq -r '.result' | jq -r '[.[] | select(.message != null and .message.text != null)]'
}

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

replyTelegramMessage() {
    CHAT_ID="$1"
    MESSAGE_TO_REPLY="$2"
    MESSAGE="$3"

    echo "New Telegram Reply"
    echo "Chat ID: ${CHAT_ID}"
    echo "Message to reply: ${MESSAGE_TO_REPLY}"
    echo "Message: ${MESSAGE}"

    curl \
        --request GET \
        --data "chat_id=${CHAT_ID}" \
        --data "reply_to_message_id=${MESSAGE_TO_REPLY}" \
        --data "parse_mode=Markdown" \
        --data-urlencode "text=${MESSAGE}" \
        "${TELEGRAM_API_URL}/sendMessage"
}

sendTelegramAnimation() {
    CHAT_ID="$1"
    ANIMATION_URL="$2"

    echo "New Telegram Animation"
    echo "Chat ID: ${CHAT_ID}"
    echo "Animation: ${ANIMATION_URL}"

    curl \
        --request GET \
        --data "chat_id=${CHAT_ID}" \
        --data-urlencode "animation=${ANIMATION_URL}" \
        "${TELEGRAM_API_URL}/sendAnimation"
}

replyWithTelegramVoice() {
    CHAT_ID="$1"
    MESSAGE_TO_REPLY="$2"
    AUDIO_FILE="$3"

    echo "New Telegram reply with voice"
    echo "Chat ID: ${CHAT_ID}"
    echo "Message to reply: ${MESSAGE_TO_REPLY}"
    echo "Voice file path: ${AUDIO_FILE}"

    curl \
        --request GET \
        --data "chat_id=${CHAT_ID}" \
        --data "reply_to_message_id=${MESSAGE_TO_REPLY}" \
        --data "parse_mode=Markdown" \
        --data "protect_content=true" \
        --data "voice=${AUDIO_FILE}" \
        "${TELEGRAM_API_URL}/sendVoice"
}
