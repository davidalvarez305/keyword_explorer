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

const router = express.Router();

// Get Keywords From URL
router.post("/", googleAuth, GetKeywordsFromURL);

// Get PAA Questions by Keywords
router.get("/paa-keywords", googleAuth, PeopleAlsoAskByKeywords);

// Get PAA Questions By URL
router.get("/paa-url", googleAuth, PeopleAlsoAskByURL);

// Get Striking Distance Keywords From URL
router.get("/striking-distance", googleAuth, StrikingDistance);

// Get Keyword Positions By URL
router.get("/positions", googleAuth, KeywordPositionsByURL);

// Get URLs of Websites Associated With Account
router.get("/semrush", authRequired, SEMRushKeywords);

// Generate SEMRush Competitors Backlinks Report
router.get("/semrush-backlinks-report", googleAuth, SEMRushBacklinksReport);

// Generate Featured Snippets Report
router.get("/featured-snippets", authRequired, FeaturedSnippetsByKeyword);

// Generate Featured Videos on SERP Report
router.get("/featured-videos", authRequired, SERPVideosByKeyword);

// Create Compilation Report
router.get("/generate-report", googleAuth, GeneratePageReport);

export default router;
