import JWT from "jsonwebtoken";
import { config } from "../config/config.js";
import createHttpError from "http-errors";

const Auth = async (req, res, next) => {
  try {
    //get token
    const token = req.headers["authorization"].split(" ")[1];
    JWT.verify(token, config.jwtsecret, (err, decode) => {
      if (err) {
        return next(401, "un-authorize user");
      } else {
        req.user = decode;
        next();
      }
    });
  } catch (error) {
    return next(createHttpError(500, "please provide auth token"));
  }
};
export default Auth;
