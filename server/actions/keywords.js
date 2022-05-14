import axios from "axios";
import "dotenv/config";
import { FilterStrikingDistanceKeywords } from "../utils/keywords.js";

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
