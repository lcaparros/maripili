FROM ubuntu:latest

ARG BUILD_DATE
ARG VERSION
LABEL version="lcaparros/mari-pili - ${VERSION} Build-date: ${BUILD_DATE}"
LABEL maintainer="lcaparros"

ARG BOT_GIPHY_API_KEY
ARG BOT_TELEGRAM_TOKEN

RUN \
    apt update && \
    apt -y install cron bash curl jq

COPY shell /scripts

RUN crontab /scripts/crontab.txt

WORKDIR /scripts

CMD bash -c "./automated_replies.sh"
