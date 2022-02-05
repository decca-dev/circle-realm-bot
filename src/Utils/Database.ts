import mongo from "mongoose";
import { Logger } from "./Logger.js";

const logger = new Logger("database");

export const dbConnect = () => {
  mongo
    .connect(process.env.MONGO_URI)
    .then(() => logger.info("Connected to mongo successfully!"))
    .catch((err: Error) => logger.error(`Could not connect to mongo!\n${err}`));
};
