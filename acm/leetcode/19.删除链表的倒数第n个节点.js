/*
 * @lc app=leetcode.cn id=19 lang=javascript
 *
 * [19] 删除链表的倒数第N个节点
 */

// @lc code=start
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} head
 * @param {number} n
 * @return {ListNode}
 */
var removeNthFromEnd = function(head, n) {
  if (!head.next) {
    return null
  }
  let node = head;
  node.parent = null;
  let idx = 0;
  while (node.next) {
    node.next.parent = node;
    node = node.next;
  }
  while (node) {
    if (++idx == n) {
      if (node.parent) {
        node.parent.next = node.next
      } else {
        return node.next;
      }
    }
    node = node.parent
  }
  return head
};
// @lc code=end

