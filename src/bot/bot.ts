import { Client, Collection } from 'discord.js-light';
import { QueueList, Command } from './models';
import Console from './utils/console';
import lang from './utils/language';

import SettingsInterface from './utils/settings';

import * as commands from './commands';

import Spotify from './utils/requests/spotify';
import Youtube from './utils/requests/youtube';
import SoundCloud from './utils/requests/soundcloud';

import WebSocket from 'ws';
import Socket from './socket';

export default class Bot extends Client {
	public settings: SettingsInterface;
	public commands: Collection<string, Command>;
	public queues: Collection<string, QueueList>;

	public socket: WebSocket;

	public request: {
		spotify: Spotify;
		youtube: Youtube;
		soundcloud: SoundCloud;
	};

	constructor() {
		super({
			cacheGuilds: true,
			cacheChannels: false,
			cacheOverwrites: false,
			cacheRoles: true,
			cacheEmojis: false,
			cachePresences: false,
		});

		this.socket = new Socket(this);

		this.request = {
			spotify: new Spotify(),
			youtube: new Youtube(),
			soundcloud: new SoundCloud(),
		};

		this.settings = new SettingsInterface();

		this.commands = new Collection();
		this.queues = new Collection();

		const commandArray = Object.values(commands);
		commandArray.forEach((Command) => {
			this.commands.set(Command.name.toLocaleLowerCase(), new Command(this));
		});
	}

	public start(token?: string): void {
		console.time('connect-discord');
		Console.info('Starting the bot');

		this.on('ready', () => {
			this.user!.setActivity(lang.bot.activity.text ?? '', {
				type: lang.bot.activity.type ?? 'PLAYING',
			});
		});

		this.login(token)
			.then(() => Console.success('Connected with Discord!'))
			.catch(() => Console.error('Failed to connect with Discord!'))
			.finally(() => console.timeEnd('connect-discord'));
	}
}
