import { COMMON_THEMES, SERP_FEATURES } from "../constants.js";

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

export const transformSEMRushData = (data) => {
  let rows = [];
  let arr = data.split("\r\n");

  let headers = arr[0].split(";");

  for (let i = 1; i < arr.length - 1; i++) {
    let row = arr[i].split(";");
    let transformed = {};
    for (let n = 0; n < headers.length; n++) {
      transformed[headers[n]] = row[n];
      if (n === 0) {
        transformed = { ...transformed, ...identifyTheme(row[n]) };
      }
      if (n === 9) {
        transformed = { ...transformed, ...parseSERPFeatures(row[n]) };
        delete transformed["SERP Features"];
        delete transformed["Trends"];
      }
    }
    rows.push(transformed);
  }
  return rows;
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
  let rows = [];
  let arr = urls.split("\r\n");
  let headers = arr[0].split(";");
  for (let i = 1; i < arr.length - 1; i++) {
    let row = arr[i].split(";");
    let transformed = {};
    for (let n = 0; n < headers.length; n++) {
      transformed[headers[n]] = row[n];
    }
    rows.push(transformed);
  }

  let data = {};
  const topAnchors = getTopAnchorTexts(rows.map((ea) => ea.anchor));
  const percentages = calculatePercentageOfDA(rows.map((ea) => ea.page_ascore));
  data["Top Anchor Text 1"] = topAnchors[0];
  data["Top Anchor Text 2"] = topAnchors[1];
  data["% of BL < DA 40"] = (percentages[0] * 100).toFixed(2) + "%";
  data["% of BL > DA 40"] = (percentages[1] * 100).toFixed(2) + "%";
  final.push(data);
  return final;
};
