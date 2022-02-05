import { TSClient } from "../Structures/Client.js";
import { Logger } from "../Utils/Logger.js";
import pretty from "pretty-ms";

export const messageCreate = (logger: Logger, client: TSClient) => {
  logger.info("LISTENERS - messageCreate was loaded!");
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

    if (command.ownerOnly && message.author.id !== process.env.OWNER_ID) return;

    if (command.permissions) {
      if (!message.member?.permissions.has(command.permissions)) return;
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
};
