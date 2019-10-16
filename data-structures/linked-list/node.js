export default class LinkNode {
  constructor(value, next = null) {
    this.value = value;
    this.next = next;
  }
  toString() {
    return this.value;
  }
}