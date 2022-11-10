import { GetAPIKeys } from "../actions/user.js";

export default async function keysRequired(req, res, next) {
  if (!req.session.userId) {
    return res.status(403).json({ data: "Not Authorized." });
  }
  if (!req.session.semrush_api_key || !req.session.serp_api_key) {
    try {
      const keys = await GetAPIKeys(req.session.userId);
      req.session.semrush_api_key = keys.semrush_api_key;
      req.session.serp_api_key = keys.serp_api_key;
    } catch (err) {
      return res.status(400).json({ data: err.message });
    }
  }
  next();
}
