const discordToken = process.env.DISCORD;

import { ShardingManager } from 'discord.js-light';
import Console from './bot/utils/console';

export default class Manager {
	private manager: ShardingManager;
	constructor() {
		this.manager = new ShardingManager('./dist/bot/index.js', {
			token: discordToken,
		});
	}

	public start(): void {
		this.manager.on('shardCreate', (shard) => Console.info(`Launched shard ${shard.id}`));

		this.manager.spawn();
	}
}
