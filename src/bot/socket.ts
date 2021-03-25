import WebSocket from 'ws';
import Bot from './bot';
import Console from './utils/console';

export interface WsMsgData {
	type: 'guilds';
	content: any;
}

interface Message {
	data: string;
	type: string;
	target: WebSocket;
}

export default class Socket extends WebSocket {
	client: Bot;

	constructor(client: Bot) {
		super(process.env.WEBSOCKET_URL!, {
			headers: {
				Authorization: process.env.DISCORD,
			},
		});

		this.client = client;

		this.addEventListener('error', (err) =>
			Console.error(`Failed to connected to local websocket server: ${JSON.stringify(err.message)}`)
		);

		this.addEventListener('open', () =>
			Console.success(`Successfully connected with ${process.env.WEBSOCKET_URL}!`)
		);

		this.addEventListener('close', () =>
			Console.error('Disconnected from local websocket server!')
		);

		this.addEventListener('message', this.handleMsg);
	}

	public msg(msg: WsMsgData) {
		this.send(JSON.stringify(msg));
	}

	private handleMsg(msg: Message) {
		const data: WsMsgData = JSON.parse(msg.data);
		const content = data.content;

		switch (data.type) {
			case 'guilds':
				this.fetchGuild(content)
					.then((guild) => this.msg({ content: guild, type: 'guilds' }))
					.catch((err) => this.msg({ content: err, type: 'guilds' }));

				break;
			default:
				break;
		}
	}

	private async fetchGuild(id: string) {
		return await this.client.guilds.fetch(id);
	}
}
