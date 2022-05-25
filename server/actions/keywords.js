import axios from "axios";
import axios2 from "axios-https-proxy-fix";
import "dotenv/config";
import {
  calculateDateDifference,
  createPeopleAlsoAskReport,
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
  console.log("reqConfig: ", reqConfig);
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
    resolve(strikingDistanceKeywords);
  });
};

export const CrawlGoogleSERP = async (keyword) => {
  return new Promise((resolve, reject) => {
    const SERP = process.env.SERP_API;
    axios({
      url: SERP,
      method: "GET",
      headers: { "Content-Type": "application/json" },
      params: {
        q: keyword,
        engine: "google",
        api_key: process.env.SERP_API_KEY,
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

export const GetBacklinksReport = async (site, page, access_token) => {
  return new Promise(async (resolve, reject) => {
    let rankingDomains = [];
    try {
      const strikingDistanceKeywords = await GetStrikingDistanceTerms({
        site,
        access_token,
        page,
      });

      console.log(
        `Length of Striking Distance Keywords: ${strikingDistanceKeywords.length}`
      );

      const selectedKeywords = strikingDistanceKeywords.slice(0, 80);
      for (let i = 0; i < selectedKeywords.length; i++) {
        const res = await axios(
          `https://api.semrush.com/`,
          {
            method: "GET",
            params: {
              type: "phrase_organic",
              key: process.env.SEMRUSH_API_KEY,
              phrase: strikingDistanceKeywords[i],
              database: "us",
              display_limit: 10,
            },
          },
          null
        );
        console.log(
          `Length of rankingDomains for ${strikingDistanceKeywords[i]}: ${res.data.length}`
        );
        if (res.data.length > 26) {
          rankingDomains = [
            ...rankingDomains,
            ...transformBacklinksData(res.data),
          ];
        }
      }
      const top5Pages = getTopDomainsFromList(rankingDomains).slice(0, 5);
      const batchComparison = await GetBatchComparison(top5Pages);
      resolve(batchComparison);
    } catch (err) {
      console.log("Error");
      reject(err);
    }
  });
};

export const GetBatchComparison = async (targets) => {
  return new Promise((resolve, reject) => {
    let params = {
      type: "backlinks_comparison",
      key: process.env.SEMRUSH_API_KEY,
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
        const final = await GetDomainAnchorsReport(original);
        for (let i = 0; i < original.length; i++) {
          original[i] = { ...original[i], ...final[i] };
          results.push(original[i]);
        }
        resolve(results);
      })
      .catch(reject);
  });
};

export const GetDomainAnchorsReport = async (urls) => {
  return new Promise(async (resolve, reject) => {
    let reportPerDomain = [];

    try {
      console.log(`Requesting: ${urls.length}`);
      for (let i = 0; i < urls.length; i++) {
        let params = {
          type: "backlinks",
          key: process.env.SEMRUSH_API_KEY,
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
      resolve(reportPerDomain);
    } catch (err) {
      reject(err);
    }
  });
};

export const GetKeywordMSV = async (keyword) => {
  return new Promise(async (resolve, reject) => {
    try {
      let params = {
        type: "phrase_these",
        key: process.env.SEMRUSH_API_KEY,
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
      const msv = transformSEMRushMSVData(res.data);
      resolve(msv["Search Volume"]);
    } catch (err) {
      reject(err);
    }
  });
};

export const GetPeopleAlsoAskQuestionsByKeywords = async (searchTerms) => {
  return new Promise(async (resolve, reject) => {
    let peopleAlsoAskQuestions = [];
    for (let i = 0; i < searchTerms.length; i++) {
      try {
        const questions = await CrawlGoogleSERP(searchTerms[i]);
        const peopleAlsoAsk = await extractQuestions(
          questions.related_questions
        );
        peopleAlsoAskQuestions = [...peopleAlsoAskQuestions, ...peopleAlsoAsk];
      } catch (err) {
        reject(err);
      }
    }
    resolve(peopleAlsoAskQuestions);
  });
};

export const GetPeopleAlsoAskQuestionsByURL = async (pages, reqConfig) => {
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
    for (let i = 0; i < 10; i++) {
      try {
        const questions = await CrawlGoogleSERP(strikingDistanceKeywords[i]);
        if (questions.related_questions) {
          const peopleAlsoAsk = await extractQuestions(
            questions.related_questions
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

export const GetSEMRushKeywords = (page, quantity) => {
  return new Promise((resolve, reject) => {
    const url = `https://api.semrush.com/`;
    const params = {
      type: "url_organic",
      key: process.env.SEMRUSH_API_KEY,
      url: page,
      database: "us",
      display_limit: quantity,
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
        resolve(rows);
      })
      .catch(reject);
  });
};

export const GetFeaturedSnippetsByKeyword = async (keywords) => {
  const keywordList = keywords.split("\n");
  return new Promise(async (resolve, reject) => {
    let featuredSnippets = [];
    try {
      for (let i = 0; i < 10; i++) {
        let obj = {};
        const serp = await CrawlGoogleSERP(keywordList[i]);
        if (serp.answer_box) {
          obj["Keyword"] = keywordList[i];
          obj["MSV"] = await GetKeywordMSV(keywordList[i]);
          obj["URL That Owns It"] = serp.answer_box.link;
          obj["Ranking Text"] = serp.answer_box.snippet;
          featuredSnippets.push(obj);
        }
      }
    } catch (err) {
      reject(err);
    }
    resolve(featuredSnippets);
  });
};

export const GetSERPVideosByKeyword = (keywords) => {
  return new Promise(async (resolve, reject) => {
    const keywordsList = keywords.split("\n");

    let videoSnippets = [];
    try {
      for (let i = 0; i < keywordsList.length; i++) {
        const serp = await CrawlGoogleSERP(keywordsList[i]);
        for (let j = 0; j < serp.organic_results.length; j++) {
          if (serp.organic_results[j].link.includes("youtube.com")) {
            let obj = {};
            obj["Keyword"] = keywordsList[i];
            obj["MSV"] = await GetKeywordMSV(keywordsList[i]);
            obj["URL That Owns It"] = serp.organic_results[j].link;
            obj["Title"] = serp.organic_results[j].title;
            videoSnippets.push(obj);
          }
        }
      }
    } catch (err) {
      reject(err);
    }
    resolve(videoSnippets);
  });
};

export const GenerateWorkbook = (data) => {
  const wb = xlsx.utils.book_new();

  let sheets = [];

  for (let i = 0; i < data.length; i++) {
    let obj = {};
    obj.keyword = data[i];
    sheets.push(obj);
  }

  const ws = xlsx.utils.json_to_sheet(sheets);
  xlsx.utils.book_append_sheet(wb, ws, "Test");

  xlsx.writeFile(wb, "test.xlsx");
  return true;
};
