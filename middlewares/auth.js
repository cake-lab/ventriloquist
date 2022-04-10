import { findUser, findUserWithPassword } from "../db/user";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

passport.serializeUser((user, done) => {
  done(null, user.username);
});

passport.deserializeUser((req, username, done) => {
  findUser(req.db, username).then(
    (user) => done(null, user),
    (err) => done(err)
  );
});

passport.use(
  new LocalStrategy(
    { usernameField: "username", passReqToCallback: true },
    async (req, username, password, done) => {
      const user = await findUserWithPassword(req.db, username, password);
      if (user) done(null, user);
      else done(null, false, { message: "Username or password is incorrect" });
    }
  )
);

export default passport;
