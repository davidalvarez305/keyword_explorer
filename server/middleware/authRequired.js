export default function authRequired(req, res, next) {
  if (!req.session.userId) {
    return res.status(403).json({ data: "Not Authorized." });
  }
  next();
}
