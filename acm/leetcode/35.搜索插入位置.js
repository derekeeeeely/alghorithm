/*
 * @lc app=leetcode.cn id=35 lang=javascript
 *
 * [35] 搜索插入位置
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var searchInsert = function(nums, target) {
  let flag = 1;
  let res;
  for (let i = 0; i < nums.length; i++) {
    const item = nums[i];
    if (item < target) {
      flag = -1;
    } else if (item == target) {
      res = i;
      flag = 0;
      break;
    } else if (item > target) {
      if (flag < 0) {
        res = i;
        flag = 1;
        break;
      } else {
        res = 0;
        break;
      }
    }
  }
  return flag < 0 ? nums.length : res;
};
// @lc code=end

