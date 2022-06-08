import axios from "axios";
import "dotenv/config";
import {
  calculateDateDifference,
  calculateDomainAuthorityReport,
  createPeopleAlsoAskReport,
  createSEMRushKeywordsReport,
  extractQuestions,
  extractSiteFromPage,
  FilterStrikingDistanceKeywords,
  getTopDomainsFromList,
  removeDuplicatesAndAppendKeywords,
  transformBacklinksAnchorsReport,
  transformBacklinksData,
  transformBatchComparisonData,
  transformSEMRushMSVData,
} from "../utils/keywords.js";
import xlsx from "xlsx";
import path from "path";

export const QueryGoogleKeywordPlanner = (query, token) => {
  const route = `https://googleads.googleapis.com/v10/customers/${GOOGLE_CUSTOMER_ID}:generateKeywordIdeas`;
  const { data } = query;
  const requestParams = {
    url: route,
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "developer-token": `${GOOGLE_DEVELOPER_TOKEN}`,
      "Content-Type": "application/json",
    },
    data,
  };

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      axios(requestParams)
        .then((data) => {
          resolve(data.data);
        })
        .catch((e) => {
          reject(e);
        });
    }, 1000);
  });
};

export const RequestKeywords = async ({
  site,
  access_token,
  page,
  startDate,
  endDate,
}) => {
  let currentDate = new Date();
  const today = currentDate.toISOString().split("T")[0];
  const minus30Days = calculateDateDifference(30);

  const requestParams = {
    url: `https://searchconsole.googleapis.com/webmasters/v3/sites/https%3A%2F%2F${site}/searchAnalytics/query?key=${process.env.API_KEY}`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
      Accept: "application/json",
    },
    data: {
      startDate: startDate ? startDate : minus30Days,
      endDate: endDate ? endDate : today,
      dimensions: ["query"],
      dimensionFilterGroups: [
        {
          filters: [
            {
              dimension: "PAGE",
              expression: page,
              operator: "CONTAINS",
            },
          ],
        },
      ],
      rowLimit: 5000,
    },
  };

  let keywords = [];
  return new Promise((resolve, reject) => {
    axios(requestParams)
      .then((data) => {
        if (data.data.rows) {
          keywords = [...data.data.rows];
        }
        console.log(
          `Successfully returned ${keywords.length} keywords from Search Console...`
        );
        resolve(keywords);
      })
      .catch((err) => {
        console.error("Error requesting keywords: ", err.message);
        if (err.message === "Request failed with status code 403") {
          reject(err);
        }
        resolve(keywords);
      });
  });
};

export const GetKeywordPositionsByURL = (pages, reqConfig) => {
  const pageList = pages.split("\n");
  return new Promise(async (resolve, reject) => {
    let keywordsArray = [];
    for (let i = 0; i < pageList.length; i++) {
      const config = {
        site: extractSiteFromPage(pageList[i]),
        page: pageList[i],
        access_token: reqConfig.access_token,
        startDate: reqConfig.startDate,
        endDate: reqConfig.endDate,
      };

      try {
        const keywords = await RequestKeywords(config);
        keywordsArray = [
          ...keywordsArray,
          ...removeDuplicatesAndAppendKeywords(keywords, pageList[i]),
        ];
      } catch (err) {
        reject(err);
      }
    }
    resolve(keywordsArray);
  });
};
export const GetStrikingDistanceTerms = async (pages, reqConfig) => {
  const pagesToCrawl = pages.split("\n");
  return new Promise(async (resolve, reject) => {
    let strikingDistanceKeywords = [];

    for (let i = 0; i < pagesToCrawl.length; i++) {
      const config = {
        site: extractSiteFromPage(pagesToCrawl[i]),
        page: pagesToCrawl[i],
        access_token: reqConfig.access_token,
        startDate: reqConfig.startDate,
        endDate: reqConfig.endDate,
      };
      try {
        const keywords = await RequestKeywords(config);
        strikingDistanceKeywords = [
          ...FilterStrikingDistanceKeywords(keywords),
        ];
      } catch (err) {
        reject(err);
      }
    }
    console.log(
      `Successfully returned ${strikingDistanceKeywords.length} striking distance keywords from Search Console...`
    );
    resolve(strikingDistanceKeywords);
  });
};

