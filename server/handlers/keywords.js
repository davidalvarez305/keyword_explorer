import {
  RequestKeywords,
  GetStrikingDistanceTerms,
  GetBacklinksReport,
  GenerateWorkbook,
  GetPeopleAlsoAskQuestionsByKeywords,
  GetPeopleAlsoAskQuestionsByURL,
  GetSEMRushKeywords,
  GetFeaturedSnippetsByKeyword,
  GetSERPVideosByKeyword,
  GetKeywordPositionsByURL,
} from "../actions/keywords.js";
import { extractSiteFromPage } from "../utils/keywords.js";

export const GetKeywordsFromURL = async (req, res) => {
  if (!req.body.page) {
    return res
      .status(400)
      .json({ data: "Please include a site in your request." });
  }

  const config = {
    site: extractSiteFromPage(req.body.page),
    page: req.body.page,
    access_token: req.session.access_token,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
  };

  try {
    const data = await RequestKeywords(config);
    return res.status(200).json({ data });
  } catch (err) {
    return res.status(400).json({ data: err.message });
  }
};

export const PeopleAlsoAskByKeywords = async (req, res) => {
  if (!req.query.keywords || !req.session.serp_api_key) {
    return res.status(400).json({ data: "Bad request." });
  }
  const searchTerms = req.query.keywords.split("\n");

  try {
    const data = await GetPeopleAlsoAskQuestionsByKeywords(
      searchTerms,
      req.session.serp_api_key
    );
    return res.status(200).json({ data });
  } catch (err) {
    return res.status(400).json({ data: err.message });
  }
};

export const PeopleAlsoAskByURL = async (req, res) => {
  if (!req.query.pages || !req.session.serp_api_key) {
    return res.status(400).json({ data: "Bad request." });
  }
  const pages = req.query.pages.split("\n");

  const { startDate, endDate } = req.query;
  const { access_token, serp_api_key } = req.session;

  try {
    const data = await GetPeopleAlsoAskQuestionsByURL(
      pages,
      { access_token, startDate, endDate },
      serp_api_key
    );
    return res.status(200).json({ data });
  } catch (err) {
    return res.status(400).json({ data: err.message });
  }
};

export const StrikingDistance = async (req, res) => {
  if (!req.query.pages) {
    return res.status(400).json({ data: "Bad request." });
  }

  const { pages, startDate, endDate } = req.query;
  const { access_token } = req.session;

  try {
    const data = await GetStrikingDistanceTerms(pages, {
      access_token,
      startDate,
      endDate,
    });
    return res.status(200).json({ data });
  } catch (err) {
    return res.status(500).json({ data: err.message });
  }
};

export const KeywordPositionsByURL = async (req, res) => {
  if (!req.body.pages) {
    return res.status(400).json({ data: "Bad request." });
  }

  const { pages, startDate, endDate } = req.body;
  const { access_token } = req.session;

  try {
    const data = await GetKeywordPositionsByURL(pages, {
      access_token,
      startDate,
      endDate,
    });
    return res.status(200).json({ data });
  } catch (err) {
    return res.status(400).json({ data: err.message });
  }
};

export const SEMRushKeywords = async (req, res) => {
  if (!req.query.page || !req.session.semrush_api_key) {
    return res.status(400).json({ data: "Bad request." });
  }

  GetSEMRushKeywords(req.query.page, req.session.semrush_api_key)
    .then((data) => {
      return res.status(200).json({ data });
    })
    .catch((err) => {
      return res.status(400).json({ data: err.message });
    });
};

export const SEMRushBacklinksReport = async (req, res) => {
  if (!req.query.page || !req.session.semrush_api_key) {
    return res.status(400).json({ data: "Bad request." });
  }

  const { page, startDate, endDate } = req.query;
  const { access_token, semrush_api_key } = req.session;

  try {
    const strikingDistanceKeywords = await GetStrikingDistanceTerms(page, {
      access_token,
      startDate,
      endDate,
    });
    const data = await GetBacklinksReport(
      strikingDistanceKeywords,
      semrush_api_key
    );
    return res.status(200).json({ data });
  } catch (err) {
    return res.status(400).json({ data: err.message });
  }
};

export const FeaturedSnippetsByKeyword = async (req, res) => {
  if (
    !req.query.keywords ||
    !req.session.serp_api_key ||
    !req.session.semrush_api_key
  ) {
    return res.status(400).json({ data: "Bad request." });
  }
  try {
    const { serp_api_key, semrush_api_key } = req.session;
    const data = await GetFeaturedSnippetsByKeyword(
      req.query.keywords,
      serp_api_key,
      semrush_api_key
    );
    return res.status(200).json({ data });
  } catch (err) {
    return res.status(400).json({ data: err.message });
  }
};

export const SERPVideosByKeyword = async (req, res) => {
  if (
    !req.query.keyword ||
    !req.session.serp_api_key ||
    !req.session.semrush_api_key
  ) {
    return res.status(400).json({ data: "Bad request." });
  }
  try {
    const { serp_api_key, semrush_api_key } = req.session;
    const data = await GetSERPVideosByKeyword(
      req.query.keywords,
      serp_api_key,
      semrush_api_key
    );
    return res.status(200).json({ data });
  } catch (err) {
    return res.status(400).json({ data: err.message });
  }
};

export const GeneratePageReport = async (req, res) => {
  if (
    !req.query.page ||
    !req.session.serp_api_key ||
    !req.session.semrush_api_key
  ) {
    return res.status(400).json({ data: "Bad request." });
  }
  const { page, startDate, endDate } = req.query;
  const { access_token, semrush_api_key, serp_api_key } = req.session;
  const reqConfig = {
    access_token,
    startDate,
    endDate,
  };

  try {
    const path = await GenerateWorkbook(
      page,
      reqConfig,
      semrush_api_key,
      serp_api_key
    );
    return res.sendFile(path, (error) => {
      if (error) {
        return res.status(400).json({ data: error.message });
      }
    });
  } catch (err) {
    return res.status(400).json({ data: err.message });
  }
};
