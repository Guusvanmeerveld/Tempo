console.clear();
process.env.NODE_ENV = "development";

const { discordToken } = require("./config/tokens.json");
import { handleGuildJoin, HandleMessage } from "./events";

let message = new HandleMessage();

import Bot from "./bot";

const bot = new Bot();

bot.start(discordToken);

bot.on("message", (msg) => message.handle(msg));
bot.on("guildCreate", (guild) => handleGuildJoin(guild));