export const CrawlGoogleSERP = async (keyword, serp_api_key) => {
  return new Promise((resolve, reject) => {
    const SERP = process.env.SERP_API;
    axios({
      url: SERP,
      method: "GET",
      headers: { "Content-Type": "application/json" },
      params: {
        q: keyword,
        engine: "google",
        api_key: serp_api_key,
        device: "mobile",
      },
    })
      .then((data) => {
        resolve(data.data);
      })
      .catch(reject);
  });
};

export const GetPAAFromURL = async (body, access_token) => {
  return new Promise(async (resolve, reject) => {
    const pagesToCrawl = body.pages.split("\n");
    let keywords = [];

    for (let i = 0; i < pagesToCrawl.length; i++) {
      const config = {
        site: extractSiteFromPage(pagesToCrawl[i]),
        page: pagesToCrawl[i],
        access_token: access_token,
        startDate: body.startDate,
        endDate: body.endDate,
      };

      try {
        const extractedKeywords = await GetStrikingDistanceTerms(config);
        keywords = [...keywords, ...extractedKeywords];
      } catch (err) {
        console.log(err.message);
        reject(err);
      }
    }

    let peopleAlsoAskQuestions = [];
    console.log(`Crawling ${keywords.length} striking distance keywords.`);
    for (let i = 0; i < keywords.length; i++) {
      try {
        const questions = await CrawlGoogleSERP(keywords[i]);
        const peopleAlsoAsk = extractQuestions(questions.related_questions);
        peopleAlsoAskQuestions = [...peopleAlsoAskQuestions, ...peopleAlsoAsk];
      } catch (err) {
        reject(err);
      }
    }
    resolve(peopleAlsoAskQuestions);
  });
};

export const GetBacklinksReport = async (
  strikingDistanceKeywords,
  semrush_api_key
) => {
  return new Promise(async (resolve, reject) => {
    let rankingDomains = [];
    try {
      const selectedKeywords = strikingDistanceKeywords.slice(0, 80);
      for (let i = 0; i < selectedKeywords.length; i++) {
        const res = await axios(
          `https://api.semrush.com/`,
          {
            method: "GET",
            params: {
              type: "phrase_organic",
              key: semrush_api_key,
              phrase: strikingDistanceKeywords[i],
              database: "us",
              display_limit: 10,
            },
          },
          null
        );
        console.log(
          `Length of Backlinks for ${strikingDistanceKeywords[i]}: ${res.data.length}`
        );
        if (res.data.length > 26) {
          rankingDomains = [
            ...rankingDomains,
            ...transformBacklinksData(res.data),
          ];
        }
      }
      const top5Pages = getTopDomainsFromList(rankingDomains).slice(0, 5);
      const batchComparison = await GetBatchComparison(
        top5Pages,
        semrush_api_key
      );
      console.log(`Resolving batch comparison...`);
      resolve(batchComparison);
    } catch (err) {
      console.log("Error generating backlinks report: ", err.message);
      reject(err);
    }
  });
};

export const GetBatchComparison = async (targets, semrush_api_key) => {
  return new Promise((resolve, reject) => {
    let params = {
      type: "backlinks_comparison",
      key: semrush_api_key,
      targets: targets,
      target_types: [],
      export_columns: "target,target_type,ascore,backlinks_num,domains_num",
    };

    for (let i = 0; i < targets.length; i++) {
      params["target_types"] = [...params["target_types"], "url"];
    }

    axios(
      `https://api.semrush.com/analytics/v1/`,
      {
        method: "GET",
        params: params,
      },
      null
    )
      .then(async ({ data }) => {
        let results = [];
        const original = transformBatchComparisonData(data);
        const final = await GetDomainAnchorsReport(original, semrush_api_key);
        for (let i = 0; i < original.length; i++) {
          original[i] = { ...original[i], ...final[i] };
          results.push(original[i]);
        }
        resolve(results);
      })
      .catch(reject);
  });
};

