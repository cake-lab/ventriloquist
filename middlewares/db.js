import { MongoClient } from "mongodb";

global.mongo = global.mongo || {};

export const getMongoClient = async () => {
  if (!global.mongo.client) {
    global.mongo.client = new MongoClient(process.env.MONGODB_URI);
  }

  await global.mongo.client.connect();

  return global.mongo.client;
};

export const db = async (req, res, next) => {
  if (!global.mongo.client) {
    global.mongo.client = new MongoClient(process.env.MONGODB_URI);
  }
  req.dbClient = await getMongoClient();
  req.db = req.dbClient.db("ventriloquist"); // this use the database specified in the MONGODB_URI (after the "/")
  //if (!indexesCreated) await createIndexes(req.db);
  return next();
};

export default db;
