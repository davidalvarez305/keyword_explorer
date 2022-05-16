export default function highestImpressionCount(data, keyword, pages) {
  let impressions = [];
  for (let i = 0; i < data.length; i++) {
    for (let n = 0; n < pages.length; n++) {
      if (data[i].keyword === keyword && data[i].page === pages[n]) {
        impressions = [...impressions, data[i].impressions];
      }
    }
  }
  return impressions.sort((a, b) => b - a)[0];
}