export const GetDomainAnchorsReport = async (urls, semrush_api_key) => {
  return new Promise(async (resolve, reject) => {
    let reportPerDomain = [];

    try {
      for (let i = 0; i < urls.length; i++) {
        let params = {
          type: "backlinks",
          key: semrush_api_key,
          target: urls[i]["Target"],
          target_type: urls[i]["Target Type"],
          export_columns: "page_ascore,anchor,external_num,internal_num",
          display_limit: urls[i]["No. of Backlinks"],
        };

        const res = await axios(
          `https://api.semrush.com/analytics/v1/`,
          {
            method: "GET",
            params: params,
          },
          null
        );

        reportPerDomain = [
          ...reportPerDomain,
          ...transformBacklinksAnchorsReport(res.data),
        ];
      }

      let domainScoreReport = [];
      for (let i = 0; i < urls.length; i++) {
        let params = {
          type: "backlinks_refdomains",
          key: semrush_api_key,
          target: urls[i]["Target"],
          target_type: urls[i]["Target Type"],
          export_columns: "domain_ascore",
          display_limit: urls[i]["No. of Backlinks"],
        };

        const res = await axios(
          `https://api.semrush.com/analytics/v1/`,
          {
            method: "GET",
            params: params,
          },
          null
        );

        domainScoreReport = [
          ...domainScoreReport,
          ...calculateDomainAuthorityReport(res.data),
        ];
      }

      let finalReport = [];
      for (let i = 0; i < reportPerDomain.length; i++) {
        finalReport.push({ ...reportPerDomain[i], ...domainScoreReport[i] });
      }
      resolve(finalReport);
    } catch (err) {
      reject(err);
    }
  });
};

export const GetKeywordMSV = async (keyword, semrush_api_key) => {
  return new Promise(async (resolve, reject) => {
    try {
      let params = {
        type: "phrase_these",
        key: semrush_api_key,
        phrase: keyword,
        database: "us",
        export_columns: "Ph,Nq",
      };

      const res = await axios(
        `https://api.semrush.com/`,
        {
          method: "GET",
          params: params,
        },
        null
      );
      const msv = transformSEMRushMSVData(res.data)[0];
      resolve(msv["Search Volume"]);
    } catch (err) {
      reject(err);
    }
  });
};

export const GetPeopleAlsoAskQuestionsByKeywords = async (
  searchTerms,
  serp_api_key,
  semrush_api_key
) => {
  return new Promise(async (resolve, reject) => {
    let peopleAlsoAskQuestions = [];
    for (let i = 0; i < searchTerms.length; i++) {
      try {
        const questions = await CrawlGoogleSERP(searchTerms[i], serp_api_key);
        const peopleAlsoAsk = await extractQuestions(
          questions.related_questions,
          semrush_api_key
        );
        peopleAlsoAskQuestions = [...peopleAlsoAskQuestions, ...peopleAlsoAsk];
      } catch (err) {
        reject(err);
      }
    }
    resolve(peopleAlsoAskQuestions);
  });
};

export const GetPeopleAlsoAskQuestionsByURL = async (
  pages,
  reqConfig,
  serp_api_key,
  semrush_api_key
) => {
  const pageList = pages.split("\n");
  return new Promise(async (resolve, reject) => {
    let strikingDistanceKeywords = [];
    for (let i = 0; i < pageList.length; i++) {
      const config = {
        site: extractSiteFromPage(pageList[i]),
        page: pageList[i],
        access_token: reqConfig.access_token,
        startDate: reqConfig.startDate,
        endDate: reqConfig.endDate,
      };

      try {
        const extractedKeywords = await GetStrikingDistanceTerms(
          pageList[i],
          config
        );
        strikingDistanceKeywords = [
          ...strikingDistanceKeywords,
          ...extractedKeywords,
        ];
      } catch (err) {
        reject(err);
      }
    }

    let peopleAlsoAskQuestions = [];
    for (let i = 0; i < strikingDistanceKeywords.length; i++) {
      try {
        const questions = await CrawlGoogleSERP(
          strikingDistanceKeywords[i],
          serp_api_key
        );
        if (questions.related_questions) {
          const peopleAlsoAsk = await extractQuestions(
            questions.related_questions,
            semrush_api_key
          );
          peopleAlsoAskQuestions = [
            ...peopleAlsoAskQuestions,
            ...peopleAlsoAsk,
          ];
        }
      } catch (err) {
        reject(err);
      }
    }

    const data = createPeopleAlsoAskReport(peopleAlsoAskQuestions);
    resolve(data);
  });
};

