class Heap {
  constructor(compareFn) {
    this.heapContainer = [];
    this.compareFn = compareFn;
  }
  swap(idx1, idx2) {
    let tmp = this.heapContainer[idx1];
    this.heapContainer[idx1] = this.heapContainer[idx2];
    this.heapContainer[idx2] = tmp;
  }
  parent(childIndex) {
    return this.heapContainer[this.getParentIndex(childIndex)];
  }
  hasParent(childIndex) {
    return this.getParentIndex(childIndex) >= 0;
  }
  getParentIndex(childIndex) {
    return Math.floor((childIndex - 1) / 2);
  }
  leftChild(parentIndex) {
    return this.heapContainer[this.getLeftChildIndex(parentIndex)]
  }
  hasLeftChild(parentIndex) {
    return this.getLeftChildIndex(parentIndex) < this.heapContainer.length;
  }
  getLeftChildIndex(parentIndex) {
    return (2 * parentIndex) + 1;
  }
  rightChild(parentIndex) {
    return this.heapContainer[this.getRightChildIndex(parentIndex)]
  }
  hasRightChild(parentIndex) {
    return this.getRightChildIndex(parentIndex) < this.heapContainer.length;
  }
  getRightChildIndex(parentIndex) {
    return (2 * parentIndex) + 2;
  }
  heapifyUp(cursor) { // 生成大|小顶 堆
    let idx = cursor || this.heapContainer.length - 1;
    while (this.hasParent(idx) && this.compareFn(this.heapContainer[idx], this.parent(idx))) {
      this.swap(idx, this.getParentIndex(idx));
      idx = this.getParentIndex(idx);
    }
  }
  heapifyDown(cursor) { // 将最后一个叶子换到根以后 比较该叶子和孩子 一旦发生交还则继续往下 保证生成新的 大顶 堆
    let currentIdx = cursor || 0;
    let nextIdx = null;
    while (this.hasLeftChild(currentIdx)) {
      if (this.hasRightChild(currentIdx) && this.compareFn(this.rightChild(currentIdx), this.leftChild(currentIdx))) {
        nextIdx = this.getRightChildIndex(currentIdx);
      } else {
        nextIdx = this.getLeftChildIndex(currentIdx);
      }
      if (this.compareFn(this.heapContainer[currentIdx], this.heapContainer[nextIdx])) {
        break; // 如果不需要交换，则直接结束
      }
      this.swap(currentIdx, nextIdx);
      currentIdx = nextIdx;
    }
  }
  add(val) { // arr.map(add) 生成的堆 父节点 永远大于 子节点
    this.heapContainer.push(val);
    this.heapifyUp();
    return this;
  }
  poll() {
    if (!this.heapContainer.length) {
      return null
    }
    if (this.heapContainer.length === 1) {
      return this.heapContainer.pop();
    }
    const item = this.heapContainer[0];
    this.heapContainer[0] = this.heapContainer.pop(); // 交换大顶和最末
    this.heapifyDown();
    return item; // 返回大顶
  }
  find(val) {
    return this.heapContainer.findIndex((i) => { return i === val });
  }
  remove(val) {
    const idx = this.find(val);
    this.heapContainer[idx] = this.heapContainer.pop(); // 交换最末一个到 删除位置
    if (this.hasLeftChild(idx) && (!this.hasParent(idx) || this.compareFn(this.parent(idx), this.heapContainer[idx]))) { // 仅仅这一个节点有问题 判断是up还是down
      this.heapifyDown(idx);
    } else {
      this.heapifyUp(idx);
    }
    return this;
  }
  isEmpty() {
    return !this.heapContainer.length;
  }
}

module.exports = { Heap }