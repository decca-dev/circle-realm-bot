import { Command } from "../../Structures/Command.js";
import pretty from "pretty-ms";
import { readdirSync } from "fs";
import { join } from "path";
import { __dirname } from "../../Utils/Constants.js";
import { MessageEmbed } from "discord.js";

interface Commands {
  category: string;
  commands: string[];
}

export default new Command({
  name: "help",
  description: "Check the available commands and get help with specific ones",
  usage: "help [command_name]",
  cooldown: 3,
  ownerOnly: false,
  adminOnly: false,
  permissions: [],
  category: "system",
  run: async (client, message, args) => {
    if (!args.length) {
      const commandCategories: string[] = [];
      readdirSync(join(__dirname, "..", "Commands")).forEach((dir) => {
        commandCategories.push(dir);
      });
      const commands: Commands[] = [];
      for (let category of commandCategories) {
        const categoryCommands = client.commands
          .filter((cmd) => cmd.category === category)
          .sort()
          .map((cmd) => `\`${cmd.name}\``);
        commands.push({ category: category, commands: categoryCommands });
      }
      const embed = new MessageEmbed()
        .setColor("RED")
        .setTitle("Commands")
        .setDescription(
          `Prefix: \`${process.env.PREFIX}\`\n**Want help with a specific command?** Simply run \`%help [command_name]\` (without the brackets)`
        );
      commands.forEach((cmd) => {
        embed.addField(
          cmd.category.charAt(0).toUpperCase() + cmd.category.slice(1),
          cmd.commands.join(", ")
        );
      });
      message.channel.send({ embeds: [embed] });
    } else {
      const commandName = args[0];
      const command = client.commands.get(commandName!);
      if (commandName && !command) {
        message.channel.send({
          embeds: [
            {
              color: "RED",
              title: "Command not found!",
              description: `Couldn't find a command with the name **${commandName}**`,
            },
          ],
        });

        return;
      }
      if (!command) return;
      if (command.ownerOnly && message.author.id !== process.env.OWNER_ID)
        return;
      message.channel.send({
        embeds: [
          {
            color: "RED",
            title: `Command | ${command.name}`,
            fields: [
              {
                name: "Description",
                value: command.description,
              },
              {
                name: "Usage",
                value: process.env.PREFIX + command.usage,
              },
              {
                name: "Permissions",
                value:
                  command.permissions.length > 0
                    ? command.permissions.join(", ")
                    : "None.",
              },
              {
                name: "Cooldown",
                value: pretty(command.cooldown * 1000),
              },
              {
                name: "Keys",
                value: "`<>` means **required**\n`[]` means **optional**",
              },
            ],
          },
        ],
      });
    }
  },
});
