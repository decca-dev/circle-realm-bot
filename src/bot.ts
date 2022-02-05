import { TSClient } from "./Structures/Client.js";
import { Intents } from "discord.js";
import { config } from "dotenv";
import { Logger } from "./Utils/Logger.js";

const logger = new Logger("client");
config();

export const client = new TSClient({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.load();

client.login(process.env.TOKEN);
