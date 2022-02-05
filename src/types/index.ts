import { PermissionString, Message, ClientEvents } from "discord.js";
import { TSClient } from "../Structures/Client.js";

export interface CommandOptions {
  name: string;
  description: string;
  usage: string;
  category: string;
  permissions: PermissionString[];
  cooldown: number;
  adminOnly: boolean;
  ownerOnly: boolean;
  run: (client: TSClient, message: Message, args: string[]) => Promise<void>;
}
