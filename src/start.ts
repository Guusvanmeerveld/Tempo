import { config } from 'dotenv';
config();

// import { WSEventType } from 'discord.js-light';

import Events from './events';
import Bot from './bot';

if (process.env.NODE_ENV !== 'production') console.clear();

const discordToken = process.env.DISCORD;
const bot = new Bot();

bot.start(discordToken);

const events = new Events(bot);

bot.on('message', (msg) => events.message(msg));
bot.on('guildCreate', (guild) => events.guildJoin(guild));
bot.on('error', (err) => events.error(err));
bot.on('voiceStateUpdate', (oldState, newState) => events.voice(oldState, newState));

// bot.ws.on('INTERACTION_CREATE' as WSEventType, (interaction) => events.slash(interaction));
