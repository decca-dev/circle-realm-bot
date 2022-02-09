import { Command } from "../../Structures/Command.js";
import {
  GuildBasedChannel,
  GuildEmoji,
  GuildMember,
  Role,
  Collection,
} from "discord.js";
import pretty from "pretty-ms";

interface GuildData {
  name: string;
  createdAt: number;
  icon: string;
  owner: string;
  memberCount: number;
  channels: Collection<string, GuildBasedChannel>;
  roles: Collection<string, Role>;
  emojis: Collection<string, GuildEmoji>;
  members: Collection<string, GuildMember>;
}

interface BotData {
  name: string;
  createdAt: number;
  avatar: string;
  owner: string;
  users: number;
  channels: number;
  uptime: string;
  platform: string;
}

interface UserData {
  tag: string;
  id: string;
  createdAt: number;
  avatar: string;
  joinedAt: number;
  roles: Collection<string, Role>;
}

export default new Command({
  name: "info",
  description: "Returns general info about the server, users, bot, etc...",
  usage: "info <guild | bot | user @User/user_id>",
  cooldown: 10,
  ownerOnly: false,
  adminOnly: false,
  permissions: [],
  category: "utilities",
  run: async (client, message, args) => {
    const validArgs = ["guild", "bot", "user"];
    if (!args[0]) {
      message.reply(
        `**Invalid argument!** Please use one of these arguments next time:\n${validArgs
          .map((arg) => `${arg}`)
          .join(", ")}`
      );
      return;
    }
    switch (args[0]) {
      case "guild":
        const guild: GuildData = {
          name: message.guild?.name!,
          createdAt: message.guild?.createdTimestamp!,
          icon: message.guild?.iconURL({ dynamic: true })!,
          owner: `<@!${message.guild?.ownerId}>`,
          memberCount: message.guild?.memberCount!,
          channels: message.guild?.channels.cache!,
          roles: message.guild?.roles.cache.filter(
            (role) => role.name !== "@everyone"
          )!,
          emojis: message.guild?.emojis.cache!,
          members: message.guild?.members.cache!,
        };

        message.channel.send({
          embeds: [
            {
              title: guild.name,
              color: "RED",
              //@ts-ignore
              thumbnail: guild.icon,
              fields: [
                { name: "Guild Owner", value: guild.owner, inline: false },
                {
                  name: "Creation Date",
                  value: new Date(guild.createdAt).toLocaleDateString("en-US"),
                  inline: false,
                },
                {
                  name: "Total Members",
                  value: `${guild.memberCount}`,
                  inline: true,
                },
                {
                  name: "Users",
                  value: `${guild.members.filter((m) => !m.user.bot).size}`,
                  inline: true,
                },
                {
                  name: "Bots",
                  value: `${guild.members.filter((m) => m.user.bot).size}`,
                  inline: true,
                },
                {
                  name: "Channels",
                  value: `${guild.channels.size}`,
                  inline: true,
                },
                {
                  name: "Text",
                  value: `${
                    guild.channels.filter((ch) => ch.type === "GUILD_TEXT").size
                  }`,
                  inline: true,
                },
                {
                  name: "Voice",
                  value: `${
                    guild.channels.filter((ch) => ch.type === "GUILD_VOICE")
                      .size
                  }`,
                  inline: true,
                },
                {
                  name: "Roles",
                  value: guild.roles.map((role) => `<@&${role.id}>`).join(", "),
                  inline: false,
                },
                {
                  name: "Emojis",
                  value:
                    guild.emojis.size > 0
                      ? guild.emojis
                          .map((emoji) => `<${emoji.name}:${emoji.id}>`)
                          .join(" ")
                      : "None",
                  inline: false,
                },
              ],
            },
          ],
        });
        break;
      case "bot":
        const bot: BotData = {
          name: client.user?.username!,
          createdAt: client.user?.createdTimestamp!,
          avatar: client.user?.avatarURL({ dynamic: false })!,
          owner: `<@!${process.env.OWNER_ID}>`,
          users: client.users.cache.size,
          channels: client.channels.cache.size,
          uptime: pretty(client.uptime!),
          platform: process.platform,
        };

        message.channel.send({
          embeds: [
            {
              title: bot.name,
              color: "RED",
              //@ts-ignore
              thumbnail: bot.avatar,
              fields: [
                {
                  name: "Created at",
                  value: new Date(bot.createdAt).toLocaleDateString("en-US"),
                  inline: false,
                },
                { name: "Owner", value: bot.owner, inline: false },
                { name: "User cache", value: `${bot.users}`, inline: true },
                {
                  name: "Channel cache",
                  value: `${bot.channels}`,
                  inline: true,
                },
                { name: "Uptime", value: `${bot.uptime}`, inline: false },
                { name: "Plotform", value: `${bot.platform}`, inline: false },
              ],
            },
          ],
        });
        break;
      case "user":
        const userArgs = args.join(" ").slice(1);
        const member =
          message.mentions.members?.first() ||
          message.guild?.members.cache.get(userArgs[0]!) ||
          message.guild?.members.cache.find((u) => u.user.id === userArgs[0]) ||
          message.member;

        const user: UserData = {
          tag: member?.user.tag!,
          id: member?.user.id!,
          createdAt: member?.user.createdTimestamp!,
          avatar: member?.user.avatarURL()!,
          joinedAt: member?.joinedTimestamp!,
          roles: member?.roles.cache.filter(
            (role) => role.name !== "@everyone"
          )!,
        };

        message.channel.send({
          embeds: [
            {
              title: user.tag,
              author: { name: user.tag, iconURL: user.avatar },
              //@ts-ignore
              thumbnail: user.avatar,
              color: "RED",
              fields: [
                { name: "ID", value: user.id, inline: true },
                { name: "Mention", value: `<@!${user.id}>`, inline: true },
                {
                  name: "Registered at",
                  value: new Date(user.createdAt).toLocaleDateString("en-US"),
                  inline: false,
                },
                {
                  name: "Joined at",
                  value: new Date(user.joinedAt).toLocaleDateString("en-US"),
                  inline: false,
                },
                {
                  name: "Roles",
                  value: user.roles.map((role) => `<@&${role.id}>`).join(", "),
                },
              ],
            },
          ],
        });
        break;
      default:
        message.reply(
          `**Invalid argument!** Please use one of these arguments next time:\n${validArgs
            .map((arg) => `${arg}`)
            .join(", ")}`
        );
        break;
    }
  },
});
