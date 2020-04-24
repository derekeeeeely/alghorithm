const { LinkList } = require('../linked-list/index.js');

class Queue {
  constructor() {
    this.list = new LinkList();
  }
  enqueue(val) {
    this.list.append(val);
  }
  dequeue() {
    const deletedItem = this.list.deleteHead();
    return deletedItem ? deletedItem.value : null;
  }
}