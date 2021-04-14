FROM node:12.18-alpine
WORKDIR /usr/src/app
COPY ["package.json", "yarn.lock*", "tsconfig.json*", "npm-shrinkwrap.json*", "./"]
ADD src ./src
RUN yarn install
RUN yarn build
ENV NODE_ENV=production 
RUN mv node_modules ../
COPY . .
CMD ["yarn", "start"]
