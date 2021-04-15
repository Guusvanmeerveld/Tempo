console.clear();

import { config } from 'dotenv';
import { existsSync } from 'fs';

import Console from '@utils/console';

if (existsSync('.env')) {
	config();
	Console.success('Found environmental variables in .env file!');
} else {
	Console.info('Could not locate .env file! Did you remember to create one?');
}

import Manager from './manager';

const manager = new Manager();
manager.start();
