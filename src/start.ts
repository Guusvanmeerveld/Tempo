require('dotenv').config();
console.clear();

const discordToken = process.env.DISCORD;
import { handleError, handleGuildJoin, handleMessage } from './events';

import Bot from './bot';

const bot = new Bot();

bot.start(discordToken);

bot.on('message', (msg) => handleMessage(msg, bot));
bot.on('guildCreate', (guild) => handleGuildJoin(guild));
bot.on('rateLimit', (rateLimit) => handleError(rateLimit, bot));
bot.on('error', (error) => handleError(error, bot));
