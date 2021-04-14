import { Song } from './song';

export interface QueueList {
	songs: Array<Song>;
	loop: boolean;
	playing?: Song;
}
