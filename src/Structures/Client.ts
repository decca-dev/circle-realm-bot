import { Client, Collection } from "discord.js";
import { readdirSync } from "fs";
import { join } from "path";
import { Logger } from "../Utils/Logger.js";
import { __dirname } from "../Utils/Constants.js";
import { Command } from "./Command.js";
import { dbConnect } from "../Utils/Database.js";
import { Listener } from "./Listener.js";

const logger = new Logger("client");

export class TSClient extends Client {
  public commands: Collection<string, Command> = new Collection();
  public cooldowns: Collection<string, number> = new Collection();

  public async importFile(filePath: string) {
    return (await import(filePath))?.default;
  }

  public loadCommands(): void {
    const commandsPath = join(__dirname, "..", "Commands");
    readdirSync(commandsPath).forEach(async (dir) => {
      const commandFiles = readdirSync(`${commandsPath}/${dir}`).filter(
        (file) => file.endsWith(".js")
      );
      for (const file of commandFiles) {
        const command: Command = await this.importFile(
          `file://${commandsPath}/${dir}/${file}`
        );
        this.commands.set(command.name, command);
        logger.info(`COMMAND - ${command.name} was loaded!`);
      }
    });
  }

  public loadListeners(): void {
    const listenersPath = join(__dirname, "..", "Listeners");
    readdirSync(listenersPath)
      .filter((file) => file.endsWith(".js"))
      .forEach(async (file) => {
        const listener: Listener = await this.importFile(
          `file://${listenersPath}/${file}`
        );
        logger.info(`LISTENERS - ${listener.name} was loaded!`);
        listener.run(logger, this);
      });
  }

  public load(): void {
    this.loadCommands();
    this.loadListeners();
    dbConnect();
  }
}