export const GetSEMRushKeywords = (page, semrush_api_key) => {
  return new Promise((resolve, reject) => {
    const url = `https://api.semrush.com/`;
    const params = {
      type: "url_organic",
      key: semrush_api_key,
      url: page,
      database: "us",
      display_limit: 500,
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
        const rows = createSEMRushKeywordsReport(data.data);
        resolve(rows);
      })
      .catch(reject);
  });
};

export const GetFeaturedSnippetsByKeyword = async (
  keywords,
  serp_api_key,
  semrush_api_key
) => {
  const keywordList = keywords.split("\n");
  return new Promise(async (resolve, reject) => {
    let featuredSnippets = [];
    try {
      for (let i = 0; i < keywordList.length; i++) {
        let obj = {};
        const serp = await CrawlGoogleSERP(keywordList[i], serp_api_key);
        if (serp.answer_box) {
          obj["Keyword"] = keywordList[i];
          obj["MSV"] = await GetKeywordMSV(keywordList[i], semrush_api_key);
          obj["URL That Owns It"] = serp.answer_box.link;
          obj["Ranking Text"] = serp.answer_box.snippet;
          console.log(`Returning featured snippets for ${keywordList[i]}.`);
          featuredSnippets.push(obj);
        }
      }
    } catch (err) {
      console.log(`Error fetching Featured Snippets: `, err.message);
      reject(err);
    }
    console.log(
      `Successfully extracted ${featuredSnippets.length} Featured Snippets.`
    );
    resolve(featuredSnippets);
  });
};

export const GetSERPVideosByKeyword = (
  keywords,
  serp_api_key,
  semrush_api_key
) => {
  return new Promise(async (resolve, reject) => {
    const keywordsList = keywords.split("\n");

    let videoSnippets = [];
    try {
      for (let i = 0; i < keywordsList.length; i++) {
        const serp = await CrawlGoogleSERP(keywordsList[i], serp_api_key);
        for (let j = 0; j < serp.organic_results.length; j++) {
          if (serp.organic_results[j].link.includes("youtube.com")) {
            let obj = {};
            obj["Keyword"] = keywordsList[i];
            obj["MSV"] = await GetKeywordMSV(keywordsList[i], semrush_api_key);
            obj["URL That Owns It"] = serp.organic_results[j].link;
            obj["Title"] = serp.organic_results[j].title;
            console.log(`Returning videos for ${keywordsList[i]}.`);
            videoSnippets.push(obj);
          }
        }
      }
    } catch (err) {
      console.log(`Error fetching Video Snippets: `, err.message);
      reject(err);
    }
    console.log(
      `Successfully extracted ${videoSnippets.length} Video Snippets.`
    );
    resolve(videoSnippets);
  });
};

