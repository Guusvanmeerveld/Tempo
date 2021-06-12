<p align="center"><img src="src/img/logo-banner.png" width="400"></p>

<p align="center">
<img src="https://img.shields.io/website-up-down-green-red/https/tempo.g-vm.nl.svg">
<img src="https://img.shields.io/github/license/Guusvanmeerveld/Tempo-TS.svg">
<a href="https://github.com/Guusvanmeerveld/Tempo/actions/workflows/integrate.yml"><img src="https://github.com/Guusvanmeerveld/Tempo/actions/workflows/integrate.yml/badge.svg"></a>
<img src="https://img.shields.io/discord/748833935886254171.svg?label=&logo=discord&logoColor=ffffff&color=7389D8&labelColor=6A7EC2">
</p>
<p align="center">Tempo is a Discord music bot, written in TypeScript.</p>

# Installation

## Docker
Using a docker-compose.yml:
```yml
version: '3'
services:
  tempo:
    depends_on: [db]
    image: guusvanmeerveld/tempo
    container_name: tempo
    environment:
      # Optional tokens, function will be disabled if token isn't provided
      YOUTUBE: YOUTUBE API TOKEN
      SOUNDCLOUD: SOUNDCLOUD CLIENT ID
      SPOTIFY_SECRET: SPOTIFY SECRET API TOKEN
      SPOTIFY_ID: SPOTIFY SECRET API ID
      GENIUS: GENIUS API KEY

      # Required token
      DISCORD: DISCORD BOT TOKEN

      # Required if you want errors to be sent to you
      OWNER: DISCORD OWNER ID

      # You can use your own database url if you already have one running
      DATABASE_URL: 'postgresql://tempo:tempo@tempo-db:5432/tempo'
  db:
    image: postgres
    container_name: tempo-db
    restart: always
    volumes:
      - data:/var/lib/postgresql/data
    environment:
      PGDATA: /var/lib/postgresql/data/pgdata
      POSTGRES_PASSWORD: tempo
      POSTGRES_USER: tempo
      POSTGRES_DB: tempo

volumes:
  data:
```

## Node.js & NPM
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
