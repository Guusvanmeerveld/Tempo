FROM node:12.18-alpine
FROM python:3
RUN apk add --no-cache ffmpeg
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN yarn install --production && mv node_modules ../
COPY . .
CMD ["yarn", "start"]
