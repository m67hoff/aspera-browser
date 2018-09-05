FROM node:8
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install 
COPY . .
EXPOSE 8888
CMD [ "npm", "start" ]
USER node