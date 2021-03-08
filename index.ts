import fs from 'fs';
if (!fs.existsSync('./node_modules/')) {
	console.log('Could not find node_modules, did you remember to run npm install?');
	process.exit();
}

require('dotenv').config();

import Manager from './src/manager';
import Console from './src/utils/console';
import WebServer from './src/web';

if (!fs.existsSync('./database/')) {
	Console.info('Could not find database folder, creating one...');
	fs.mkdirSync('./database');
}

const manager = new Manager();
manager.start();

const port = parseInt(process.env.PORT ?? '80');

const web = new WebServer();
web.start(port);
