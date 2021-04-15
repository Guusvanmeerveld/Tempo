import { Collection } from 'discord.js-light';

import settings from '@config/settings.json';

import { GuildSettings, Setting } from '@models/index';
import Console from './console';
import { isEqual } from 'lodash';

import { Database, RawDBData } from './database';

export default class Settings {
	private guilds: Collection<string, GuildSettings>;
	private db: Database;

	constructor() {
		this.db = new Database();
		this.guilds = new Collection();

		this.db.get().then((guilds) => {
			guilds.forEach((guild: RawDBData) => {
				this.guilds.set(guild.id ?? '', guild.settings);
			});

			Console.success('Retrieved data from database!');
		});
	}

	get(id: string, setting: Setting): number | string;
	get(id: string): GuildSettings;

	/**
	 * Get the current settings for a certain guild, or get a specific guild settings value
	 * @param id - The guild id
	 * @param setting - [Optional] The setting to retrieve
	 */
	public get(id: string, setting?: Setting) {
		if (this.guilds.has(id)) {
			return this.guilds.get(id)!;
		}

		return setting ? settings[setting] : settings;
	}

	/**
	 * Set a setting for a specific guild
	 * @param id - The guild id
	 * @param setting - The setting to set
	 * @param value - The new value of the setting
	 */
	public set(id: string, setting: Setting, value: string | number) {
		const currentSettings = this.get(id);
		const newSettings: GuildSettings = {
			...currentSettings,
			[setting]: value,
		};

		if (isEqual(newSettings, settings)) {
			this.guilds.delete(id);
			this.db.delete(id);
		} else {
			this.guilds.set(id, newSettings);
			this.db.set(id, newSettings);
		}
	}
}

export class DefaultSettings {}
