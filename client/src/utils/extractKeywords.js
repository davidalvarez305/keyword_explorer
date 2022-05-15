export default function extractKeywords(keywords) {
  let kws = [];
  for (let i = 0; i < keywords.length; i++) {
    if (!kws.includes(keywords[i].keyword)) {
      kws.push(keywords[i].keyword);
    }
  }
  return kws;
}
