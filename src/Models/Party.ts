import mongo from "mongoose";
import { PartyOptions } from "types";

const randomGen = () => {
  const possibilities =
    "abcdefghijklmopqrstuvwxyzABCDEFGHIJKLMOPQRSTYUVWXYZ0123456789";
  let final = "";
  const length = 10;
  for (let i = 0; i < possibilities.length; i++) {
    if (final.length === length) break;
    final += possibilities[Math.floor(Math.random() * possibilities.length)];
  }
  return final;
};

export const Party = mongo.model<PartyOptions>(
  "Party",
  new mongo.Schema<PartyOptions>({
    name: { type: String, required: true, unique: true },
    party_id: {
      type: String,
      required: true,
      unique: true,
      default: randomGen(),
    },
    owner: { type: String, required: true, unique: true },
    players: { type: [String], required: true, default: [] },
    thread_id: { type: String, required: true, unique: true },
    createdAt: { type: Number, default: Date.now },
  })
);
