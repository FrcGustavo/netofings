FROM node:16-alpine3.15

COPY ["package.json", "yarn.lock", "/usr/src/"]

WORKDIR /usr/src

RUN yarn

COPY [".", "/usr/src/"]

EXPOSE 3000

RUN yarn build

CMD ["yarn", "run", "start"]