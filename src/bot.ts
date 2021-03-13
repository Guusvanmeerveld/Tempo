import { Client, Collection } from 'discord.js-light';
import { QueueList, Command } from './models';
import Console from './utils/console';
import lang from './utils/language';

import {
	Disconnect,
	Help,
	Join,
	Play,
	Ping,
	Volume,
	Uptime,
	Skip,
	Queue,
	Stop,
	Invite,
	Settings,
	PlaySkip,
} from './commands';

import SettingsInterface from './utils/settings';

export default class Bot extends Client {
	public settings: SettingsInterface;
	public commands: Collection<string, Command>;
	public queues: Collection<string, QueueList>;

	constructor() {
		super({
			cacheGuilds: true,
			cacheChannels: false,
			cacheOverwrites: false,
			cacheRoles: true,
			cacheEmojis: false,
			cachePresences: false,
		});

		this.settings = new SettingsInterface();

		this.commands = new Collection();
		this.queues = new Collection();

		this.commands.set('help', new Help());
		this.commands.set('join', new Join());
		this.commands.set('disconnect', new Disconnect());
		this.commands.set('play', new Play());
		this.commands.set('ping', new Ping());
		this.commands.set('volume', new Volume());
		this.commands.set('uptime', new Uptime());
		this.commands.set('skip', new Skip());
		this.commands.set('queue', new Queue());
		this.commands.set('stop', new Stop());
		this.commands.set('invite', new Invite());
		this.commands.set('settings', new Settings());
		this.commands.set('playskip', new PlaySkip());
	}

	public start(token?: string): void {
		console.time();
		Console.info('Starting the bot');

		this.on('ready', () => {
			this.user!.setActivity(lang.bot.activity.text ?? '', {
				type: lang.bot.activity.type ?? 'PLAYING',
			});
		});

		this.login(token)
			.then(() => Console.success('Connected with Discord!'))
			.catch(() => Console.error('Failed to connect with Discord!'))
			.finally(console.timeEnd);
	}
}
