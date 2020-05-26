/*
 * @lc app=leetcode.cn id=16 lang=javascript
 *
 * [16] 最接近的三数之和
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var threeSumClosest = function(nums, target) {
  const snums = nums.sort((a, b) => a - b)
  for (let i = 0; i < snums.length; i++) {
    const item = snums[i];
    let start = 0;
    let end = snums.length - 1;
    while (start < end) {

    }
  }
};
// @lc code=end

