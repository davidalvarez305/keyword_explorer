import "dotenv/config";
export const __prod__ = process.env.NODE_ENV === "production";
export const PORT = process.env.PORT || 4010;
export const REDIRECT_URI = process.env.REDIRECT_URI;
export const COOKIE_NAME = process.env.COOKIE_NAME;
export const SERP_FEATURES = {
  0: "Instant Answer",
  1: "Knowledge Panel",
  2: "Carousel",
  3: "Local Pack",
  4: "Top Stories",
  5: "Image Pack",
  6: "Site Links",
  7: "Reviews",
  8: "Tweet",
  9: "Video",
  10: "Featured Video",
  11: "Featured Snippet",
  12: "AMP",
  13: "Image",
  14: "AdWords Top",
  15: "AdWords Bottom",
  16: "Shopping Ads",
  17: "Hotels Pack",
  18: "Jobs Search",
  19: "Featured Images",
  20: "Video Carousel",
  21: "People Also Ask",
  22: "FAQ",
  23: "Flights",
};
