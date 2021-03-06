require("dotenv").config();
console.clear();
// process.env.NODE_ENV = "development";

const discordToken = process.env.DISCORD as string;
import { handleGuildJoin, handleMessage } from "./events";

import Bot from "./bot";

const bot = new Bot();

bot.start(discordToken);

bot.on("message", (msg) => handleMessage(msg, bot));
bot.on("guildCreate", (guild) => handleGuildJoin(guild));
