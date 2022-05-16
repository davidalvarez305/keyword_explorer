import extractImpressionCount from './extractImpressionCount';
import extractPosition from './extractPosition';

export default function createImpressionsMatrix(data, pages, keywords) {
  let matrix = Array(keywords.length).fill().map(() => Array(pages.length).fill());
  for (let i = 0; i < keywords.length; i++) {
    for (let n = 0; n < pages.length; n++) {
        matrix[i][1] = extractImpressionCount(data, keywords[i], pages[n]);
        matrix[i][n + 1] = extractPosition(data, keywords[i], pages[n]);
    }
  }
  console.log(matrix);
  return matrix;
}