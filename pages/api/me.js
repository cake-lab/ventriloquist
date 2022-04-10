// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Db, MongoClient } from "mongodb";
import nc from "next-connect";
import middlewares from "../../middlewares";

const handler = nc();
handler.use(...middlewares);

handler.get((req, res) => {
  if (!req.user) {
    res.json(null);
    return;
  }

  res.json(req.user);
});

handler.delete(async (req, res) => {
  console.log(`Logging out ${req.user.username}`);
  await req.session.destroy();
  res.status(204).end();
});

export default handler;
