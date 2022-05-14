import express from "express";

import {
  GetAllKeywordsFromUrl,
  GetPeopleAlsoAskQuestions,
  GetManyPAAQuestions,
  GetLowPickingsKeywords,
  GetStrikingDistanceKeywords,
  GetAccountSites,
} from "../handlers/keywords.js";
import { googleAuth } from "../middleware/googleAuth.js";

const router = express.Router();

// Get Keywords From URL
router.post("/", googleAuth, GetAllKeywordsFromUrl);

// Get 1 Keyword's "People Also Ask" Questions
router.get("/questions/:keyword", googleAuth, GetPeopleAlsoAskQuestions);

// Get Many "People Also Ask" Questions From Many Keywords
router.post("/questions", googleAuth, GetManyPAAQuestions);

// Get "Low Pickings" Keywords From URL
router.post("/low-pickings", googleAuth, GetLowPickingsKeywords);

// Get Striking Distance Keywords From URL
router.post("/striking-distance", googleAuth, GetStrikingDistanceKeywords);

// Get URLs of Websites Associated With Account
router.post("/sites", googleAuth, GetAccountSites);

export default router;
