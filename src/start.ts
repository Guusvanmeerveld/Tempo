console.clear();
process.env.NODE_ENV = "development";

const { discordToken } = require("./config/tokens.json");
import { handleGuildJoin, HandleMessage } from "./events";

import Bot from "./bot";

let message = new HandleMessage();

const bot = new Bot();

bot.start(discordToken);

bot.on("message", (msg) => message.handle(msg));
bot.on("guildCreate", (guild) => handleGuildJoin(guild));
