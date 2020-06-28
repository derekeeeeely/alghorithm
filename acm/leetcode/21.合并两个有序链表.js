/*
 * @lc app=leetcode.cn id=21 lang=javascript
 *
 * [21] 合并两个有序链表
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
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var mergeTwoLists = function(l1, l2) {
  let head
  let left
  let right
  if (!l1) {
    return l2
  }
  if (!l2) {
    return l1
  }
  if (l1.val >= l2.val) {
    head = { val: l2.val, next: null }
    left = l1
    right = l2.next
  } else {
    head = { val: l1.val, next: null }
    left = l1.next
    right = l2
  }
  let node = head
  while (left || right) {
    if (!left) {
      node.next = right;
      right = right.next;
    } else if (!right) {
      node.next = left;
      left = left.next;
    } else if (left.val >= right.val) {
      node.next = right;
      right = right.next;
    } else {
      node.next = left;
      left = left.next;
    }

    node = node.next;
  }
  return head
};
// @lc code=end

