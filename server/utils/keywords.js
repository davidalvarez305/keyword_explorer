export const FilterStrikingDistanceKeywords = (rows) => {
  let strikingDistance = [];
  for (let i = 0; i < rows.length; i++) {
    if (rows[i].position <= 15 && rows[i].position >= 6) {
      strikingDistance.push(rows[i].keys[0]);
    }
  }
  return strikingDistance;
};
