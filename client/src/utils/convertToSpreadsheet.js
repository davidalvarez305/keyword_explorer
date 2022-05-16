import createMatrix from './createMatrix';
import extractKeywords from './extractKeywords';
import extractPages from './extractPages';

export default function convertToSpreadsheet(keywords) {
  let rows = [];
  rows.push('Keyword');
  const pages = extractPages(keywords);
  rows = [[...rows, ...pages]];
  const kws = extractKeywords(keywords);
  const matrix = createMatrix(keywords, pages, kws);
  for (let i = 0; i < kws.length; i++) {
    let row = [];
    row.push(kws[i]);
    row = [...row, ...matrix[i]];
    rows.push(row);
  }
  return rows;
}
