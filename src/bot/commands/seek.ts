import Bot from '../bot';
import { Command, Requirement } from 'bot/models';
import { Message } from 'discord.js-light';
import { checkConnection } from '../utils/functions';
import { Play } from './play';

export class Seek implements Command {
	name = 'seek';
	description = 'Skip to a certain part of the song that is currently playing';
	requirements: Requirement[] = ['VOICE', 'ROLE'];
	aliases = ['skipto'];
	usage = 'seek [hours:minutes:seconds]';

	client;
	constructor(client: Bot) {
		this.client = client;
	}

	run(msg: Message, args: Array<string>) {
		const { connected, error } = checkConnection(msg.guild?.voice?.connection);

		if (connected) {
			const time = args[0];

			if (time) {
				const queue = this.client.queues.get(msg.guild!.id);
				const song = queue?.playing!;

				const seconds = this.parseTime(time);

				if (seconds > song.length || seconds < 0) {
					msg.channel.send('❌  That is not a valid timestamp.');
					return;
				}

				// this.player.play(msg, client, song, seconds)
			} else {
				msg.channel.send('❌  You must give a timestamp to skip to.');
			}
		} else if (error) {
			msg.channel.send(error);
		}
	}

	/**
	 * Enter a time in [hh:mm:ss] format and parse it to seconds.
	 * @param input The time to be parsed
	 * @returns The time in seconds
	 */
	private parseTime(input: string): number {
		const splitted = input.split(':');

		let hours = parseInt(splitted[splitted.length - 3]) ?? null;
		let minutes = parseInt(splitted[splitted.length - 2]) ?? null;
		let seconds = parseInt(splitted[splitted.length - 1]) ?? null;

		let hourInSeconds = hours * 60 * 60;
		let minutesInSeconds = minutes * 60;

		return hourInSeconds + minutesInSeconds + seconds;
	}
}
