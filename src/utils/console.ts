import chalk from 'chalk';

class Console {
	private static log(type: string, msg: string) {
		const time = new Date().toLocaleTimeString();

		console.log(`${chalk.gray(`[${time}]`)} ${type} ${msg}`);
	}

	public static success(msg: string) {
		this.log(chalk.green('[SUCCESS]'), msg);
	}

	public static error(msg: string) {
		this.log(chalk.red('[ERROR]'), msg);
	}

	public static info(msg: string) {
		this.log(chalk.yellow('[INFO]'), msg);
	}
}

export default Console;
