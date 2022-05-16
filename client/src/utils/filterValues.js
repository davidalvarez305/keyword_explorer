export default function filterValues(arr, key) {
  console.log(arr);
  let filtered = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].keyword.includes(key)) {
      filtered.push(arr[i]);
    }
  }
  return filtered;
}
