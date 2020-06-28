/*
 * @lc app=leetcode.cn id=209 lang=javascript
 *
 * [209] 长度最小的子数组
 */

// @lc code=start
/**
 * @param {number} s
 * @param {number[]} nums
 * @return {number}
 */
var minSubArrayLen = function(s, nums) {
  let start = 0, end = nums.length;
  const sum = (a, b) => {
    return nums.slice(a, b).reduce((m, n) => return m + n;)
  }
};
// @lc code=end

