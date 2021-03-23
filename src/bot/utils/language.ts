const { language } = require(process.cwd() + '//src/bot/config/settings.json');
export default require(`${process.cwd()}//src/bot/config/lang/${language}.json`);
