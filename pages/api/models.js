// This is for the user system API, which I'm not using for the first release
import { Db, MongoClient } from "mongodb";
import nc from "next-connect";
import middlewares from "../../middlewares";
import multer from "multer";

const upload = multer({
  storage: multer.diskStorage({
    destination: "tmp/",
    filename: (req, file, cb) => cb(null, file.originalname),
  }),
});

const handler = nc();

handler.use(upload.single("file"));
handler.use(...middlewares);

handler.post((req, res) => {
  console.log("Uploading model");
  if (!req.user) {
    res.status(401).end();
    return;
  }
  //console.log(req.body);

  res.json(req.user);
});

/*
const handler = async (req, res) => {
  console.log("Hello??");
  runMiddleWares(req, res, middlewares);

  res.status(200).end();
};
*/

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
