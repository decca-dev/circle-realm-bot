import { User } from "../../Models/User.js";
import { Command } from "../../Structures/Command.js";

export default new Command({
  name: "register",
  description: "Create an account for the Circle realm discord server",
  usage: "register <name> <minecraft_IGN> [phone_number]",
  cooldown: 10,
  ownerOnly: false,
  adminOnly: false,
  permissions: [],
  category: "auth",
  run: async (client, message, args) => {},
});
