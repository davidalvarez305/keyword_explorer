import express from "express";

import {
  GetKeywordsFromURL,
  PeopleAlsoAskByKeywords,
  PeopleAlsoAskByURL,
  StrikingDistance,
  KeywordPositionsByURL,
  SEMRushKeywords,
  SEMRushBacklinksReport,
  FeaturedSnippetsByKeyword,
  SERPVideosByKeyword,
  GeneratePageReport,
} from "../handlers/keywords.js";
import authRequired from "../middleware/authRequired.js";
import { googleAuth } from "../middleware/googleAuth.js";
import keysRequired from "../middleware/keysRequired.js";

const router = express.Router();

// Get Keywords From URL
router.post("/", googleAuth, GetKeywordsFromURL);

// Get PAA Questions by Keywords
router.get("/paa-keywords", [keysRequired, googleAuth], PeopleAlsoAskByKeywords);

// Get PAA Questions By URL
router.get("/paa-url", [keysRequired, googleAuth], PeopleAlsoAskByURL);

// Get Striking Distance Keywords From URL
router.get("/striking-distance", googleAuth, StrikingDistance);

// Get Keyword Positions By URL
router.post("/positions", googleAuth, KeywordPositionsByURL);

// Get URLs of Websites Associated With Account
router.get("/semrush", keysRequired, SEMRushKeywords);

// Generate SEMRush Competitors Backlinks Report
router.get("/semrush-backlinks-report", [keysRequired, googleAuth], SEMRushBacklinksReport);

// Generate Featured Snippets Report
router.get("/featured-snippets", keysRequired, FeaturedSnippetsByKeyword);

// Generate Featured Videos on SERP Report
router.get("/featured-videos", keysRequired, SERPVideosByKeyword);

// Create Compilation Report
router.get("/generate-report", [keysRequired, googleAuth], GeneratePageReport);

export default router;
