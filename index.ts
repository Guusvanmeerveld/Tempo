import fs from 'fs';
if (!fs.existsSync('./node_modules/')) {
	console.log('Could not find node_modules, did you remember to run npm install?');
	process.exit();
}

require('dotenv').config();

import Manager from './src/manager';

const manager = new Manager();
manager.start();
