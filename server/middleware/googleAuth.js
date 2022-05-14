import { RefreshGoogleToken } from "../actions/auth.js";

export const googleAuth = async (req, res, next) => {
  if ((Date.now() - req.session.lastRequest) / 1000 < 3600) {
    console.log("Under one hour since last request.");
  } else {
    try {
      console.log("Requesting new token...");
      await RefreshGoogleToken(req);
    } catch (err) {
      return res.status(400).json({ data: err.message });
    }
  }

  next();
};
