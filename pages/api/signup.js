// This is for the user system API, which I'm not using for the first release

import nc from "next-connect";
import { addUser, findUser } from "../../db";
import middlewares from "../../middlewares";

const handler = nc();
handler.use(...middlewares);

handler.post(async (req, res) => {
  const { username, password } = req.body;
  if (await findUser(req.db, username)) {
    res.status(403).json({ error: { message: "Username already taken" } });
    return;
  }

  await addUser(req.db, username, password);

  req.login({ username, password }, (err) => {
    if (err) {
      console.log(err);
      res.status(400).json({ error: { message: err } });
      return;
    }
    res.status(201).json({
      username,
    });
  });
});

export default handler;
