import CommandManager, { Command, CommandTrigger } from '../command';
import Discord from 'discord.js';
import config from '../config';

class Help extends Command {
    constructor(manager: CommandManager) {
        super(manager, {
            name: "Help",
            description: "Displays help infomation for a given command.",
            usage: `${config.discord.prefix}help (command)`,
            help: `Shows the help infomation for a given command.`
        }, "help", false, false, []);
    }
    async run(trigger: CommandTrigger) {
        let key = trigger.args[0] || "help";
        let command = this.manager.commands.get(key.toLowerCase())

        if (!command) {
            await trigger.message.channel.send(`No command found with the name '${command}'`);
            return;
        }

        if (!command.description.help || !command.description.usage) {
            await trigger.message.channel.send(`No help found for the '${command}' command.`);
            return;
        }

        let embed = new Discord.MessageEmbed()
            .setTitle(`Help for ${command.trigger}`)
            .setColor("RANDOM");

        if (command.description.help) {
            embed.setDescription(command.description.help);
        }
        if (command.description.usage) {
            embed.addField("Usage", command.description.usage);
        }

        await trigger.message.channel.send(embed);
    }
}

export default Help;