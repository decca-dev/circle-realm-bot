import { TSClient } from "./Structures/Client.js";
import { Intents } from "discord.js";
import { config } from "dotenv";
import { Logger } from "./Utils/Logger.js";
import { ready, messageCreate } from "./Listeners/index.js";

const logger = new Logger("client");
config();

export const client = new TSClient({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.load();

ready(logger, client);

messageCreate(logger, client);

client.login(process.env.TOKEN);
