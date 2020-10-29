import Discord from 'discord.js';
import logger from './logger';
import config from './config';

export class CommandUnimplemented extends Error {}
export class CommandNoPermission extends Error { }

type permssion = Discord.BitFieldResolvable < Discord.PermissionString >;
interface CommandDescription {
    name?: string;
    description?: string;
    usage?: string;
    help?: string;
}

export class Command {
    manager: CommandManager;
    description: CommandDescription;
    trigger: string;
    caseSensitive: boolean;
    whisperable: boolean;
    permissions: (permssion | permssion[])[]; //you want them to have x and y than ["x", "y"] if you want them to have x or y [["x", "y"]]

    constructor(manager: CommandManager, description: CommandDescription, trigger: string, caseSensitive: boolean, whisperable: boolean, permissions: (permssion | permssion[])[]) {
        this.manager = manager;
        this.description = description;
        this.trigger = trigger;
        this.caseSensitive = caseSensitive;
        this.whisperable = whisperable;
        this.permissions = permissions;
    }

    async run(trigger: CommandTrigger) {
        throw new CommandUnimplemented();
    }
}

export interface CommandTrigger {
    message: Discord.Message;
    args: string[];
}

import commands from './commands';

class CommandManager {
    
    client: Discord.Client;
    commands: Map<string, Command>;

    constructor(client: Discord.Client) {
        this.client = client;
        this.commands = new Map<string, Command>();
        Object.values(commands).forEach(m => {
            this.registerCommand(new m(this));
        });
        client.on('message', (msg : Discord.Message) => {
            this.triggerCommand(msg)
        });
    }

    registerCommand(cmd: Command) {
        let trigger = cmd.trigger.toLowerCase();
        if (this.commands.has(trigger)) {
            logger.warn(`Duplicate command registeration '${trigger}'.`)
        }
        this.commands.set(trigger, cmd);
    }

    async triggerCommand(msg: Discord.Message) {
        if (!msg.content.startsWith(config.discord.prefix)) {
            return;
        }

        let parts = msg.content.split(" ");
        let key = parts[0].substring(1);
        let command = this.commands.get(key.toLowerCase());
        if (!command) return;

        if (command.caseSensitive && command.trigger !== key) return;

        if (msg.member === null && !command.whisperable) {
            return;
        }

        if (!config.owners.includes(msg.author.id)) {
            for (let i = 0; i < command.permissions.length; i++) {
                if (msg.member === null) {
                    return;
                }
                let perm = command.permissions[i]
                if (typeof perm === "string") {
                    if (!msg.member.hasPermission(perm)) {
                        throw new CommandNoPermission();
                    }
                } else {
                    perm = perm as Discord.BitFieldResolvable<Discord.PermissionString>[]
                    let valid = false;
                    for (let n = 0; n < perm.length; n++) {
                        if (msg.member.hasPermission(perm)) {
                            valid = true;
                            break;
                        }
                    }
                    if (!valid) {
                        throw new CommandNoPermission();
                    }
                }
            }
        } 

        await command.run({
            args: parts.slice(1),
            message: msg,
        })
    }
}

export default CommandManager;
