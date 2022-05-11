import express from "express";

import {
  GetAllKeywordsFromUrl,
  GetPeopleAlsoAskQuestions,
  GetManyPAAQuestions,
  GetLowPickingsKeywords,
  GetStrikingDistanceKeywords,
} from "../handlers/keywords.js";

const router = express.Router();

// Get Keywords From URL
router.post("/", GetAllKeywordsFromUrl);

// Get 1 Keyword's "People Also Ask" Questions
router.get("/questions/:keyword", GetPeopleAlsoAskQuestions);

// Get Many "People Also Ask" Questions From Many Keywords
router.post("/questions", GetManyPAAQuestions);

// Get "Low Pickings" Keywords From URL
router.post("/low-pickings", GetLowPickingsKeywords);

// Get Striking Distance Keywords From URL
router.post("/striking-distance", GetStrikingDistanceKeywords);

export default router;
