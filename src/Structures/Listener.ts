import { ListenerOptions } from "../types";
import { TSClient } from "./Client.js";
import { Logger } from "../Utils/Logger.js";

export class Listener {
  public readonly name: string;
  public run: (logger: Logger, client: TSClient) => void;

  constructor(options: ListenerOptions) {
    this.name = options.name;
    this.run = options.run;
  }
}
