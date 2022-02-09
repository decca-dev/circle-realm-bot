import { Listener } from "../Structures/Listener.js";
import {
  GuildMember,
  PartialGuildMember,
  TextChannel,
  MessageEmbed,
} from "discord.js";

export default new Listener({
  name: "guildMemberRemove",
  run: (logger, client) => {
    client.on(
      "guildMemberRemove",
      (member: GuildMember | PartialGuildMember) => {
        const channel = member.guild.channels.cache.find(
          (ch) => ch.name === "welcome"
        ) as TextChannel;
        channel.send({
          embeds: [
            new MessageEmbed()
              .setColor("RED")
              .setThumbnail(member.user.avatarURL()!)
              .setTitle(`Good bye ${member.user.username}`)
              .setDescription(`We're sorry to see you leave!`)
              .setFooter({
                text: `There are ${member.guild.memberCount} members left`,
              }),
          ],
        });
      }
    );
  },
});
