import { Command } from "../../Structures/Command.js";
import { MessageEmbed, ColorResolvable, Constants } from "discord.js";

export default new Command({
  name: "embed",
  description: "Send your message as a pretty embed.",
  usage:
    "embed <color> | <image_url (use {{guild}} for guild icon and {{user}} for user icon)> | <title> | <description> | <footer> | <timestamp? true or false>",
  cooldown: 5,
  ownerOnly: false,
  adminOnly: false,
  permissions: ["MANAGE_MESSAGES"],
  category: "utilities",
  run: async (client, message, args) => {
    const content = args.join(" ");
    const splittedContent = content.split(" | ");
    const color = splittedContent[0],
      title = splittedContent[2],
      description = splittedContent[3],
      footer = splittedContent[4],
      timestamp = splittedContent[5];

    let imageUrl = splittedContent[1];

    if (!content.includes(" | ")) {
      message.reply(
        "**Invalid usage!** Please include ` | ` between each argument next time."
      );
      return;
    }

    if (
      !color ||
      !imageUrl ||
      !title ||
      !description ||
      !footer ||
      !timestamp
    ) {
      message.reply(
        "You are missing some arguments, please refer to the command's usage."
      );
      return;
    }

    if (!["true", "false"].includes(timestamp!)) {
      message.reply("Timestamp argument must be either `true` or `false`.");
      return;
    }

    if (!isValidColor(color!)) {
      message.reply(
        `Invalid color format, please refer to one of these colors:\n${Object.keys(
          Constants.Colors
        ).join(", ")}`
      );
      return;
    }

    if (imageUrl === "{{guild}}")
      imageUrl = message.guild?.iconURL({ format: "png" })!;

    if (imageUrl === "{{user}}")
      imageUrl = message.member?.user.avatarURL({ format: "png" })!;

    const embed = new MessageEmbed()
      .setColor(color as ColorResolvable)
      .setThumbnail(imageUrl!)
      .setTitle(title!)
      .setDescription(description!)
      .setFooter({ text: footer!, iconURL: imageUrl });

    if (timestamp === "true") embed.setTimestamp();

    message.channel.send({ embeds: [embed] });
  },
});

const isValidColor = (color: string) => {
  const validColors = Object.keys(Constants.Colors);
  return validColors.includes(color);
};
