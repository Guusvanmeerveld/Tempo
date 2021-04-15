import { Client, Collection } from 'discord.js-light';
import WebSocket from 'ws';

import { QueueList, Command } from './models';
import Console from '@utils/console';
import lang from '@utils/language';
import Settings from '@utils/settings';

import * as commands from './commands';

import Spotify from '@utils/requests/spotify';
import Youtube from '@utils/requests/youtube';
import SoundCloud from '@utils/requests/soundcloud';

import Socket from './socket';

export default class Bot extends Client {
	public settings: Settings;
	public commands: Collection<string, Command>;
	public queues: Collection<string, QueueList>;

	public socket?: WebSocket;

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

		if (process.env.WEBSOCKET_URL) this.socket = new Socket(this);
		this.settings = new Settings();

		this.request = {
			spotify: new Spotify(),
			youtube: new Youtube(),
			soundcloud: new SoundCloud(),
		};

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

			this.user.setActivity(lang.bot.activity.text ?? '', {
				type: 'LISTENING',
			});
		});

		this.login(token)
			.then(() => Console.success('Connected with Discord!'))
			.catch(() => Console.error('Failed to connect with Discord!'))
			.finally(() => console.timeEnd('connect-discord'));
	}
}
