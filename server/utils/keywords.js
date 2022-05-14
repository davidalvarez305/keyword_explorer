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

export const getRandomIndex = (limit) => Math.floor(Math.random() * Math.floor(limit));