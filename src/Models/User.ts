import mongo from "mongoose";
import { UserOptions } from "types";

export const User = mongo.model<UserOptions>(
  "User",
  new mongo.Schema<UserOptions>({
    name: { type: String, required: true, unique: true },
    discord_id: { type: String, required: true, unique: true },
    phone_number: { type: String, unique: true },
    minecraft_IGN: { type: String, required: true, unique: true },
  })
);
