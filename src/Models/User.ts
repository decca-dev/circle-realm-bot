import { Schema, model } from "mongoose";

interface UserInterface {
  name: string;
  discord_id: string;
  minecraft_IGN: string;
  phone_number?: string;
}

export const User = model<UserInterface>(
  "User",
  new Schema<UserInterface>({
    name: { type: String, required: true, unique: true },
    discord_id: { type: String, required: true, unique: true },
    phone_number: { type: String, unique: true },
    minecraft_IGN: { type: String, required: true, unique: true },
  })
);
