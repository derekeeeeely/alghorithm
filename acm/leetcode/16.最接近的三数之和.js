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
  let res
  let ll = Math.pow(2, 31) - 1;
  for (let i = 0; i < snums.length; i++) {
    const item = snums[i];
    let start = i + 1;
    let end = snums.length - 1;
    while (start < end) {
      const sum = snums[start] + snums[end] + item
      const dis = Math.abs(sum - target)
      if (dis < ll) {
        ll = dis
        res = sum
        if (sum > target) {
          end--
        } else {
          start++
        }
      } else if (sum > target) {
        end--
      } else {
        start++
      }
    }
  }
  return res
};
// @lc code=end

