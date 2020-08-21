/*
 * @lc app=leetcode.cn id=11 lang=javascript
 *
 * [11] 盛最多水的容器
 */

// @lc code=start
/**
 * @param {number[]} height
 * @return {number}
 */
var maxArea = function(height) {
  // const compare  = (a, b) => {
  //   return a < b ? a : b;
  // }
  // let res = [0, 1]
  // let count = compare(height[0], height[1])
  // for (let i = 2; i < height.length; i++) {
  //   for (let j =0; j < i; j++) {
  //     const s = compare(height[i], height[j]) * (i - j)
  //     if (s > count) {
  //       count = s;
  //     }
  //   }
  // }
  // return count;
  // 优化
  let start = 0;
  let end = height.length - 1;
  let max = 0;
  while (start < end) {
    max = Math.max(Math.min(height[start], height[end]) * (end - start), max);
    if (height[start] > height[end]) {
      // 移动矮的那个，因为移动高的一定会变小
      end--
    } else {
      start++
    }
  }
  return max
};
// @lc code=end

