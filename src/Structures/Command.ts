import { PermissionString, Message } from "discord.js";
import { CommandOptions } from "../types";
import { TSClient } from "./Client.js";

export class Command {
  public readonly name: string;
  public readonly description: string;
  public readonly usage: string;
  public readonly category: string;
  public readonly permissions: PermissionString[];
  public readonly cooldown: number;
  public readonly adminOnly: boolean;
  public readonly ownerOnly: boolean;
  public run: (
    client: TSClient,
    message: Message,
    args: string[]
  ) => Promise<void>;

  constructor(options: CommandOptions) {
    this.name = options.name;
    this.description = options.description;
    this.usage = options.usage;
    this.category = options.category;
    this.permissions = options.permissions;
    this.cooldown = options.cooldown;
    this.adminOnly = options.adminOnly;
    this.ownerOnly = options.ownerOnly;
    this.run = options.run;
  }
}
