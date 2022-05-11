import "dotenv/config"
import * as config from "./google.json";
export const __prod__ = process.env.NODE_ENV === "production";
export const PORT = process.env.PORT || 4010;
export const GOOGLE_ADS_SCOPE = `https://www.googleapis.com/auth/adwords`;
export const GOOGLE_SEARCH_CONSOLE_SCOPE = `https://www.googleapis.com/auth/webmasters`;
export const REDIRECT_URI = __prod__ ? config.default.web.redirect_uris[1] : config.default.web.redirect_uris[0];
export const GOOGLE_REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;
export const GOOGLE_CUSTOMER_ID = process.env.GOOGLE_CUSTOMER_ID
export const GOOGLE_DEVELOPER_TOKEN = process.env.GOOGLE_DEVELOPER_TOKEN