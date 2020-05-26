/*
 * @lc app=leetcode.cn id=15 lang=javascript
 *
 * [15] 三数之和
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var threeSum = function(nums) {
  const snums = nums.sort((a, b) => a - b);
  const res = []
  const obj = {}
  if (nums.length < 3) { return [] }
  if (nums.reduce((m,n) => m <= n ? m : n) > 0) {
    return []
  }
  if (!nums.reduce((m, n) => m > n ? m : n) < 0) {
    return []
  }
  if (!nums.find(i => i)) {
    return [[0,0,0]]
  }
  for (let i = 0; i < snums.length; i++) {
    const item = snums[i];
    let start = i + 1;
    let end = snums.length - 1;
    while(start < end) {
      if (snums[start] + snums[end] + item > 0) {
        end--
      } else if (snums[start] + snums[end] + item < 0) {
        start++
      } else {
        if (!obj[`${snums[start]}_${item}`]) {
          res.push([snums[start], item, snums[end]]);
          obj[`${snums[start]}_${item}`] = 1;
        }
        start++
        end--
      }
    }
  }

  return res;
};
// @lc code=end

