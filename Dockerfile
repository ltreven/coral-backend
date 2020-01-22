FROM node AS base

WORKDIR /usr/src/app
COPY . ./
RUN npm install

EXPOSE 3000

CMD npm test
