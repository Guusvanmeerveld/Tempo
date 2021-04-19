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
	views?: number;
	likes?: number;
	dislikes?: number;
	download?: string;
	requested?: User;
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
