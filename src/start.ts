console.clear();
// process.env.NODE_ENV = "development";

const { discordToken } = require(process.cwd() + "/src/config/tokens.json");
import { handleGuildJoin, HandleMessage } from "./events";

import Bot from "./bot";

let message = new HandleMessage();

const bot = new Bot();

bot.start(discordToken);

bot.on("message", (msg) => message.handle(msg, bot));
bot.on("guildCreate", (guild) => handleGuildJoin(guild));
