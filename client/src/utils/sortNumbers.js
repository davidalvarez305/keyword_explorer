export default function sortNumbers(arr, direction, page) {
  let targetArr = [];
  let oldArr = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].page === page) {
      targetArr.push(arr[i]);
    } else {
      oldArr.push(arr[i]);
    }
  }

  targetArr = [...targetArr, ...oldArr];
  return direction ? targetArr.sort((a, b) => a.page === page && b.position - a.position) : targetArr.sort((a, b) => a.page === page && a.position - b.position);
}
