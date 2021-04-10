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
	Lyrics,
	Resume,
	Pause,
	Loop,
	PlayList,
	NowPlaying,
} from './commands';

import SettingsInterface from './utils/settings';

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
		this.commands.set('resume', new Resume());
		this.commands.set('pause', new Pause());
		this.commands.set('invite', new Invite());
		this.commands.set('settings', new Settings());
		this.commands.set('playskip', new PlaySkip());
		this.commands.set('lyrics', new Lyrics());
		this.commands.set('loop', new Loop());
		this.commands.set('playlist', new PlayList());
		this.commands.set('nowplaying', new NowPlaying());
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
