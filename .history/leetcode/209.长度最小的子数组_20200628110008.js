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
  let start = 0, end = nums.length - 1;
  const sum = (a, b) => {
    return nums.slice(a, b + 1).reduce((m, n) => m + n)
  }
  while (sum(start, end) > s) {
    if (s[start] > s[end]) {
      end--
    } else {
      start++
    }
  }
  if (sum(start, end) == s) {
    return end - start + 1;
  }
  console.log(start, end);
  return end - start + 2;
};
// @lc code=end

