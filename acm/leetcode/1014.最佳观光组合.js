/*
 * @lc app=leetcode.cn id=1014 lang=javascript
 *
 * [1014] 最佳观光组合
 */

// @lc code=start
/**
 * @param {number[]} A
 * @return {number}
 */
var maxScoreSightseeingPair = function(A) {
  // 暴力解
  // let tmp = 0;
  // for (let i = 0; i < A.length; i++) {
  //   for (let j = i + 1; j < A.length; j++) {
  //     if (A[i] + A[j] + i - j > tmp) {
  //       tmp = A[i] + A[j] + i - j;
  //     }
  //   }
  // }
  // return tmp;
  // 优化 单指针就行了 关键在正整数
  let l = A[0];
  let res = A[0];
  for (let i = 1; i < A.length; i++) {
    l--;
    res = Math.max(res, A[i] + l)
    if (A[i] >= l) {
      l = A[i];
    }
  }
  return res;
};
// @lc code=end

