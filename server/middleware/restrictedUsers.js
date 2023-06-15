import { __prod__ } from "../constants.js";

export default function restrictedUsers(req, res, next) {
  if (__prod__ && !req.body.email.includes(process.env.SECRET_EMAIL)) {
    return res.status(403).json({ data: "Not authorized to register." });
  }
  next();
}
