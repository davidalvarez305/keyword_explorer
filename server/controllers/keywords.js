import express from "express";

import {
  GetKeywordsFromURL,
  PeopleAlsoAskByKeywords,
  PeopleAlsoAskByURL,
  StrikingDistance,
  GetKeywordPositionsByURL,
  GetSEMRushKeywordReport,
  GetSEMRushBacklinksReport,
  GetFeaturedSnippetsByKeyword,
  GetSERPVideosByKeyword,
  GeneratePageReport,
} from "../handlers/keywords.js";
import authRequired from "../middleware/authRequired.js";
import { googleAuth } from "../middleware/googleAuth.js";

const router = express.Router();

// Get Keywords From URL
router.post("/", googleAuth, GetKeywordsFromURL);

// Get PAA Questions by Keywords
router.get("/paa-keywirds", googleAuth, PeopleAlsoAskByKeywords);

// Get PAA Questions By URL
router.get("/paa-url", googleAuth, PeopleAlsoAskByURL);

// Get Striking Distance Keywords From URL
router.post("/striking-distance", googleAuth, StrikingDistance);

// Get Keyword Positions By URL
router.post("/positions", googleAuth, GetKeywordPositionsByURL);

// Get URLs of Websites Associated With Account
router.post("/semrush", authRequired, GetSEMRushKeywordReport);

// Get URLs of Websites Associated With Account
router.post("/backlinks-report", googleAuth, GetSEMRushBacklinksReport);

// Get URLs of Websites Associated With Account
router.post("/featured-snippets", authRequired, GetFeaturedSnippetsByKeyword);

// Get URLs of Websites Associated With Account
router.post("/featured-videos", authRequired, GetSERPVideosByKeyword);

// Get URLs of Websites Associated With Account
router.get("/generate-report", authRequired, GeneratePageReport);

export default router;
