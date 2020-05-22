/*
 * @lc app=leetcode id=2 lang=javascript
 *
 * [2] Add Two Numbers
 */

// @lc code=start
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var addTwoNumbers = function(l1, l2) {
	let l3;
	let flag = 0;
	let tail;
	while(l1 || l2 || flag) {
		const l1val = l1 ? l1.val : 0;
		const l2val = l2 ? l2.val : 0;
		const val = (l1val + l2val + flag) % 10;
		flag = l1val + l2val + flag >= 10 ? 1 : 0;
		const node = new ListNode(val);
		if (!tail) {
			l3 = node;
			tail = l3;
		} else {
			tail.next = node;
		}
		tail = node;
		l1 = l1 && l1.next;
		l2 = l2 && l2.next;
	}
	return l3
};
// @lc code=end

