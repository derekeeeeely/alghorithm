/*
 * @lc app=leetcode.cn id=24 lang=javascript
 *
 * [24] 两两交换链表中的节点
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
 * @return {ListNode}
 */
var swapPairs = function(head) {

  var node2Arr = (node) => {
    var m = []
    while (node) {
      m.push(node.val)
      node = node.next
    }
    return m
  }


  var arrl = node2Arr(head)

  console.log(arrl)

  var arr2Node = (arr, node) => {
    item = arr.shift();
    if (arr.length) {
      node.val = item;
      node.next = arr2Node(arr, {});
      return node
    } else {
      return { val: item, next: null }
    }
  }

  if (!arrl.length) { return null }
  if (arrl.length == 1) {
    return arr2Node(arrl)
  }

  for (let i = 0; i < arrl.length; i = i + 2) {
    if (typeof arrl[i + 1] !== 'undefined') {
      let tmp
      tmp = arrl[i + 1]
      arrl[i + 1] = arrl[i]
      arrl[i] = tmp
    }
  }
  var res = arr2Node(arrl, {})
  return res
};
// @lc code=end

