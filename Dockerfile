FROM node:16-alpine3.11

RUN apk --no-cache add --virtual builds-deps build-base python

WORKDIR /app

COPY ["package.json", "yarn.lock*", "package-lock.json*", "tsconfig.json*", "npm-shrinkwrap.json*", "./"]
ADD src src

RUN yarn install --silent

RUN yarn build

ENV NODE_ENV=production

CMD ["yarn", "start"]
