import { PermissionString, Message, ClientEvents } from "discord.js";
import { TSClient } from "../Structures/Client.js";
import { Logger } from "../Utils/Logger.js";

export interface CommandOptions {
  name: string;
  description: string;
  usage: string;
  category: Category;
  permissions: PermissionString[];
  cooldown: number;
  adminOnly: boolean;
  ownerOnly: boolean;
  run: (client: TSClient, message: Message, args: string[]) => Promise<void>;
}

export interface ListenerOptions {
  name: keyof ClientEvents;
  run: (logger: Logger, client: TSClient) => void;
}

export type Category = "auth" | "system" | "utilities" | "party";

export interface PartyOptions {
  name: string;
  party_id: string;
  owner: string;
  players: string[];
  thread_id: string;
  createdAt: number;
}

export interface UserOptions {
  name: string;
  discord_id: string;
  minecraft_IGN: string;
  phone_number?: string;
}
