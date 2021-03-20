console.clear();

import { config } from 'dotenv';

import { existsSync } from 'fs';
import Console from './src/utils/console';

if (existsSync('.env')) {
	config();
	Console.success('Found environmental variables in .env file!');
} else {
	Console.info('Could not locate .env file! Did you remember to create one?');
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
