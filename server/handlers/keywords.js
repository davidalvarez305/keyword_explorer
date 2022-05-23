import axios from "axios";
import {
  CrawlGoogleSERP,
  RequestKeywords,
  GetPAAFromURL,
  GetStrikingDistanceTerms,
  GetBacklinksReport,
} from "../actions/keywords.js";
import {
  extractQuestions,
  extractSiteFromPage,
  removeDuplicatesAndAppendKeywords,
  transformSEMRushData,
} from "../utils/keywords.js";

export const GetKeywordsFromURL = async (req, res) => {
  if (!req.body.page) {
    return res
      .status(400)
      .json({ data: "Please include a site in your request." });
  }

  const config = {
    site: extractSiteFromPage(req.body.page),
    page: req.body.page,
    accessToken: req.session.access_token,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
  };

  RequestKeywords(config)
    .then((keywords) => {
      return res.status(200).json({ data: keywords });
    })
    .catch((err) => {
      return res.status(400).json({ data: err.message });
    });
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
      const peopleAlsoAsk = extractQuestions(questions.related_questions);
      peopleAlsoAskQuestions = [...peopleAlsoAskQuestions, ...peopleAlsoAsk];
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
    const config = {
      site: extractSiteFromPage(pagesToCrawl[i]),
      page: pagesToCrawl[i],
      accessToken: req.session.access_token,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
    };

    try {
      const keywords = await GetStrikingDistanceTerms(config);
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

export const GetKeywordPositionsByURL = async (req, res) => {
  if (!req.body.pages) {
    return res
      .status(400)
      .json({ data: "Please include a site in your request." });
  }

  let keywordsArray = [];
  for (let i = 0; i < req.body.pages.length; i++) {
    const config = {
      site: extractSiteFromPage(req.body.pages[i]),
      page: req.body.pages[i],
      accessToken: req.session.access_token,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
    };

    try {
      const keywords = await RequestKeywords(config);
      keywordsArray = [
        ...keywordsArray,
        ...removeDuplicatesAndAppendKeywords(keywords, req.body.pages[i]),
      ];
    } catch (err) {
      return res.status(400).json({ data: err.message });
    }
  }

  return res.status(200).json({ data: keywordsArray });
};

export const GetSEMRushKeywordReport = async (req, res) => {
  if (!req.body.page) {
    return res
      .status(400)
      .json({ data: "Please include a page in your request." });
  }

  const url = `https://api.semrush.com/`;
  const params = {
    type: "url_organic",
    key: process.env.SEMRUSH_API_KEY,
    url: req.body.page,
    database: "us",
    display_limit: req.body.quantity,
  };

  axios(
    url,
    {
      method: "GET",
      params: params,
    },
    null
  )
    .then((data) => {
      const rows = transformSEMRushData(data.data);
      return res.status(200).json(rows);
    })
    .catch((err) => {
      return res.status(400).json({ data: err.message });
    });
};

export const GetSEMRushBacklinksReport = async (req, res) => {
  if (!req.body.page) {
    return res
      .status(400)
      .json({ data: "Please include a page in your request." });
  }

  GetBacklinksReport(
    extractSiteFromPage(req.body.page),
    req.body.page,
    req.session.access_token
  )
    .then((data) => {
      return res.status(200).json(data);
    })
    .catch((err) => {
      return res.status(400).json({ data: err.message });
    });
};
