FROM node:12.18-alpine
FROM python:3
FROM jrottenberg/ffmpeg:4.3-ubuntu1804
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production && mv node_modules ../
COPY . .
CMD ["npm", "start"]
