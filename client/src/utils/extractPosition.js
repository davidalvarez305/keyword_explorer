export default function extractPosition(data, keyword, page) {
  let position = 0;
  for (let i = 0; i < data.length; i++) {
    if (data[i].keyword === keyword && data[i].page === page) {
      position = data[i].position;
    }
  }
  return position.toFixed(2);
}
