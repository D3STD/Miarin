import { Bot } from'./dist/client/Client.js';
import config from './config.json';

( async () => {
	global.bot = await new Bot( {
		mongo: process.env.MONGO,
		token: process.env.TOKEN,
		config
	} ).init();
} )();