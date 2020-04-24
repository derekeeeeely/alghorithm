class Node {
  constructor(value, prev = null, next = null) {
    this.value = value;
    this.prev = prev;
    this.next = next;
  }
  toString() {
    return this.value;
  }
}

class DoublyLinkList {
  constructor() {
    this.head = this.tail = null;
  }
  append(val) {
    const node = new Node(val);
    if (!this.head) {
      this.head = this.tail = node;
      return this;
    }
    this.tail.next = node;
    node.prev = this.tail;
    this.tail = node;
    return this;
  }
  prepend(val) {
    const node = new Node(val);
    node.next = this.head;
    if (this.head) {
      this.head.prev = node;
    }
    this.head = node;
    if (!this.tail) {
      this.tail = node;
    }
    return this;
  }
  find() {
    // 同普通链表
  }
  delete() {

  }
  reverse() {
    let prevNode = null;
    let nextNode = null;
    let cursor = this.head;
    if (!cursor) { return this; }
    while (cursor) {
      nextNode = cursor.next; // store reference
      prevNode = cursor.prev;

      cursor.next = prevNode; // loop main step
      cursor.prev = nextNode;

      prevNode = cursor; // change position
      cursor = nextNode; // change position to loop
    }
    this.tail = this.head;
    this.head = prevNode; // prevNode refer to origin tail
  }
}