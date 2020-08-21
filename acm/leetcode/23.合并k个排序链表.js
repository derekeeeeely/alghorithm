/*
 * @lc app=leetcode.cn id=23 lang=javascript
 *
 * [23] 合并K个排序链表
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
 * @param {ListNode[]} lists
 * @return {ListNode}
 */
var mergeKLists = function(lists) {
  if (!lists.length) { return null }
  const node2Arr = (node) => {
    const arr = []
    while (node) {
      arr.push(node.val);
      node = node.next
    }
    return arr
  }
  const arr2Node = (arr, node) => {
    item = arr.shift();
    if (arr.length) {
      node.val = item;
      node.next = arr2Node(arr, {});
      return node
    } else {
      return { val: item, next: null }
    }
  }

  const slists = lists.map(node2Arr)
  const sorted = Array.prototype.concat.apply([], slists).sort((a, b) => a -b)
  if (!sorted.length) { return null }
  return arr2Node(sorted, {})
};
// @lc code=end

