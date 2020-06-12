/*
 * @lc app=leetcode.cn id=31 lang=javascript
 *
 * [31] 下一个排列
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {void} Do not return anything, modify nums in-place instead.
 */
var nextPermutation = function(nums) {
  function swap(i, j) {
    let temp = nums[i];
    nums[i] = nums[j];
    nums[j] = temp;
  }
  for (let i = nums.length - 1; i > 0; i--) {
  let j = i - 1;
  while (j > 0 && nums[j] >= nums[i]) {
    j--;
  }
  if (nums[j] < nums[i]) {
    swap(i, j)
  }
}
return nums.reverse();
};
// @lc code=end

