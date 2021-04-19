<p align="center"><img src="src/img/logo-banner.png" width="400"></p>

<p align="center">
<img src="https://img.shields.io/website-up-down-green-red/https/tempo.g-vm.nl.svg">
<img src="https://img.shields.io/github/license/Guusvanmeerveld/Tempo-TS.svg">
<img src="https://travis-ci.org/Guusvanmeerveld/Tempo-TS.png?branch=master">
<img src="https://img.shields.io/discord/748833935886254171.svg?label=&logo=discord&logoColor=ffffff&color=7389D8&labelColor=6A7EC2">
</p>
<p align="center">Tempo is a Discord music bot, written in TypeScript.</p>

### Installation

The easiest way to install Tempo locally is via Docker:
```yml
version: '3'
services:
    tempo:
        image: xeeon/tempo
        container_name: tempo
        environment:
            - YOUTUBE=YOUTUBE API TOKEN
            - SOUNDCLOUD=SOUNDCLOUD CLIENT ID
            - SPOTIFY_SECRET=SPOTIFY SECRET API TOKEN
            - SPOTIFY_ID=SPOTIFY SECRET API ID
            - GENIUS=GENIUS API KEY
            - DISCORD=DISCORD BOT TOKEN
            - OWNER=DISCORD OWNER ID
            - DATABASE_URL=POSTGRES DATABASE URL
```
You can also install Tempo using the following commands:
```
git clone https://github.com/guusvanmeerveld/tempo/ tempo
cd tempo
npm install
npm run build
```

### Tokens

To start the bot and connect to the Youtube or Soundcloud api, you will need a few tokens in the file `.env`. To do so, you can rename the file [`example.env`](example.env) to `.env` and fill in the necessary tokens/id's.

### Start

To start the bot, simply run the following command:

```
npm start
```

### Configuration

For a more specific installation, please check the `config` folder and update the files to your needs.
