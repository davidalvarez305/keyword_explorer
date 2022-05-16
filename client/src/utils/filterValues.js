export default function filterValues(arr, key) {
  let filtered = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].keyword.includes(key)) {
      filtered.push(arr[i]);
    }
  }
  return filtered;
}
