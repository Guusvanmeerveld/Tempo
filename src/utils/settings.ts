import { GuildManager, Collection, Guild } from "discord.js";

const credentials = require(process.cwd() + "/src/config/mysql.json");

import mysql, { Connection } from "mysql";

export default class Settings {
  //   public guilds: Collection<string, Guild>;
  private connection: Connection;
  constructor(guilds: GuildManager) {
    this.connection = mysql.createConnection(credentials);

    // this.connection.connect();

    // console.log(guilds.);

    // this.connection.end();
  }
}
