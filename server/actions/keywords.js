import axios from "axios";
import axios2 from "axios-https-proxy-fix";
import "dotenv/config";
import {
  calculateDateDifference,
  extractQuestions,
  extractSiteFromPage,
  FilterStrikingDistanceKeywords,
  getRandomIndex,
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
        console.error(err);
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
  const search = keyword.split(" ").join("+");
  const SERP = `https://www.google.com/search?q=${search}`;

  return new Promise(async (resolve, reject) => {
    try {
      const sessionId = (1000000 * Math.random()) | 0;
      const { data } = await axios2.get(SERP, {
        headers: {
          "User-Agent": userAgents[getRandomIndex(userAgents.length)],
        },
        proxy: {
          host: process.env.P_HOST,
          port: process.env.P_PORT,
          auth: {
            username: process.env.P_USERNAME + sessionId,
            password: process.env.P_PASSWORD,
          },
        },
      });
      const $ = cheerio.load(data);
      const box = $(".ULSxyf").text();
      let questions = [];
      const crawledQuestions = box.match(/Search for: [a-zA-Z ']+/gm);
      if (crawledQuestions) {
        questions = [...crawledQuestions];
      }
      resolve(extractQuestions(questions));
    } catch (err) {
      reject(err);
    }
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
        peopleAlsoAskQuestions = [...peopleAlsoAskQuestions, ...questions];
      } catch (err) {
        reject(err);
      }
    }
    resolve(peopleAlsoAskQuestions);
  });
};
