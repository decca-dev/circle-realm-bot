import { Party } from "../../Models/Party.js";
import { PartyOptions } from "../../types";
import { Document, Types } from "mongoose";
import { GuildMember, GuildTextBasedChannel } from "discord.js";

type PartyModelType =
  | (Document<unknown, any, PartyOptions> &
      PartyOptions & { _id: Types.ObjectId })
  | null;

export const createParty = async ({
  name,
  owner,
  thread_id,
  players,
}: {
  name: string;
  owner: string;
  thread_id: string;
  players: string[];
}): Promise<PartyModelType> => {
  const party = new Party({
    name: name,
    owner: owner,
    players: players,
    thread_id: thread_id,
  });
  await party.save();
  return party;
};

export const deleteParty = async (id: string): Promise<void> => {
  const party = await Party.findOne({ party_id: id });
  if (party) {
    await party.delete();
  } else {
    throw new Error(`Party with the ID ${id} doesn't exist`);
  }
};

export const getParties = async (): Promise<PartyModelType[]> => {
  const parties = await Party.find();
  return parties;
};

export const getParty = async (id: string): Promise<PartyModelType> => {
  const party = await Party.findOne({ party_id: id });
  return party;
};

export const findUserParty = async (
  userID: string
): Promise<PartyModelType> => {
  const parties = await getParties();
  const userParty = parties.find((p) => p!.players.includes(userID));
  return userParty!;
};

export const joinParty = async (
  user: GuildMember,
  id: string
): Promise<PartyModelType> => {
  const party = await getParty(id);
  if (!party) {
    throw new Error(`Party with ID ${id} doesn't exist!`);
  }
  const userParty = await findUserParty(user.user.id);
  if (userParty) {
    throw new Error("User is already in a party!");
  }
  party?.players.push(user.user.id);
  await party?.save();
  return party;
};

export const leaveParty = async (
  user: GuildMember
): Promise<PartyModelType> => {
  const party = await findUserParty(user.user.id);
  if (!party) {
    throw new Error(`User isn't a member of any party!`);
  }
  party.players = party?.players.splice(party.players.indexOf(user.user.id), 1);
  await party?.save();
  return party;
};

export const inviteToParty = async (
  user: string,
  author: GuildMember,
  id: string
): Promise<void> => {
  if (user === author.user.id) {
    throw new Error("Can't invite author to their own party!");
  }
  const party = await getParty(id);
  if (!party) {
    throw new Error(`Party with ID ${id} doesn't exist!`);
  }
  if (party.players.includes(user)) {
    throw new Error(
      `Can't invite that user because they already belong to the party!`
    );
  }
  const channel = author.guild.channels.cache.get(
    process.env.THREAD_CHANNEL
  ) as GuildTextBasedChannel;

  channel.send(
    `Hey <@${user}>! ${author} wants to invite you to their party.\nIf you would like to join it simply run the command \`%party join ${id}\`.\n**Party info**:\n**Owner**: ${
      author.guild.members.cache.get(party.owner)?.user.tag
    }\n**Players**: ${party.players.length} - ${party.players
      .map((player) => author.guild.members.cache.get(player)?.user.username)
      .join(", ")}\n**Created at**: ${new Date(
      party.createdAt
    ).toLocaleDateString("en-US")}`
  );
};
