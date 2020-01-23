FROM node AS base

WORKDIR /usr/src/app
# Install app dependencies
COPY package*.json ./
RUN npm install
# Copy app source code
COPY . .

EXPOSE 3000

CMD npm test
