import { Command } from "../../Structures/Command.js";

export default new Command({
  name: "ping",
  description: "Check the bot's latency and API ping.",
  usage: "ping",
  cooldown: 3,
  ownerOnly: false,
  adminOnly: false,
  permissions: [],
  category: "system",
  run: async (client, message, args) => {
    const msg = await message.channel.send("Ping?");

    msg.edit(
      `:ping_pong: Pong!\n⌛ Latency is ${Math.floor(
        msg.createdTimestamp - message.createdTimestamp
      )}ms\n⏲️ API Ping is ${Math.round(client.ws.ping)}ms`
    );
  },
});
