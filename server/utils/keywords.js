import { SERP_FEATURES } from "../constants.js";

export const FilterStrikingDistanceKeywords = (rows) => {
  let strikingDistance = [];
  for (let i = 0; i < rows.length; i++) {
    if (rows[i].position <= 15 && rows[i].position >= 6) {
      strikingDistance.push(rows[i].keys[0]);
    }
  }
  return strikingDistance;
};

export const extractQuestions = (arr) => {
  let cleanedQuestions = [];
  for (let i = 0; i < arr.length; i++) {
    const q = arr[i].split("Search for: ")[1];
    cleanedQuestions.push(q);
  }
  return cleanedQuestions;
};

export const getRandomIndex = (limit) =>
  Math.floor(Math.random() * Math.floor(limit));

export const extractSiteFromPage = (page) => {
  const { host } = new URL(page);
  return host;
};

export const calculateDateDifference = (days) => {
  let xDaysAgo = new Date();
  xDaysAgo.setTime(xDaysAgo.getTime() - 24 * 60 * 60 * 1000 * days);
  return xDaysAgo.toISOString().split("T")[0];
};

export const removeDuplicatesAndAppendKeywords = (rows, page) => {
  let keywords = [];
  for (let i = 0; i < rows.length; i++) {
    if (!keywords.includes(rows[i].keys[0])) {
      let kwObj = {};
      kwObj.keyword = rows[i].keys[0];
      kwObj.position = rows[i].position;
      kwObj.impressions = rows[i].impressions;
      kwObj.page = page;
      keywords.push(kwObj);
    }
  }
  return keywords;
};

function parseSERPFeatures(serpFeatures) {
  let ftrs = {};
  let features = serpFeatures.split(",");
  for (let i = 0; i < features.length; i++) {
    if (SERP_FEATURES[features[i]]) {
      ftrs[SERP_FEATURES[features[i]]] = true;
    }
  }
  return ftrs;
}

export const transformSEMRushData = (data) => {
  let rows = [];
  let arr = data.split("\r\n");

  let headers = arr[0].split(";");

  for (let i = 1; i < arr.length - 1; i++) {
    let row = arr[i].split(";");
    let transformed = {};
    for (let n = 0; n < headers.length; n++) {
      transformed[headers[n]] = row[n];
      if (n === 9) {
        transformed = { ...transformed, ...parseSERPFeatures(row[n]) };
        delete transformed["SERP Features"];
      }
    }
    rows.push(transformed);
  }
  return rows;
};
