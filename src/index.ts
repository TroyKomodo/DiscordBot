import Discord from 'discord.js';
import logger from './logger';
import config from './config';
import CommandManager from './command';

const client = new Discord.Client();
const commandManager = new CommandManager(client);

client.on('ready', () => {
    logger.info("Bot started :)");
});

client.login(config.discord.token);
