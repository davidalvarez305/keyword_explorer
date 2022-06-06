import { GetKeywordMSV } from "../actions/keywords.js";
import { COMMON_THEMES, SERP_FEATURES } from "../constants.js";

export const FilterStrikingDistanceKeywords = (rows) => {
  const sorted = rows.sort((a, b) => b.impressions - a.impressions);
  let strikingDistance = [];
  for (let i = 0; i < sorted.length; i++) {
    if (sorted[i].position <= 15 && sorted[i].position >= 6) {
      strikingDistance.push(sorted[i].keys[0]);
    }
  }
  return strikingDistance;
};

export const extractQuestions = async (arr, semrush_api_key) => {
  let cleanedQuestions = [];

  for (let i = 0; i < arr.length; i++) {
    let obj = {};
    obj["PAA"] = arr[i].question;
    obj["MSV"] = await GetKeywordMSV(arr[i].question, semrush_api_key);
    obj["URL That Owns It"] = arr[i].link;
    obj["Ranking Text"] = arr[i].snippet;
    obj["Header"] = arr[i].title;
    cleanedQuestions.push(obj);
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

function extractSEMRushData(data) {
  let rows = [];
  let arr = data.split("\r\n");
  let headers = arr[0].split(";");
  let length = arr.length <= 2 ? arr.length : arr.length - 1;

  for (let i = 1; i < length; i++) {
    let row = arr[i].split(";");
    let transformed = {};
    for (let n = 0; n < headers.length; n++) {
      transformed[headers[n]] = row[n];
    }
    rows.push(transformed);
  }
  return rows;
}

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

function identifyTheme(keyword) {
  let theme = { Theme: "" };
  for (let i = 0; i < COMMON_THEMES.length; i++) {
    if (keyword.includes(COMMON_THEMES[i])) {
      theme.Theme = COMMON_THEMES[i];
      return theme;
    }
  }
  return theme;
}

export const createSEMRushKeywordsReport = (data) => {
  const rows = extractSEMRushData(data);

  let final = [];
  for (let i = 0; i < rows.length; i++) {
    const { ["SERP Features"]: serpFeatures, Trends, ...item } = rows[i];
    final.push({
      ...identifyTheme(item.Keyword),
      ...item,
      ...parseSERPFeatures(serpFeatures),
    });
  }
  return final;
};

export const getTopDomainsFromList = (listOfDomains) => {
  let topDomains = [];
  let map = {};
  for (let i = 0; i < listOfDomains.length; i++) {
    if (!map[listOfDomains[i]]) {
      map[listOfDomains[i]] = 1;
    } else {
      map[listOfDomains[i]] = map[listOfDomains[i]] += 1;
    }
  }

  const sorted = Object.fromEntries(
    Object.entries(map).sort(([, a], [, b]) => {
      return b - a;
    })
  );

  topDomains = Object.keys(sorted);
  return topDomains;
};

export const transformBacklinksData = (backlinks) => {
  let rows = [];
  let arr = backlinks.split("\r\n");
  for (let i = 1; i < arr.length; i++) {
    rows.push(arr[i].split(";")[1]);
  }
  return rows;
};

export const transformBatchComparisonData = (domains) => {
  let rows = [];
  let arr = domains.split("\r\n");
  let headers = [
    "Target",
    "Target Type",
    "Authority Score",
    "No. of Backlinks",
    "No. of Referring Domains",
  ];
  for (let i = 1; i < arr.length - 1; i++) {
    let row = arr[i].split(";");
    let transformed = {};
    for (let n = 0; n < headers.length; n++) {
      transformed[headers[n]] = row[n];
    }
    rows.push(transformed);
  }
  return rows;
};

function calculatePercentageOfDA(scores) {
  let percentages = [];
  let countBelow40 = 0;
  for (let i = 0; i < scores.length; i++) {
    if (scores[i] <= 40) {
      countBelow40 += 1;
    }
  }
  percentages[0] = countBelow40 / scores.length;
  percentages[1] = 1 - percentages[0];
  return percentages;
}

function getTopAnchorTexts(anchors) {
  let topAnchors = [];
  let map = {};
  for (let i = 0; i < anchors.length; i++) {
    if (!map[anchors[i]]) {
      map[anchors[i]] = 1;
    } else {
      map[anchors[i]] = map[anchors[i]] += 1;
    }
  }

  const sorted = Object.fromEntries(
    Object.entries(map).sort(([, a], [, b]) => {
      return b - a;
    })
  );

  topAnchors = Object.keys(sorted);
  return topAnchors.slice(0, 2);
}

export const transformBacklinksAnchorsReport = (urls) => {
  let final = [];
  const rows = extractSEMRushData(urls);

  let data = {};
  const topAnchors = getTopAnchorTexts(rows.map((ea) => ea.anchor));
  data["Top Anchor Text 1"] = topAnchors[0];
  data["Top Anchor Text 2"] = topAnchors[1];
  final.push(data);
  return final;
};

export const calculateDomainAuthorityReport = (data) => {
  let scores = [];
  const rows = extractSEMRushData(data);

  let results = {};
  const percentages = calculatePercentageOfDA(
    rows.map((ea) => ea.domain_ascore)
  );
  results["% of BL < DA 40"] = (percentages[0] * 100).toFixed(2) + "%";
  results["% of BL > DA 40"] = (percentages[1] * 100).toFixed(2) + "%";
  scores.push(results);
  return scores;
};

function isPAAIncluded(arr, key) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i]["PAA"] === key) {
      return true;
    }
  }
  return false;
}

export const createPeopleAlsoAskReport = (data) => {
  let results = [];
  for (let i = 0; i < data.length; i++) {
    let obj = { ...data[i], Repeats: 0 };
    for (let j = 0; j < data.length; j++) {
      if (data[i]["PAA"] === data[j]["PAA"]) {
        obj.Repeats += 1;
      }
    }
    if (!isPAAIncluded(results, obj["PAA"])) {
      results.push(obj);
    }
  }
  return results;
};

export const transformSEMRushMSVData = (data) => {
  if (data.includes("ERROR 50 :: NOTHING FOUND")) {
    return [{ "Search Volume": 0 }];
  }

  return extractSEMRushData(data);
};
