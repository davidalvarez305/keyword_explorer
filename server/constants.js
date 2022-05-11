import "dotenv/config"
export const __prod__ = process.env.NODE_ENV === "production"
export const PORT = process.env.PORT || 4010
export const GOOGLE_ADS_SCOPE = `https://www.googleapis.com/auth/adwords`;
export const GOOGLE_SEARCH_CONSOLE_SCOPE = `https://www.googleapis.com/auth/webmasters`;