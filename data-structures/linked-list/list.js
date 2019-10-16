import LinkNode from './node';

export default class LinkList {
  constructor() {
    this.head = null;
    this.tail = null;
  }
  append(value) {
    const newNode = new LinkNode(value);
    if (!this.tail) {
      this.head = this.tail = newNode;
      return this;
    }
    this.tail.next = newNode;
    this.tail = newNode;
    return this;
  }
  prepend(value) {

  }
  delete(value) {

  }
  find(value) {

  }
  traverse() {

  }
  reverse() {

  }
}