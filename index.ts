import fs from 'fs';
if (!fs.existsSync('./node_modules/')) {
	console.log(
		'Could not find node_modules, did you remember to run npm install?'
	);
	process.exit();
}

require('dotenv').config();

import Manager from './src/manager';
import Console from './src/utils/console';

if (!fs.existsSync('./database/')) {
	Console.info('Could not find database folder, creating one...');
	fs.mkdirSync('./database');
}

const manager = new Manager();
manager.start();
