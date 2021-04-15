import { ShardingManager } from 'discord.js-light';

import Console from '@utils/console';

const discordToken = process.env.DISCORD;

export default class Manager {
	private manager: ShardingManager;
	constructor() {
		this.manager = new ShardingManager('./dist/start.js', {
			token: discordToken,
			execArgv: ['-r', 'tsconfig-paths/register', '-r', 'ts-node/register/transpile-only'],
		});
	}

	public start(): void {
		this.manager.on('shardCreate', (shard) => Console.info(`Launched shard ${shard.id}`));

		this.manager.spawn();
	}
}
