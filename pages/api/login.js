import nc from "next-connect";
import middlewares from "../../middlewares";
import passport from "../../middlewares/auth";

const handler = nc();
handler.use(...middlewares);

handler.post(passport.authenticate("local"), (req, res) => {
  console.log(`Logged in ${req.user.username}`);
  res.json({ user: req.user });
});

export default handler;
