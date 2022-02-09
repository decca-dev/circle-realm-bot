import { Listener } from "../Structures/Listener.js";
import { GuildMember, TextChannel, MessageEmbed } from "discord.js";

export default new Listener({
  name: "guildMemberAdd",
  run: (logger, client) => {
    client.on("guildMemberAdd", (member: GuildMember) => {
      const channel = member.guild.channels.cache.find(
        (ch) => ch.name === "welcome"
      ) as TextChannel;
      channel.send({
        embeds: [
          new MessageEmbed()
            .setColor("GREEN")
            .setThumbnail(member.user.avatarURL()!)
            .setTitle(`Welcome ${member.user.username}`)
            .setDescription(
              `We're glad to have you here!\nBefore accessing the contents of this server make sure to register in <#938205821932830762> and await approval from moderators!`
            )
            .setFooter({
              text: `You are the member #${member.guild.memberCount}`,
            }),
        ],
      });
    });
  },
});
