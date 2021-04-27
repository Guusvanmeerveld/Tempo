import { User } from 'discord.js-light';

export type Platform = 'soundcloud' | 'youtube' | 'spotify' | 'audio';

export interface Song {
	platform: Platform;
	title: string;
	author: string;
	image: string;
	date: Date;
	url: string;
	length: number;
	started?: number;
	stats: {
		views?: number;
		likes?: number;
		dislikes?: number;
	};
	requested?: User;
}

export interface SoundCloudSong extends Song {
	download: string;
	downloadable: boolean;
}

export interface Album {
	date: Date;
	image: string;
	name: string;
	author: string[];
	platform: 'spotify' | 'youtube';
	url: string;
	genres?: string[];
	songs: Song[];
}
