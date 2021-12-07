FROM node:16-alpine

ENV NAME rw-adapter-gfw
ENV USER rw-adapter-gfw

RUN apk update && apk upgrade && \
    apk add --no-cache --update bash git openssh python3 alpine-sdk

RUN addgroup $USER && adduser -s /bin/bash -D -G $USER $USER

RUN mkdir -p /home/$USER/.cache/yarn
RUN chown -R $USER:$USER /home/$USER
RUN yarn global add bunyan

RUN mkdir -p /opt/$NAME
COPY package.json /opt/$NAME/package.json
COPY tsconfig.json /opt/$NAME/tsconfig.json
COPY yarn.lock /opt/$NAME/yarn.lock
RUN cd /opt/$NAME && yarn

COPY entrypoint.sh /opt/$NAME/entrypoint.sh
COPY config /opt/$NAME/config

WORKDIR /opt/$NAME

COPY ./app /opt/$NAME/app
RUN chown -R $USER:$USER /opt/$NAME

# Tell Docker we are going to use this ports
EXPOSE 3005
USER $USER

ENTRYPOINT ["./entrypoint.sh"]
