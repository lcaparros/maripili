FROM node:20-alpine

ARG BUILD_DATE
ARG VERSION
LABEL version="lcaparros/mari-pili - ${VERSION} Build-date: ${BUILD_DATE}"
LABEL maintainer="lcaparros"

ARG BOT_GIPHY_API_KEY
ARG BOT_TELEGRAM_TOKEN
ARG DESERTORES_CHAT_ID

RUN apk update && apk add bash

COPY . /app

WORKDIR /app

RUN npm install

ENTRYPOINT bash -c "npm run start"
