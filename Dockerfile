FROM node:8.9.4-alpine
MAINTAINER Shrikant Patnaik <shrikant.patnaik@gmail.com>

ENV BUILD_PACKAGES="python make gcc g++ git libuv bash curl tar bzip2" \
    NODE_ENV=production \
    PORT=3000

WORKDIR /root/app/bundle

ADD build/app.tar.gz /root/app

RUN apk --update add ${BUILD_PACKAGES} \
    && (cd programs/server/ && npm install --unsafe-perm) \
    && apk --update del ${BUILD_PACKAGES}

EXPOSE 3000
CMD METEOR_SETTINGS=$(cat /root/app/settings/settings.json) node main.js
