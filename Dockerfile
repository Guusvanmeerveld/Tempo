FROM node:12.18-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["package.json", "yarn.lock*", "npm-shrinkwrap.json*", "./"]
RUN yarn install --production && mv node_modules ../
COPY . .
CMD ["yarn", "start"]