export const GenerateWorkbook = async (
  page,
  reqConfig,
  semrush_api_key,
  serp_api_key
) => {
  // Striking Distance Keywords
  console.log("Getting striking distance keywords...");
  const strikingDistanceKeywords = await GetStrikingDistanceTerms(
    page,
    reqConfig
  );

  // Universal Results
  const data = await GetSEMRushKeywords(page, semrush_api_key);
  const universalResults = xlsx.utils.json_to_sheet(data);
  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, universalResults, "Universal Results");
  console.log("Finished Universal Results...");

  // SERP Features
  const { featuredSnippets, videoSnippets, peopleAlsoAsk } =
    await GetSERPSnippetsAndVideos(
      strikingDistanceKeywords.join("\n"),
      serp_api_key,
      semrush_api_key
    );

  // PAA
  const PAA = xlsx.utils.json_to_sheet(peopleAlsoAsk);
  xlsx.utils.book_append_sheet(workbook, PAA, "PAA");
  console.log("Finished PAA...");

  // Featured Snippets
  const ftrdSnippets = xlsx.utils.json_to_sheet(featuredSnippets);
  xlsx.utils.book_append_sheet(workbook, ftrdSnippets, "Featured Snippets");
  console.log("Finished Featured Snippets...");

  // Videos
  const videosTab = xlsx.utils.json_to_sheet(videoSnippets);
  xlsx.utils.book_append_sheet(workbook, videosTab, "Video");
  console.log("Finished Video...");

  // Competitor Backlinks
  const backlinks = await GetBacklinksReport(
    strikingDistanceKeywords,
    semrush_api_key
  );
  const competitorBacklinks = xlsx.utils.json_to_sheet(backlinks);
  xlsx.utils.book_append_sheet(
    workbook,
    competitorBacklinks,
    "Competitor Backlinks"
  );
  console.log("Finished Competitor Backlinks...");

  // Create file in path;
  const pagePath = new URL(page);
  const pathname = pagePath.pathname.split("/");
  const fileName = pathname[pathname.length - 1];
  const filePath = path.resolve("reports", `${fileName}.xlsx`);
  console.log(`File path: ${filePath}`);
  xlsx.writeFile(workbook, filePath);

  return filePath;
};

export const GetSERPSnippetsAndVideos = (
  keywords,
  serp_api_key,
  semrush_api_key
) => {
  const keywordList = keywords.split("\n");
  return new Promise(async (resolve, reject) => {
    let featuredSnippets = [];
    let videoSnippets = [];
    let peopleAlsoAsk = [];
    let relatedQuestions = [];
    try {
      await keywordList.map(async (index, keyword) => {
        console.log(
          `Getting data for Keyword #${index + 1} of ${
            keywordList.length
          }: ${keyword}`
        );
        let obj = {};
        const serp = await CrawlGoogleSERP(keyword, serp_api_key);
        const keywordSearchVolume = await GetKeywordMSV(
          keyword,
          semrush_api_key
        );
        if (serp.answer_box) {
          obj["Keyword"] = keyword;
          obj["MSV"] = keywordSearchVolume;
          obj["URL That Owns It"] = serp.answer_box.link;
          obj["Ranking Text"] = serp.answer_box.snippet;
          featuredSnippets.push(obj);
        }
        if (serp.related_questions) {
          relatedQuestions = [...relatedQuestions, ...serp.related_questions];
        }
        for (let j = 0; j < serp.organic_results.length; j++) {
          if (serp.organic_results[j].link.includes("youtube.com")) {
            let obj = {};
            obj["Keyword"] = keyword;
            obj["MSV"] = keywordSearchVolume;
            obj["URL That Owns It"] = serp.organic_results[j].link;
            obj["Title"] = serp.organic_results[j].title;
            videoSnippets.push(obj);
          }
        }
      });
      const questions = await Promise.all(relatedQuestions);
      if (questions.length > 0) {
        const PAA = await extractQuestions(questions, semrush_api_key);
        let data = createPeopleAlsoAskReport(PAA);
        peopleAlsoAsk = data;
      }
    } catch (err) {
      console.log(`Error fetching SERP Snippets: `, err);
      reject(err);
    }
    const ftrdSnippets = await Promise.all(featuredSnippets);
    const vidSnippets = await Promise.all(videoSnippets);
    console.log(
      `Successfully extracted ${ftrdSnippets.length} Featured Snippets.`
    );
    console.log(`Successfully extracted ${vidSnippets.length} Video Snippets.`);
    resolve({
      featuredSnippets: ftrdSnippets,
      videoSnippets: vidSnippets,
      peopleAlsoAsk,
    });
  });
};
