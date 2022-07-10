#!/bin/bash

API_KEY="${BOT_GIPHY_API_KEY}"

search_gif() {
    OFFSET=$1
    shift
    QUERY="$(echo $@ | sed 's/ /+/g')"

    local gif=$(curl \
                    --silent \
                    --request GET \
                    --header "Accept: application/json" \
                    --data "api_key=${API_KEY}" \
                    --data "q=${QUERY}" \
                    --data "offset=${OFFSET}" \
                    --data "limit=1" \
                    --data "rating=g" \
                    -G "https://api.giphy.com/v1/gifs/search")

    echo $(echo $gif | jq -r '.data[0].images.original.url')
}
