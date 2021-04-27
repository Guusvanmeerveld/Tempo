import { CollectorFilter, Message, MessageReaction, User } from 'discord.js-light';

type ReactionCallback = (reaction: MessageReaction) => void;

export default class Reactions {
	emojis;
	constructor(emojis: Array<string>) {
		this.emojis = emojis;
	}

	/**
	 * Listen for a reaction on a certain message.
	 * @param {Message} msg The message to listen on the initialized reactions on.
	 * @param {ReactionCallBack} callback The callback that needs to run when a reaction is received.
	 */
	public listen(msg: Message, callback: ReactionCallback): void {
		this.emojis.forEach(async (emoji) => await msg.react(emoji));

		const controller = msg.createReactionCollector(this.reactionFilter);

		controller.on('collect', (reaction, user) => {
			reaction.users.remove(user).catch(console.log);

			callback(reaction);
		});
	}

	private reactionFilter: CollectorFilter = (reaction, user: User) =>
		this.emojis.includes(reaction.emoji.name) && !user.bot;
}
