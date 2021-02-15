const { discordToken } = require("./config/tokens.json");

import { ShardingManager } from "discord.js";

export default class Manager {
  manager: ShardingManager;
  constructor() {
    this.manager = new ShardingManager("./dist/src/start.js", {
      token: discordToken,
    });
  }

  public start() {
    this.manager.on("shardCreate", (shard) => console.log(`Launched shard ${shard.id}`));

    this.manager.spawn();
  }
}
