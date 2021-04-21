import { Client, Collection } from 'discord.js-light';
import WebSocket from 'ws';

import { Command } from '@models/command';
import { QueueList } from '@models/queue';
import Console from '@utils/console';
import Settings from '@utils/settings';
import Locales from '@utils/locales';

import * as commands from './commands';

import Request from '@utils/requests/';

import Socket from './socket';

export default class Bot extends Client {
	public settings: Settings;
	public commands: Collection<string, Command>;
	public queues: Collection<string, QueueList>;
	public locales: Locales;

	public socket?: WebSocket;

	public request = new Request();

	constructor() {
		super({
			cacheGuilds: true,
			cacheChannels: false,
			cacheOverwrites: false,
			cacheRoles: true,
			cacheEmojis: false,
			cachePresences: false,
		});

		if (process.env.WEBSOCKET_URL) this.socket = new Socket(this);
		this.settings = new Settings();
		this.locales = new Locales(this);

		this.commands = new Collection();
		this.queues = new Collection();

		Object.values(commands).forEach((Command) => {
			this.commands.set(Command.name.toLocaleLowerCase(), new Command(this));
		});
	}

	public start(token?: string): void {
		console.time('connect-discord');
		Console.info('Starting the bot');

		this.on('ready', () => {
			if (!this.user) return;
			const lang = this.locales.getFromLocale('en-US');
			const activity = lang.bot.activity.name.replace('{username}', this.user.username);

			this.user.setActivity(activity, {
				type: lang.bot.activity.type,
			});
		});

		this.login(token)
			.then(() => Console.success('Connected with Discord!'))
			.catch(() => Console.error('Failed to connect with Discord!'))
			.finally(() => console.timeEnd('connect-discord'));
	}
}
