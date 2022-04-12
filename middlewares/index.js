import db from "./db";
import session from "./session";
import passport from "./auth";

const middlewares = [db, session, passport.initialize(), passport.session()];

const runMiddleWare = (req, res, fn) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
};

export const runMiddleWares = async (req, res, fns) => {
  console.log("Running all middlewares");
  for (const fn of fns) {
    console.log("Running middleware");
    await runMiddleWare(req, res, fn);
  }
};

export default middlewares;
