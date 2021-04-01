FROM node:12.18-alpine
RUN apk add --no-cache ffmpeg
WORKDIR /usr/src/app
COPY . .
RUN npm install --silent
RUN npm run build
ENV NODE_ENV=production
CMD ["npm", "start"]
