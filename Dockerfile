FROM node:20-alpine

ARG BUILD_DATE
ARG VERSION
LABEL version="lcaparros/mari-pili - ${VERSION} Build-date: ${BUILD_DATE}"
LABEL maintainer="lcaparros"

COPY . /app

WORKDIR /app

RUN npm install

ENTRYPOINT [ "npm run start" ]
