// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Db, MongoClient } from "mongodb";
import nc from "next-connect";
import middlewares, { runMiddleWares } from "../../middlewares";

/*
const handler = nc({
  onError: (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).end("Something broke!");
  },
});
handler.use(...middlewares);

handler.post((req, res) => {
  console.log("Uploading model");
  if (!req.user) {
    res.status(401).end();
    return;
  }
  console.log(req.body);

  res.json(req.user);bn  
});

*/

const handler = async (req, res) => {
  console.log("Hello??");
  res.status(200).end();
  //await runMiddleWares(req, res, middlewares);
};

export default handler;
