/*
 * @lc app=leetcode.cn id=238 lang=javascript
 *
 * [238] 除自身以外数组的乘积
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {number[]}
 */
var productExceptSelf = function(nums) {
  // const zlist = nums.filter(i => !i);
  // let res = [];
  // if (zlist.length > 1) {
  //   return nums.fill(0)
  // } else if (zlist.length == 1) {
  //   res = nums.map(_ => 0);
  //   const i = nums.findIndex(_ => !_);
  //   res[i] = nums.map(_ => _ ? _ : 1).reduce((m, n) => m * n)
  //   return res
  // }
  // // 没有0
  // res[0] = nums.reduce((m, n) => m * n) / nums[0]
  // for (let i = 1; i < nums.length; i++) {
  //   const item = nums[i];
  //   res[i] = res[i - 1] * nums[i - 1] / nums[i];
  // }
  // return res;
  // 一左一右 两个循环 方向相反
  // res[i] 计算 发生的 时间是间隔开的，这个概念注意下，逻辑上连续，空间连续，时间不一定连续
  let res = []
  let left = 1
  let right = 1
  for (let i = 0; i < nums.length; i++) {
    res[i] = left;
    left *= nums[i];
  }
  for (let j = nums.length - 1; j >= 0; j--) {
    res[j] *= right;
    right *= nums[j];
  }
  return res
};
// @lc code=end

