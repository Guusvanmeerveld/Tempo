import { VoiceConnection } from 'discord.js-light';
import fs from 'fs';
import Console from './console';

const abs = ['K', 'M', 'B', 'T'];

/**
 * Chunk an array into a new array that contains arrays with a set size
 * @param array - The array to be chunked
 * @param size - The size of the contained arrays
 * @returns Result
 */
export function chunk(array: Array<any>, size: number): Array<Array<any>> {
	const chunked = [];

	for (let i = 0; i < array.length; i += size) {
		chunked.push(array.slice(i, i + size));
	}

	return chunked;
}

/**
 * Capitalize the first character in a string
 * @param string - The string to be used
 * @returns {string} Result
 */
export function ucFirst(string: string): string {
	return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

/**
 * Abbreviate a number down to a single number with a character
 * @param number
 */
export function abbreviate(number: number): string | number {
	for (let i = abs.length - 1; i >= 0; i--) {
		const zero = Math.pow(1000, i) * 1000;
		if (number >= zero) {
			return Math.floor(number / zero) + abs[i];
		}
	}

	return number;
}

/**
 * Remove every file from a given directory
 * @param path - The path to the folder te be removed
 */
export function emptyDir(path: string): void {
	if (fs.existsSync(path)) {
		const files = fs.readdirSync(path);

		if (files.length > 0) {
			files.forEach(function (filename) {
				if (fs.statSync(path + '/' + filename).isDirectory()) {
					emptyDir(path + '/' + filename);
				} else {
					fs.unlinkSync(path + '/' + filename);
				}
			});
		} else {
			Console.error('No files found in the directory.');
		}
	} else {
		Console.info(`Directory path "${path}" not found, creating one...`);
		fs.mkdirSync(path);
	}
}

/**
 * Give a duration formatted by YouTube and convert it to seconds.
 * Stolen from https://gist.github.com/jrtaylor-com/42883b0e28a45b8362e7
 * @param duration - The duration to convert
 * @returns The duration in ms
 */
export function ytDurationToMs(duration: string): number {
	let hours = 0;
	let minutes = 0;
	let seconds = 0;

	// Remove PT from string ref: https://developers.google.com/youtube/v3/docs/videos#contentDetails.duration
	duration = duration.replace('PT', '');

	if (duration.indexOf('H') > -1) {
		const hoursSplit = duration.split('H');

		hours = parseInt(hoursSplit[0]);
		duration = hoursSplit[1];
	}

	if (duration.indexOf('M') > -1) {
		const minutesSplit = duration.split('M');

		minutes = parseInt(minutesSplit[0]);
		duration = minutesSplit[1];
	}

	if (duration.indexOf('S') > -1) {
		const seconds_split = duration.split('S');

		seconds = parseInt(seconds_split[0]);
	}

	return (hours * 60 * 60 + minutes * 60 + seconds) * 1000;
}

interface ConnectionStatus {
	connected: boolean;
	connection?: VoiceConnection;
	error?: string;
}

/**
 * Check if there is a voice connection and if there is a stream playing in the voice connection.
 * @param connection The connection that needs to be checked
 */
export function checkConnection(connection?: VoiceConnection | null): ConnectionStatus {
	if (!connection) {
		return {
			connected: false,
			error: '❌  I am not connected to a voice channel.',
		};
	}

	const dispatcher = connection?.dispatcher;

	if (!dispatcher) {
		return { connected: false, error: '❌  There is nothing playing right now.' };
	}

	return { connected: true, connection };
}

export function secondsToTime(input: number): string {
	return new Date(input).toISOString().substr(11, 8);
}

/**
 * Enter a time in [hh:mm:ss] format and parse it to ms.
 * @param input The time to be parsed
 * @returns The time in ms
 */
export function parseTime(input: string): number {
	const splitted = input.split(':');

	const hours = parseInt(splitted[splitted.length - 3] ?? 0);
	const minutes = parseInt(splitted[splitted.length - 2] ?? 0);
	const seconds = parseInt(splitted[splitted.length - 1] ?? 0);

	if (minutes > 60 || seconds > 60 || hours < 0 || minutes < 0 || seconds < 0) return 0;

	const hourInSeconds = hours * 60 * 60;
	const minutesInSeconds = minutes * 60;

	return (hourInSeconds + minutesInSeconds + seconds) * 1000;
}
