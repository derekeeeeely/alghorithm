class Node {
  constructor(value, next = null) {
    this.value = value;
    this.next = next;
  }
  toString() {
    return this.value;
  }
}

class LinkList {
  constructor() {
    this.head = null;
    this.tail = null;
  }
  append(val) {
    const node = new Node(val);
    if (!this.head) {
      this.head = node;
      this.tail = node;
      return this;
    }
    this.tail.next = node;
    this.tail = node;
    return this;
  }
  prepend(val) {
    const node = new Node(val);
    node.next = this.head;
    this.head = node;
    if (!this.tail) {
      this.tail = node;
    }
    return this;
  }
  delete(val) {
    let cursor = this.head;
    if (!cursor) { return this };
    if (cursor.value === val) {
      this.head = cursor.next;
      return this;
    }
    while (cursor.next) {
      if (cursor.next.value === val) {
        cursor.next = cursor.next.next;
        break;
      }
      cursor = cursor.next;
    }
    return this;
  }
  find(val) {
    let cursor = this.head;
    let index = 1;
    let find = false;
    if (!cursor) { return -1 };
    if (cursor && cursor.value === val) { return 0 };
    while (cursor.next) {
      if (cursor.next.value === val) {
        find = true;
        break;
      }
      cursor = cursor.next;
      index++;
    }
    return find ? index : -1;
  }
  traverse() {
    let current = this.head;
    while (current) {
      console.log(current.value);
      current = current.next;
    }
  }
  reverse() {
    let prevNode = null;
    let nextNode = null;
    let cursor = this.head;
    if (!cursor) { return this; }
    while (cursor) {
      nextNode = cursor.next; // store reference

      cursor.next = prevNode; // loop main step

      prevNode = cursor; // change position
      cursor = nextNode; // change position to loop
    }
    this.tail = this.head;
    this.head = prevNode; // prevNode refer to origin tail
  }
}

module.exports = { Node, LinkList }