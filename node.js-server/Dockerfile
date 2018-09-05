FROM node:8

ENV NODE_ENV production
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin

RUN npm install -g asperabrowser 

WORKDIR /opt/asperabrowser
COPY serverconfig.json .
COPY webapp/webappconfig.json .
COPY ssl.cert .
COPY ssl.key .

EXPOSE 8888
CMD [ "asperabrowser" ]

USER node