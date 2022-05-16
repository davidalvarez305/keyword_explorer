import createMatrix from './createMatrix';
import extractKeywords from './extractKeywords';
import extractPages from './extractPages';
import highestImpressionCount from './highestImpressionCount';

export default function convertToSpreadsheet(keywords) {
  let rows = [];
  rows.push('Keyword');
  rows.push('Impressions');
  const pages = extractPages(keywords);
  rows = [[...rows, ...pages]];
  const kws = extractKeywords(keywords);
  const matrix = createMatrix(keywords, pages, kws);
  for (let i = 0; i < kws.length; i++) {
    let row = [];
    row.push(kws[i]);
    row.push(highestImpressionCount(keywords, kws[i], pages));
    row = [...row, ...matrix[i]];
    rows.push(row);
  }
  return rows;
}
