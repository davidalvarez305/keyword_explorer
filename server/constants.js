import "dotenv/config"
import * as config from "./google.json";
export const __prod__ = process.env.NODE_ENV === "production";
export const PORT = process.env.PORT || 4010;
export const REDIRECT_URI = __prod__ ? config.default.web.redirect_uris[1] : config.default.web.redirect_uris[0];
export const COOKIE_NAME = process.env.COOKIE_NAME;