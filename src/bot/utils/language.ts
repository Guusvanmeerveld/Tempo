import { join } from 'path';
const path = process.cwd();

const config = join(path, '/src/bot/config');

const { language } = require(join(config, '/settings.json'));
export default require(join(config, `/lang/${language}.json`));
