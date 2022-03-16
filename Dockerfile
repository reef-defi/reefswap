FROM node:16
WORKDIR /app
COPY package.json .yarnrc.yml /app/
RUN yarn install
COPY . /app/ 

