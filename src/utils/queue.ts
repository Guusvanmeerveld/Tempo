import { Collection } from 'discord.js-light';

import { QueueList } from '@models/queue';
import { Song } from '@models/song';

export default class Queue extends Collection<string, QueueList> {
	/**
	 * Reset the queue for a certain guild id.
	 * @param id - The guild id of the guild that needs to be reset.
	 */
	public reset(id: string): void {
		this.set(id, { loop: false, songs: [] });
	}

	/**
	 * Initialize a queue for a certain guild id.
	 * Basically a reset that doesn't overwrite if a queue already exists.
	 * @param id - The guild id of the guild that needs initialization.
	 */
	public init(id: string): void {
		if (!this.has(id)) this.reset(id);
	}

	/**
	 * Add a song to the queue
	 * @param song - The song to add to the queue
	 * @param id - The id of the guild.
	 */
	public add(song: Song, id: string): void {
		const queue = this.get(id);

		queue?.songs.push(song);
	}

	/**
	 * Grab the first song from the queue and return it, removing that song from the queue.
	 * @param id - The id of the guild.
	 * @returns The first song that was removed from the queue.
	 */
	public shift(id: string): Song | void {
		if (!this.has(id)) this.init(id);
		const queue = this.get(id) as QueueList;

		if (queue.songs.length > 0) {
			const newSong = queue.songs.shift();
			queue.playing = newSong;

			return newSong;
		}

		return;
	}
}
