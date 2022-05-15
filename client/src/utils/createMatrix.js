import extractPosition from './extractPosition';

export default function createMatrix(data, pages, keywords) {
  let matrix = Array(keywords.length).fill().map(() => Array(pages.length).fill());
  for (let i = 0; i < keywords.length; i++) {
    for (let n = 0; n < pages.length; n++) {
        matrix[i][n] = extractPosition(data, keywords[i], pages[n]);
    }
  }
  return matrix;
}
