import axios from "axios";
import {
  CrawlGoogleSERP,
  GetPAAFromURL,
  GetStrikingDistanceTerms,
} from "../actions/keywords.js";
import { extractSiteFromPage } from "../utils/keywords.js";

export const GetAllKeywordsFromUrl = async (req, res) => {
  if (!req.body.site) {
    return res
      .status(400)
      .json({ data: "Please include a site in your request." });
  }

  const requestParams = {
    url: `https://searchconsole.googleapis.com/webmasters/v3/sites/https%3A%2F%2F${req.body.site}/searchAnalytics/query?key=${process.env.API_KEY}`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${req.session.access_token}`,
      Accept: "application/json",
    },
    data: {
      startDate: "2022-04-01",
      endDate: "2022-05-01",
      dimensions: ["query"],
    },
  };

  try {
    const { data } = await axios(requestParams);
    return res.status(200).json({ data });
  } catch (err) {
    return res.status(400).json({ data: err.message });
  }
};

export const GetPeopleAlsoAskQuestionsByKeywords = async (req, res) => {
  if (!req.body.keywords) {
    return res
      .status(400)
      .json({ data: "Please include a keyword in the request." });
  }

  const searchTerms = req.body.keywords.split("\n");

  let peopleAlsoAskQuestions = [];
  for (let i = 0; i < searchTerms.length; i++) {
    try {
      const questions = await CrawlGoogleSERP(searchTerms[i]);
      peopleAlsoAskQuestions = [...peopleAlsoAskQuestions, ...questions];
    } catch (err) {
      return res.status(400).json({ data: err.message });
    }
  }
  return res.status(200).json({ data: peopleAlsoAskQuestions });
};

export const GetPeopleAlsoAskQuestionsByURL = async (req, res) => {
  if (!req.body.pages) {
    return res
      .status(400)
      .json({ data: "Please include a keyword in the request." });
  }

  GetPAAFromURL(req.body, req.session.access_token)
    .then((data) => {
      return res.status(200).json({ data });
    })
    .catch((err) => {
      return res.status(400).json({ data: err.message });
    });
};

export const GetLowPickingsKeywords = async (req, res) => {
  return res.status(200).json({ data: "hey there!" });
};

export const GetStrikingDistanceKeywords = async (req, res) => {
  if (!req.body.pages) {
    return res
      .status(400)
      .json({ data: "Please include pages in your request." });
  }

  const pagesToCrawl = req.body.pages.split("\n");

  let strikingDistanceKeywords = [];
  for (let i = 0; i < pagesToCrawl.length; i++) {
    try {
      const keywords = await GetStrikingDistanceTerms(
        pagesToCrawl[i],
        req.session.access_token
      );
      strikingDistanceKeywords = [...strikingDistanceKeywords, ...keywords];
      return res.status(200).json({ data: strikingDistanceKeywords });
    } catch (err) {
      return res.status(500).json({ data: err.message });
    }
  }
};

export const GetAccountSites = async (req, res) => {
  const requestParams = {
    url: `https://searchconsole.googleapis.com/webmasters/v3/sites/`,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${req.session.access_token}`,
      Accept: "application/json",
    },
  };

  try {
    const { data } = await axios(requestParams);
    return res.status(200).json({ data });
  } catch (err) {
    return res.status(400).json({ data: err.message });
  }
};
