import express from "express";

import {
  GetKeywordsFromURL,
  GetPeopleAlsoAskQuestionsByKeywords,
  GetPeopleAlsoAskQuestionsByURL,
  GetLowPickingsKeywords,
  GetStrikingDistanceKeywords,
  GetAccountSites,
  GetKeywordPositionsByURL,
  GetSEMRushKeywordReport,
} from "../handlers/keywords.js";
import authRequired from "../middleware/authRequired.js";
import { googleAuth } from "../middleware/googleAuth.js";

const router = express.Router();

// Get Keywords From URL
router.post("/", googleAuth, GetKeywordsFromURL);

// Get PAA Questions by Keywords
router.post("/questions", googleAuth, GetPeopleAlsoAskQuestionsByKeywords);

// Get PAA Questions By URL
router.post("/many-questions", googleAuth, GetPeopleAlsoAskQuestionsByURL);

// Get "Low Pickings" Keywords From URL
router.post("/low-pickings", googleAuth, GetLowPickingsKeywords);

// Get Striking Distance Keywords From URL
router.post("/striking-distance", googleAuth, GetStrikingDistanceKeywords);

// Get Keyword Positions By URL
router.post("/positions", googleAuth, GetKeywordPositionsByURL);

// Get URLs of Websites Associated With Account
router.get("/sites", googleAuth, GetAccountSites);

// Get URLs of Websites Associated With Account
router.post("/semrush", GetSEMRushKeywordReport);

export default router;
