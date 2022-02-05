import { TSClient } from "../Structures/Client.js";
import { Logger } from "../Utils/Logger.js";

export const ready = (logger: Logger, client: TSClient) => {
  client.on("ready", () => {
    logger.info("LISTENERS - ready was loaded!");
    logger.info(`Logged in as ${client.user?.username}`);
    client.user?.setActivity({ type: "PLAYING", name: "in The Circle realm." });
  });
};
