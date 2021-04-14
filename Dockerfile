FROM node:12.18-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["package.json", "yarn.lock*", "tsconfig.json*", "npm-shrinkwrap.json*", "./"]
RUN yarn install && mv node_modules ../
RUN yarn build
COPY . .
CMD ["yarn", "start"]
