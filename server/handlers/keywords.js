import axios from "axios";
import {
  CrawlGoogleSERP,
  RequestKeywords,
  GetPAAFromURL,
  GetStrikingDistanceTerms,
  GetBacklinksReport,
  GetKeywordMSV,
  GenerateWorkbook,
  GetPeopleAlsoAskQuestionsByKeywords,
  GetPeopleAlsoAskQuestionsByURL,
} from "../actions/keywords.js";
import {
  createPeopleAlsoAskReport,
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

  try {
    const data = await RequestKeywords(config);
    return res.status(200).json({ data });
  } catch (err) {
    return res.status(400).json({ data: err.message });
  }
};

export const PeopleAlsoAskByKeywords = async (req, res) => {
  if (!req.query.keywords) {
    return res
      .status(400)
      .json({ data: "Please include a keyword in the request." });
  }
  const searchTerms = req.query.keywords.split("\n");

  try {
    const data = await GetPeopleAlsoAskQuestionsByKeywords(searchTerms);
    return res.status(200).json({ data });
  } catch (err) {
    return res.status(400).json({ data: err.message });
  }
};

export const PeopleAlsoAskByURL = async (req, res) => {
  if (!req.query.pages) {
    return res
      .status(400)
      .json({ data: "Please include pages in the request." });
  }
  const pages = req.query.pages.split("\n");

  try {
    const data = await GetPeopleAlsoAskQuestionsByURL(pages);
    return res.status(200).json({ data });
  } catch (err) {
    return res.status(400).json({ data: err.message });
  }
};

export const StrikingDistance = async (req, res) => {
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
      GenerateWorkbook(strikingDistanceKeywords);
      return res.status(200).json({ data: strikingDistanceKeywords });
    } catch (err) {
      return res.status(500).json({ data: err.message });
    }
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

export const GetFeaturedSnippetsByKeyword = async (req, res) => {
  if (!req.body.keywords) {
    return res
      .status(400)
      .json({ data: "Please include keywords in your request." });
  }

  const keywords = req.body.keywords.split("\n");

  let featuredSnippets = [];
  try {
    for (let i = 0; i < keywords.length; i++) {
      let obj = {};
      const serp = await CrawlGoogleSERP(keywords[i]);
      obj["Keyword"] = keywords[i];
      obj["MSV"] = await GetKeywordMSV(keywords[i]);
      obj["URL That Owns It"] = serp.answer_box.link;
      obj["Ranking Text"] = serp.answer_box.snippet;
      featuredSnippets.push(obj);
    }
  } catch (err) {
    return res.status(400).json({ data: err.message });
  }
  return res.status(200).json({ data: featuredSnippets });
};

export const GetSERPVideosByKeyword = async (req, res) => {
  if (!req.body.keywords) {
    return res
      .status(400)
      .json({ data: "Please include keywords in your request." });
  }

  const keywords = req.body.keywords.split("\n");

  let videoSnippets = [];
  try {
    for (let i = 0; i < keywords.length; i++) {
      const serp = await CrawlGoogleSERP(keywords[i]);
      for (let j = 0; j < serp.organic_results.length; j++) {
        if (serp.organic_results[j].link.includes("youtube.com")) {
          let obj = {};
          obj["Keyword"] = keywords[i];
          obj["MSV"] = await GetKeywordMSV(keywords[i]);
          obj["URL That Owns It"] = serp.organic_results[j].link;
          obj["Title"] = serp.organic_results[j].title;
          videoSnippets.push(obj);
        }
      }
    }
  } catch (err) {
    return res.status(400).json({ data: err.message });
  }
  return res.status(200).json({ data: videoSnippets });
};

export const GeneratePageReport = async (req, res) => {
  console.log(req);
  const page = req.query.page;
  return res.status(200).json({ data: page });
};
