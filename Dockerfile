FROM node:12.18-alpine
WORKDIR /usr/src/app
COPY ["package.json", "yarn.lock*", "tsconfig.json*", "npm-shrinkwrap.json*", "./"]
RUN yarn install && mv node_modules ../
RUN yarn build
ENV NODE_ENV=production
COPY . .
CMD ["yarn", "start"]
