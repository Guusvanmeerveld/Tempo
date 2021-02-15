const { language } = require("../config/settings.json");
export default require(`../config/lang/${language}.json`);
