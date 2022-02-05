import { Listener } from "../Structures/Listener.js";
import pretty from "pretty-ms";

export default new Listener({
  name: "messageCreate",
  run: (logger, client) => {
    client.on("messageCreate", async (message) => {
      if (message.author.bot || !message.content.startsWith(process.env.PREFIX))
        return;

      const args = message.content
        .slice(process.env.PREFIX.length)
        .trim()
        .split(/ +/g);

      const cmd = args.shift()?.toLowerCase();

      const command = client.commands.get(cmd!);

      if (!command) return;

      if (command.ownerOnly && message.author.id !== process.env.OWNER_ID)
        return;

      if (command.permissions.length > 0) {
        if (
          !message.member?.permissions
            .toArray()
            .includes(command.permissions[0]!)
        ) {
          message.reply(
            "You cannot run that command because you are missing some permissions!"
          );
          return;
        }
      }

      if (client.cooldowns.has(`${message.author.id}${command.name}`)) {
        const timeLeft =
          client.cooldowns.get(`${message.author.id}${command.name}`)! -
          Date.now();
        message.channel.send(
          `You have to wait ${pretty(timeLeft)} before reusing the \`${
            command.name
          }\` command again!`
        );
        return;
      }

      try {
        await command.run(client, message, args);
      } catch (error) {
        logger.error(error as Error);
      }

      if (command.cooldown) {
        client.cooldowns.set(
          `${message.author.id}${command.name}`,
          Date.now() + command.cooldown * 1000
        );
        setTimeout(() => {
          client.cooldowns.delete(`${message.author.id}${command.name}`);
        }, command.cooldown * 1000);
      }
    });
  },
});
