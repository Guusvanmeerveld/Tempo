require('dotenv').config();
if (process.env.NODE_ENV !== 'production') console.clear();

const discordToken = process.env.DISCORD;
import Events from './events';

import Bot from './bot';

const bot = new Bot();

bot.start(discordToken);

const events = new Events(bot);

bot.on('message', (msg) => events.message(msg));
bot.on('guildCreate', (guild) => events.guildJoin(guild));
bot.on('error', (err) => events.error(err));
