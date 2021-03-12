<p align="center"><img src="src/img/logo-banner.png" width="400"></p>

<p align="center">
<img src="https://img.shields.io/website-up-down-green-red/https/tempo.g-vm.nl.svg">
<img src="https://img.shields.io/github/license/Guusvanmeerveld/Tempo-TS.svg">
<img src="https://img.shields.io/github/release/Guusvanmeerveld/Tempo-TS.svg">
<img src="https://img.shields.io/discord/748833935886254171.svg?label=&logo=discord&logoColor=ffffff&color=7389D8&labelColor=6A7EC2">
</p>
<p align="center">Tempo is a Discord music bot, written in TypeScript.</p>

### Installation

In order to compile the TypeScript to Javascript, you will need to have TypeScript installed. You can install it using the following command:

```
npm i -g typescript
```

Then, install Tempo using the following commands:

```
git clone https://github.com/guusvanmeerveld/tempo-ts/
cd tempo-ts
npm install --production
npm run build
```

### Tokens

To start the bot and connect to the Youtube or Soundcloud api, you will need a few tokens in the file `.env`. To do so, you can rename the file [`example.env`](example.env) to `.env` and fill in the necessary tokens/id's.

### Start

To start the bot, simply run the following command:

```
npm run bot
```

### Configuration

For a more specific installation, please check the `src/config` folder and update the files to your needs.
