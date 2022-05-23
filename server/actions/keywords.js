import axios from "axios";
import axios2 from "axios-https-proxy-fix";
import "dotenv/config";
import {
  calculateDateDifference,
  extractQuestions,
  extractSiteFromPage,
  FilterStrikingDistanceKeywords,
  getRandomIndex,
  getTopDomainsFromList,
  transformBacklinksAnchorsReport,
  transformBacklinksData,
  transformBatchComparisonData,
  transformSEMRushMSVData,
} from "../utils/keywords.js";
import * as cheerio from "cheerio";
import { userAgents } from "../utils/userAgents.js";

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
  accessToken,
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
      Authorization: `Bearer ${accessToken}`,
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
        console.error(err.message);
        if (err.message === "Request failed with status code 403") {
          reject(err);
        }
        resolve(keywords);
      });
  });
};

export const GetStrikingDistanceTerms = async ({
  site,
  accessToken,
  page,
  startDate,
  endDate,
}) => {
  return new Promise((resolve, reject) => {
    RequestKeywords({ site, accessToken, page, startDate, endDate })
      .then((keywords) => {
        let strikingDistanceKeywords = [];
        strikingDistanceKeywords = [
          ...FilterStrikingDistanceKeywords(keywords),
        ];
        resolve(strikingDistanceKeywords);
      })
      .catch(reject);
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

export const GetPAAFromURL = async (body, accessToken) => {
  return new Promise(async (resolve, reject) => {
    const pagesToCrawl = body.pages.split("\n");
    let keywords = [];

    for (let i = 0; i < pagesToCrawl.length; i++) {
      const config = {
        site: extractSiteFromPage(pagesToCrawl[i]),
        page: pagesToCrawl[i],
        accessToken: accessToken,
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

export const GetBacklinksReport = async (site, page, accessToken) => {
  return new Promise(async (resolve, reject) => {
    let rankingDomains = [];
    try {
      const strikingDistanceKeywords = await GetStrikingDistanceTerms({
        site,
        accessToken,
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
