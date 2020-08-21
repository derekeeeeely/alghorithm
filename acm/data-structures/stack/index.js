const { LinkList } = require('../linked-list/index.js');

class Queue {
  constructor() {
    this.list = new LinkList();
  }
  push(val) {
    this.list.prepend(val);
  }
  pop() {
    const deletedItem = this.list.deleteHead();
    return deletedItem ? deletedItem.value : null;
  }
}