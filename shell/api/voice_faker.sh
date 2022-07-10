#!/bin/bash

get_voices() {
    LANGUAGE=$1
    curl -X GET -s https://api.fakeyou.com/tts/list | tac | tac | jq -r "[.models[] | select(.ietf_language_tag == \"${LANGUAGE}\") | .title]"
}

get_voice_model_token() {
    LANGUAGE=$1
    TITLE=$2
    curl -X GET -s https://api.fakeyou.com/tts/list | tac | tac | jq -r ".models[] | select(.ietf_language_tag == \"${LANGUAGE}\") | select(.title | contains(\"${TITLE}\")) | .model_token"
}

fake_voice() {
    VOICE_TOKEN=$1
    TEXT=$2
    FAKE_API_URL="https://api.fakeyou.com"
    FAKE_BUCKET_URL="https://storage.googleapis.com/vocodes-public"

    UUID=$(uuidgen)
    INFERENCE_JOB_TOKEN=$(curl \
        --silent \
        --request POST \
        --header 'Accept: application/json' \
        --header 'Content-Type: application/json' \
        --data-raw "{\"uuid_idempotency_token\":\"${UUID}\",\"tts_model_token\":\"${VOICE_TOKEN}\",\"inference_text\":\"${TEXT}\"}" \
        "${FAKE_API_URL}/tts/inference" \
        | jq -r '.inference_job_token')
    echo "INFERENCE_JOB_TOKEN: ${INFERENCE_JOB_TOKEN}"
    
    while true; do
        INFERENCE_JOB_DATA=$(curl \
            --silent \
            --request GET \
            --header 'Accept: application/json' \
            --header 'Content-Type: application/json' \
            "${FAKE_API_URL}/tts/job/${INFERENCE_JOB_TOKEN}" \
            | jq -r '{status: .state.status, bucket: .state.maybe_public_bucket_wav_audio_path }')
        INFERENCE_JOB_STATUS=$(echo "$INFERENCE_JOB_DATA" | jq -r '.status')
        echo "INFERENCE_JOB_STATUS: ${INFERENCE_JOB_STATUS}"
        if [[ "${INFERENCE_JOB_STATUS}" == *"complete_success"* ]]; then
            break
        fi
        sleep 1
    done

    echo "${FAKE_BUCKET_URL}$(echo "$INFERENCE_JOB_DATA" | jq -r '.bucket')"
}
