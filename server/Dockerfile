FROM node:16-bullseye

WORKDIR /server

COPY package.json .
COPY yarn.lock .

RUN yarn

COPY . .

CMD ["yarn", "start"]