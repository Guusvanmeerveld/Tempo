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
export function ucFirst(string: string) {
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
		fs.mkdir(path, () => {});
	}
}

/**
 * Give a duration formatted by YouTube and convert it to seconds.
 * Stolen from https://gist.github.com/jrtaylor-com/42883b0e28a45b8362e7
 * @param duration - The duration to convert
 * @returns The duration in seconds
 */
export function ytDurationToMs(duration: string): number {
	let hours = 0;
	let minutes = 0;
	let seconds = 0;

	// Remove PT from string ref: https://developers.google.com/youtube/v3/docs/videos#contentDetails.duration
	duration = duration.replace('PT', '');

	// If the string contains hours parse it and remove it from our duration string
	if (duration.indexOf('H') > -1) {
		const hours_split = duration.split('H');
		hours = parseInt(hours_split[0]);
		duration = hours_split[1];
	}

	// If the string contains minutes parse it and remove it from our duration string
	if (duration.indexOf('M') > -1) {
		const minutes_split = duration.split('M');
		minutes = parseInt(minutes_split[0]);
		duration = minutes_split[1];
	}

	// If the string contains seconds parse it and remove it from our duration string
	if (duration.indexOf('S') > -1) {
		const seconds_split = duration.split('S');
		seconds = parseInt(seconds_split[0]);
	}

	// Math the values to return seconds
	return (hours * 60 * 60 + minutes * 60 + seconds) * 1000;
}
