FROM node:8

ENV PLATFORM docker
ENV NODE_ENV production
ENV BASE_DIR /opt/asperabrowser

WORKDIR ${BASE_DIR}/app

COPY package*.json ./
RUN npm install 

COPY . .
RUN ln -s /opt/asperabrowser/app/server.js /usr/bin/asperabrowser

WORKDIR ${BASE_DIR}/etc
COPY serverconfig.json ./
COPY webapp/webappconfig.json ./
COPY ssl.* ./ 

EXPOSE 8888
EXPOSE 44344
CMD [ "asperabrowser" ]

USER node