const discordToken = process.env.DISCORD;

import { ShardingManager } from 'discord.js-light';
import Console from './utils/console';

export default class Manager {
	manager: ShardingManager;
	constructor() {
		this.manager = new ShardingManager('./dist/bot/src/start.js', {
			token: discordToken,
		});
	}

	public start() {
		this.manager.on('shardCreate', (shard) => Console.info(`Launched shard ${shard.id}`));

		this.manager.spawn();
	}
}
