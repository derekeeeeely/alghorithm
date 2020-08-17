var swap = (arr, i, j) => {
  const tmp = arr[i];
  arr[i] = arr[j];
  arr[j] = tmp;
}

var a = [1,3,5,10,25,62,13,24,11,3,12,111,-10];

// 冒泡
var bubble = (arr, dir) => {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] > arr[j]) { swap(arr, i, j) }
    }
  }
  return arr;
}

// 选择
var select = (arr) => {
  for (let i = 0; i < arr.length; i++) {
    let idx = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] > arr[j]) { idx = j };
    }
    swap(arr, i, idx);
  }
  return arr;
}

// 插入


// 堆排

// 快排

console.log(bubble(a));
console.log(select(a));


