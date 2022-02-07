import { User } from "../../Models/User.js";
import { Command } from "../../Structures/Command.js";
import { WebhookClient } from "discord.js";

/**
 * name          - Required
 * minecraft_IGN - Required
 * phone_number  - Optional
 */

export default new Command({
  name: "register",
  description: "Create an account for the Circle realm discord server",
  usage: "register <name> | <minecraft_IGN> | [phone_number]",
  cooldown: 10,
  ownerOnly: false,
  adminOnly: false,
  permissions: [],
  category: "auth",
  run: async (client, message, args) => {
    const userExists = await User.findOne({ discord_id: message.author.id });

    if (message.channelId === process.env.VERIFICATION_CHANNEL_ID) {
      if (!userExists) {
        if (!args.length) {
          message.reply(
            "You need to provide the valid arguments! Please refer to the command's usage."
          );
          return;
        }

        const content = args.join(" ");

        const [name, minecraft_IGN, phone_number] = content.split(" | ");

        if (!content.includes(" | ")) {
          message.reply(
            "**Invalid usage!** Please include ` | ` between each argument next time."
          );
          return;
        }

        if (!name || !minecraft_IGN) {
          message.reply("Missing **name** or **minecraft IGN**!");
          return;
        }

        const msg = await message.channel.send(
          "Sending credentials to approval channel..."
        );

        const webhook = new WebhookClient({
          url: process.env.APPROVAL_WEBHOOK,
        });
        webhook.send({
          embeds: [
            {
              color: "RED",
              title: "Approval request",
              description: `${message.member?.user.tag} has just registered with the following credentials:`,
              fields: [
                { name: "ID", value: message.author.id },
                { name: "Name", value: name },
                { name: "Minecraft IGN", value: minecraft_IGN },
                {
                  name: "Phone number",
                  value:
                    typeof phone_number !== "undefined"
                      ? phone_number
                      : "Not provided",
                },
              ],
              footer: {
                text: "Refer to the approval guide",
                icon_url: message.guild?.iconURL()!,
              },
              timestamp: Date.now(),
            },
          ],
        });

        await msg.edit(
          ":thumbsup: Credentials were sent successfully! I will DM you whenever a moderator approves/denies your verification request, please make sure your DMs are turned on."
        );
      } else {
        message.reply("You have already registered!");
        return;
      }
    } else {
      message.reply(
        "This command can only be ran in the verification channel!"
      );
      return;
    }
  },
});
