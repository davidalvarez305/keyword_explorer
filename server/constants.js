import "dotenv/config"
export const __prod__ = process.env.NODE_ENV === "production";
export const PORT = process.env.PORT || 4010;
export const REDIRECT_URI = process.env.REDIRECT_URI;
export const COOKIE_NAME = process.env.COOKIE_NAME;