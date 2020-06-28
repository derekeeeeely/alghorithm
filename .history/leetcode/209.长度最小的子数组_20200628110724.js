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
  if (!nums.length) { return 0 }
  let res = [];
  let tmp = 0;
  nums.reduce((a, b) => {
    if (tmp <= s) {

    }
  })
};
// @lc code=end

