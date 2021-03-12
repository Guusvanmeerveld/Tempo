const { language } = require(process.cwd() + '/bot/src/config/settings.json');
export default require(`${process.cwd()}/bot/src/config/lang/${language}.json`);
