import { Command } from "../../Structures/Command.js";
import { BaseGuildTextChannel, MessageEmbed } from "discord.js";
import {
  createParty,
  deleteParty,
  joinParty,
  leaveParty,
  inviteToParty,
  getParties,
  findUserParty,
  getParty,
} from "../../Lib/Party/System.js";

export default new Command({
  name: "party",
  description: "Create, join, and see other people's parties.",
  usage:
    "party list | party invite <user_id> | party join <party_id> | party leave | party create <name> | party delete",
  cooldown: 3,
  ownerOnly: false,
  adminOnly: false,
  permissions: [],
  category: "party",
  run: async (client, message, args) => {
    const threadChannel = client.channels.cache.get(
      process.env.THREAD_CHANNEL
    ) as BaseGuildTextChannel;

    const validArgs = [
      "list",
      "invite",
      "join",
      "leave",
      "create",
      "delete",
      "info",
    ] as const;
    const subcommand: typeof validArgs[number] =
      args[0] as typeof validArgs[number];

    if (!validArgs.includes(subcommand!)) {
      message.reply(`Invalid arguments! Please refer to the command's usage.`);
      return;
    }

    switch (subcommand) {
      case "list":
        const parties = await getParties();
        const embed = new MessageEmbed()
          .setColor("RED")
          .setTitle("Active Parties")
          .setDescription(
            `There are ${parties.length} active parties right now`
          );

        if (parties.length > 0) {
          parties.forEach((party) => {
            embed.addField(
              party?.name!,
              `**Players**: ${party?.players.length}\n**ID**: ${party?.party_id}\n**Owner ID**: ${party?.owner}`,
              true
            );
          });
        } else {
          embed.addField(
            "It's quiet...for now",
            "There aren't any active parties yet, you can create your own by running `%party create <name>`"
          );
        }

        message.channel.send({ embeds: [embed] });
        break;
      case "create":
        const userAlreadyInParty = await findUserParty(message.author.id);
        if (userAlreadyInParty) {
          message.reply("You are already in a party!");
          return;
        }
        const partyName = args.splice(1).join(" ");
        if (!partyName || partyName === "") {
          message.reply("You need to provide a name for your party!");
          return;
        }
        const thread = await threadChannel.threads.create({
          name: partyName,
          reason: "why not",
        });
        await thread.members.add(message.member?.user.id!);
        const party = await createParty({
          name: partyName,
          owner: message.author.id,
          thread_id: thread.id,
          players: [message.author.id],
        });
        message.reply(
          `Your party was created! Head over to <#${party?.thread_id}> to see your party thread!`
        );
        break;
      case "delete":
        const userParty = await findUserParty(message.author.id);
        if (!userParty) {
          message.reply("You do not belong to any party!");
          return;
        }
        if (userParty.owner !== message.author.id) {
          message.reply("You are not the owner of the party that you are in!");
          return;
        }
        try {
          const partyThread = threadChannel.threads.cache.get(
            userParty.thread_id
          );
          partyThread?.setArchived(true);
          await deleteParty(userParty.party_id);
          message.reply("Deleted your party and archived the thread!");
        } catch (error) {
          message.reply(`An error occured!\n${(error as Error).message}`);
          return;
        }
        break;
      case "join":
        const partyToJoin = args.splice(1)[0];
        if (!partyToJoin || partyToJoin === "") {
          message.reply(
            "You need to provide the id of the party that you wish to join!"
          );
          return;
        }
        joinParty(message.member!, partyToJoin!)
          .then(async (party) => {
            const threadToJoin = threadChannel.threads.cache.get(
              party?.thread_id!
            );
            await threadToJoin?.members.add(message.member?.user.id!);
            message.reply(
              `You have joined **${
                party!.name
              }**! You can find the party thread at <#${party?.thread_id}>`
            );
          })
          .catch((err: Error) => {
            message.reply(`An error has occured!\n${err.message}`);
          });
        break;
      case "leave":
        leaveParty(message.member!)
          .then(async (party) => {
            const threadToLeave = threadChannel.threads.cache.get(
              party?.thread_id!
            );
            await threadToLeave?.members.remove(message.member?.user.id!);
            message.reply(`You have left **${party!.name}**!`);
          })
          .catch((err: Error) => {
            message.reply(`An error has occured!\n${err.message}`);
          });
        break;
      case "invite":
        const partyToInviteTo = await findUserParty(message.member?.user.id!);
        const userToInvite = args.splice(1)[0];
        if (!userToInvite || userToInvite === "") {
          message.reply(
            "You need to provide the id of the member that you wish to invite!"
          );
          return;
        }
        if (!partyToInviteTo) {
          message.reply(
            "You are not a member of any party! You can't invite others."
          );
        }
        inviteToParty(userToInvite, message.member!, partyToInviteTo!.party_id)
          .then(() => {
            message.reply("Done!");
          })
          .catch((err: Error) => {
            message.reply(`An error has occured!\n${err.message}`);
          });
        break;
      case "info":
        const partyIDToShow = args.splice(1)[0];
        if (!partyIDToShow || partyIDToShow === "") {
          message.reply("You need to provide the id of a party!");
          return;
        }
        const partyToShow = await getParty(partyIDToShow);
        if (!partyToShow) {
          message.reply(`Party with id **${partyIDToShow}** doesn't exist!`);
          return;
        }
        const partyEmbed = new MessageEmbed()
          .setTitle(partyToShow.name)
          .setColor("RED")
          .setThumbnail(message.guild?.iconURL({})!)
          .addField(
            "Owner",
            message.guild?.members.cache.get(partyToShow.owner)?.user.tag!
          )
          .addField(
            "Players",
            `**Total**: ${
              partyToShow.players.length
            }\n**Players**: ${partyToShow.players
              .map(
                (player) =>
                  `${message.guild?.members.cache.get(player)?.user.tag}`
              )
              .join(", ")}`
          )
          .addField(
            "Created at",
            new Date(partyToShow.createdAt).toLocaleDateString("en-US")
          );

        message.channel.send({ embeds: [partyEmbed] });
        break;
    }
  },
});
