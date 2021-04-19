import Locale, { localeString } from '@models/locales';
import Bot from 'bot';
import { Guild } from 'discord.js';

export default class LocaleService {
	client;
	constructor(client: Bot) {
		this.client = client;
	}

	/**
	 * Retrieve a certain locale
	 * @param local - The local to get
	 */
	public getFromLocale(local: localeString): Locale {
		return require(`@config/locales/${local}`);
	}

	public get(guild: Guild | null): Locale {
		const settings = this.client.settings.get(guild?.id);

		return this.getFromLocale(settings.language);
	}
}
