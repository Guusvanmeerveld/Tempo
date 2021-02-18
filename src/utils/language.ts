const { language } = require(process.cwd() + "/src/config/settings.json");
export default require(`${process.cwd()}/src/config/lang/${language}.json`);
