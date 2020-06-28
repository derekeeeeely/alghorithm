const { Heap } = require('./index');


const arr = [1,2,3,4,5,6];

const sort = (arr, type) => {
  const compareFn = (a, b) => type === 'desc' ? a >= b : a <= b;
  const maxHeap = new Heap(compareFn);
  const res = [];
  arr.forEach(element => {
    maxHeap.add(element);
  });
  // console.log(maxHeap.heapContainer)
  // maxHeap.remove(4);
  // console.log(maxHeap.heapContainer)
  while(!maxHeap.isEmpty()) {
    const nextItem = maxHeap.poll();
    res.push(nextItem);
  }
  console.log(res);
}

sort(arr, 'desc');

module.exports = { sort };
