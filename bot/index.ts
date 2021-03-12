require('dotenv').config();

import Manager from './src/manager';

const manager = new Manager();
manager.start();
