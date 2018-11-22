FROM mhart/alpine-node:8

COPY ./core/ /app/core
COPY ./package.json /app

WORKDIR /app