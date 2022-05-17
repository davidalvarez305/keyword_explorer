export default function restrictedUsers(req, res, next) {
  if (!req.body.email.includes(process.env.SECRET_EMAIL)) {
    return res.status(403).json({ data: "Not authorized to register." });
  }
  next();
}
