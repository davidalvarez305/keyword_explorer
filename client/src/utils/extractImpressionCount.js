export default function extractImpressionCount(data, keyword, page) {
  let impressions = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i].keyword === keyword && data[i].page === page) {
      impressions = data[i].impressions;
    }
  }
  return impressions;
}
