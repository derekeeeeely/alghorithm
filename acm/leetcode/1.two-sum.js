/*
 * @lc app=leetcode id=1 lang=javascript
 *
 * [1] Two Sum
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
	const r = []
	const obj = {}
	for (let i = 0; i < nums.length; i++) {
		const it = nums[i];
		if (typeof obj[target - it] !== 'undefined') {
			r.push(obj[target - it]);
			r.push(i);
			return r
		}
		obj[it] = i;
	}
};
// @lc code=end

