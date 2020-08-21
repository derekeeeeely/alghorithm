/*
 * @lc app=leetcode.cn id=53 lang=javascript
 *
 * [53] 最大子序和
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var maxSubArray = function(nums) {
  if (nums.length < 2) {
    return nums[0]
  }
  const newArr = [0, ...nums, 0];
  let count = 0;
  let tmp;
  let start = 0;
  while (start < newArr.length - 1) {
    const c = newArr[start] + newArr[start + 1];
    if (c > 0) {
      tmp = c > (tmp || 0) ? c : (tmp || 0);
      newArr[start + 1] = c;
      count = c;
      start++
    } else {
      count = c;
      if (typeof tmp == 'undefined') {
        tmp = c
      } else {
        tmp = c > tmp ? c : tmp
      }
      start += 2
    }
  }
  return tmp;
};
// @lc code=end

