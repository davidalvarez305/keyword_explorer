import axios from "axios";
import axios2 from "axios-https-proxy-fix";
import "dotenv/config";
import {
  extractQuestions,
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

export const GetStrikingDistanceTerms = async (site, accessToken) => {
  const requestParams = {
    url: `https://searchconsole.googleapis.com/webmasters/v3/sites/https%3A%2F%2F${site}/searchAnalytics/query?key=${process.env.API_KEY}`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
    data: {
      startDate: "2022-04-01",
      endDate: "2022-05-01",
      dimensions: ["query"],
    },
  };

  let strikingDistanceKeywords = [];

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      axios(requestParams)
        .then((data) => {
          strikingDistanceKeywords = [
            ...FilterStrikingDistanceKeywords(data.data.rows),
          ];
          resolve(strikingDistanceKeywords);
        })
        .catch((err) => {
          reject(err);
        });
    }, 1000);
  });
};

export const CrawlGoogleSERP = async (keyword) => {
  console.log(keyword)
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
