export default function extractPages(rows) {
  let pages = [];
  for (let i = 0; i < rows.length; i++) {
    if (!pages.includes(rows[i].page)) {
      pages.push(rows[i].page);
    }
  }
  return pages;
}
