FROM node:8

ENV NODE_ENV production
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:${NPM_CONFIG_PREFIX}/bin

RUN npm install -g asperabrowser 

COPY serverconfig.json ${NPM_CONFIG_PREFIX}/lib/node_modules/asperabrowser/
COPY webapp/webappconfig.json ${NPM_CONFIG_PREFIX}/lib/node_modules/asperabrowser/webapp/

WORKDIR /opt/asperabrowser
COPY serverconfig.json .
COPY webapp/webappconfig.json .
COPY ssl.cert .
COPY ssl.key .

EXPOSE 8888
EXPOSE 44344
CMD [ "asperabrowser" ]

USER node