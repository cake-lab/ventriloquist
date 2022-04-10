import db from "./db";
import session from "./session";
import passport from "./auth";

const middlewares = [db, session, passport.initialize(), passport.session()];

export default middlewares;
