#!/bin/bash

SLACK_HOOK_URL=""

sendSlackNotification() {
    echo "Sending Slack notification"
    echo "Message: $1"

    curl \
        --header "Content-Type: application/json" \
        --request POST \
        --data "$1" \
        "${SLACK_HOOK_URL}" \
        --fail
}

