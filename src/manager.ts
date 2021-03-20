const discordToken = process.env.DISCORD;

import { ShardingManager } from 'discord.js-light';
import Console from './utils/console';
import WebSocket from 'ws';

export default class Manager {
	private manager: ShardingManager;
	constructor() {
		this.manager = new ShardingManager('./dist/src/start.js', {
			token: discordToken,
		});
	}

	public start() {
		this.manager.on('shardCreate', (shard) => Console.info(`Launched shard ${shard.id}`));

		this.manager.spawn();
	}

	public ws(ws: WebSocket, msg: any) {
		ws.ping();
	}
}
