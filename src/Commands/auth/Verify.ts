import { Command } from "../../Structures/Command.js";
import { User } from "../../Models/User.js";
import { WebhookClient } from "discord.js";

export default new Command({
  name: "verify",
  description: "Verify the approval requests by accpeting or denying them.",
  usage: "verify approve <message_id> <reason> | deny <message_id> <reason>",
  cooldown: 5,
  ownerOnly: false,
  adminOnly: false,
  permissions: ["ADMINISTRATOR"],
  category: "auth",
  run: async (client, message, args) => {
    const validArgs = ["approve", "deny"];
    const method = args[0];

    if (!args.length) {
      message.reply(
        `You need to include on of these valid arguments:\n${validArgs
          .map((arg) => `\`${arg}\``)
          .join(", ")}`
      );
      return;
    }

    if (!validArgs.includes(method!)) {
      message.reply(
        `You need to include on of these valid arguments:\n${validArgs
          .map((arg) => `\`${arg}\``)
          .join(", ")}`
      );
      return;
    }

    const message_id = args[1];
    const reason = args.slice(2).join(" ");

    if (!message_id || !reason) {
      message.reply("You are missing the message ID argument or the reason!");
      return;
    }

    if (isNaN(Number(message_id))) {
      message.reply("Invalid message ID!");
      return;
    }

    const embed = await (
      await message.channel.messages.fetch(message_id!)
    ).embeds[0];

    if (!embed) {
      message.reply(
        "Couldn't find a message embed corresponding to that message ID."
      );
      return;
    }

    if (embed.title !== "Approval request") {
      message.reply(
        "You should only provide message IDs that have 'Approval request' in the title"
      );
      return;
    }

    const userID = embed.fields[0]?.value;
    const userNAME = embed.fields[1]?.value;
    const userMIGN = embed.fields[2]?.value;
    const userNUMBER = embed.fields[3]?.value;

    const userExists = await User.findOne({ discord_id: userID });

    if (userExists) {
      message.reply(
        "That user's verification request has already been approved by a moderator!"
      );
      return;
    }

    switch (method) {
      case "approve":
        const registeredUser = new User({
          discord_id: userID,
          name: userNAME,
          minecraft_IGN: userMIGN,
          phone_number: userNUMBER,
        });

        await registeredUser.save();
        const user = message.guild?.members.cache.get(userID!);
        user?.roles.add(process.env.VERIFIED_ROLE);
        const msg = await message.channel.send(
          "Operation was successful! DMing the user..."
        );
        try {
          user?.send({
            embeds: [
              {
                color: "GREEN",
                title: "Good news",
                description: `Your verification request has been **approved** by a moderator.\n**Reason**:${reason}\nWe hope that you have a fun time with all the other members!`,
                footer: { text: "The Circle Realm mod team" },
              },
            ],
          });
          await msg.edit("User was DMed!");
        } catch (error) {
          await msg.edit("Couldn't DM user!");
          const webhook = new WebhookClient({
            url: process.env.GENERAL_CHANNEL_HOOK,
          });
          webhook.send(
            `Hello <@!${user?.user.id}>! I couldn't DM you this but your verification request has been approved by a moderator\n**Reason**:${reason}\nWe hope that you have a fun time with all the other members!`
          );
        }
        break;

      case "deny":
        const Msg = await message.channel.send("DMing the user...");
        try {
          user?.send({
            embeds: [
              {
                color: "RED",
                title: "Bad news",
                description: `Your verification request has been **denied** by a moderator.\n**Reason**:${reason}`,
                footer: { text: "The Circle Realm mod team" },
              },
            ],
          });
          await Msg.edit("User was DMed! Time to kick them out");
          user?.kick(reason);
          await Msg.edit("Homie is no more :thumbsup:");
        } catch (error) {
          await Msg.edit("Couldn't DM user! Time to kick them out");
          user?.kick(reason);
          await Msg.edit("Homie is no more :thumbsup:");
        }
        break;
    }
  },
});
