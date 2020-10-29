import CommandManager, { Command, CommandTrigger } from '../command';
import Discord from 'discord.js';
import config from '../config';

class Avatar extends Command {
    constructor(manager: CommandManager) {
        super(manager, {
            name: "Avatar",
            description: "Shows a user's avatar.",
            usage: `${config.discord.prefix}avatar (mention)`,
            help: "Shows the mentioned user's avatar or if no user is mentioned shows the author's avatar."
        }, "avatar", false, false, []);
    }
    async run(trigger: CommandTrigger) {
        let member = trigger.message.mentions.users.first() || trigger.message.author

        let avatar = member.displayAvatarURL({ size: 1024 })


        let embed = new Discord.MessageEmbed()
            .setTitle(`${ member.username }'s avatar`)
            .setImage(avatar)
            .setColor("RANDOM");

        await trigger.message.channel.send(embed);
    }
}

export default Avatar;