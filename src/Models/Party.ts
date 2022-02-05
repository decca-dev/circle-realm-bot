import { Schema, model } from "mongoose";

interface PartyInterface {
  owner: string;
  players: string[];
  thread_id: string;
  voice_id: string;
  createdAt: number;
}

export const Party = model<PartyInterface>(
  "Party",
  new Schema<PartyInterface>({
    owner: { type: String, required: true, unique: true },
    players: { type: [String], required: true, unique: true },
    thread_id: { type: String, required: true, unique: true },
    voice_id: { type: String, required: true, unique: true },
    createdAt: { type: Number, default: Date.now },
  })
);
