import { Listener } from "../Structures/Listener.js";

export default new Listener({
  name: "ready",
  run: (logger, client) => {
    client.on("ready", () => {
      logger.info(`Logged in as ${client.user?.username}`);
      client.user?.setActivity({ type: "PLAYING", name: "with Typescript" });
    });
  },
});
