import nc from "next-connect";
import middlewares from "../../middlewares";
import passport from "../../middlewares/auth";

const handler = nc();
handler.use(...middlewares);

handler.post(passport.authenticate("local"), (req, res) => {
  console.log(req.body);
  res.json({ user: req.user });
});

export default handler;
