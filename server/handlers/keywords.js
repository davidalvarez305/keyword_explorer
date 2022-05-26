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
import {
  extractSiteFromPage,
  removeDuplicatesAndAppendKeywords,
} from "../utils/keywords.js";
import xlsx from "xlsx";

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
  if (!req.query.pages) {
    return res
      .status(400)
      .json({ data: "Please include pages in your request." });
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
  if (!req.query.pages) {
    return res
      .status(400)
      .json({ data: "Please include a site in your request." });
  }

  const { pages, startDate, endDate } = req.query;
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
  if (!req.query.page) {
    return res
      .status(400)
      .json({ data: "Please include a page in your request." });
  }

  GetSEMRushKeywords(req.query.page)
    .then((data) => {
      return res.status(200).json({ data });
    })
    .catch((err) => {
      return res.status(400).json({ data: err.message });
    });
};

export const SEMRushBacklinksReport = async (req, res) => {
  if (!req.query.page) {
    return res
      .status(400)
      .json({ data: "Please include a page in your request." });
  }

  try {
    const data = await GetBacklinksReport(
      extractSiteFromPage(req.query.page),
      req.query.page,
      req.session.access_token
    );
    return res.status(200).json({ data });
  } catch (err) {
    return res.status(400).json({ data: err.message });
  }
};

export const FeaturedSnippetsByKeyword = async (req, res) => {
  if (!req.query.keywords) {
    return res
      .status(400)
      .json({ data: "Please include keywords in your request." });
  }
  try {
    const data = await GetFeaturedSnippetsByKeyword(req.query.keywords);
    return res.status(200).json({ data });
  } catch (err) {
    return res.status(400).json({ data: err.message });
  }
};

export const SERPVideosByKeyword = async (req, res) => {
  if (!req.query.keywords) {
    return res
      .status(400)
      .json({ data: "Please include keywords in your request." });
  }
  try {
    const data = await GetSERPVideosByKeyword(req.query.keywords);
    return res.status(200).json({ data });
  } catch (err) {
    return res.status(400).json({ data: err.message });
  }
};

export const GeneratePageReport = async (req, res) => {
  const { page, startDate, endDate } = req.query;
  const { access_token } = req.session;
  const reqConfig = {
    access_token,
    startDate,
    endDate,
  };

  try {
    // Universal Results
    const data = await GetKeywordPositionsByURL(page, reqConfig);
    const universalResults = xlsx.utils.json_to_sheet(data);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(
      workbook,
      universalResults,
      "Universal Results"
    );
    console.log("Finished Universal Results...");

    // PAA
    const peopleAlsoAsk = await GetPeopleAlsoAskQuestionsByURL(page, reqConfig);
    const PAA = xlsx.utils.json_to_sheet(peopleAlsoAsk);
    xlsx.utils.book_append_sheet(workbook, PAA, "PAA");
    const strikingDistanceKeywords = await GetStrikingDistanceTerms(
      page,
      reqConfig
    );
    console.log("Finished PAA...");

    // Featured Snippets
    const ftrdSnippets = await GetFeaturedSnippetsByKeyword(
      strikingDistanceKeywords.join("\n")
    );
    const featuredSnippets = xlsx.utils.json_to_sheet(ftrdSnippets);
    xlsx.utils.book_append_sheet(
      workbook,
      featuredSnippets,
      "Featured Snippets"
    );
    console.log("Finished Featured Snippets...");

    // Videos
    const videos = await GetSERPVideosByKeyword(
      strikingDistanceKeywords.join("\n")
    );
    const videosTab = xlsx.utils.json_to_sheet(videos);
    xlsx.utils.book_append_sheet(workbook, videosTab, "Video");
    console.log("Finished Video...");

    // Competitor Backlinks
    const backlinks = await GetBacklinksReport(page, reqConfig);
    const competitorBacklinks = xlsx.utils.json_to_sheet(backlinks);
    xlsx.utils.book_append_sheet(
      workbook,
      competitorBacklinks,
      "Competitor Backlinks"
    );
    console.log("Finished Competitor Backlinks...");

    // Keyword Positions
    const kwPositions = await GetKeywordPositionsByURL(page, reqConfig);
    const keywordPositions = xlsx.utils.json_to_sheet(kwPositions);
    xlsx.utils.book_append_sheet(
      workbook,
      keywordPositions,
      "Keyword Positions"
    );
    console.log("Finished Keyword Positions...");

    xlsx.writeFile(workbook, "Test.xlsx");
  } catch (err) {
    return res.status(400).json({ data: err.message });
  }
  return res.status(200).json({ data: "hey there" });
};
