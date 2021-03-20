console.clear();

import { config } from 'dotenv';

import { existsSync } from 'fs';
import Console from './src/utils/console';

if (existsSync('.env')) {
	config();
	Console.success('Found environmental variables in .env file!');
} else {
	Console.error('Could not locate .env file! Did you remember to create one?');
	process.exit();
}

import Manager from './src/manager';
import WebServer from './src/web';

const manager = new Manager();

if (process.env.NODE_ENV === 'production') {
	manager.start();
}

const webserver = new WebServer();
webserver.start();

webserver.on('message', manager.ws);
