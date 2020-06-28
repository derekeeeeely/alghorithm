/*
 * @lc app=leetcode.cn id=739 lang=javascript
 *
 * [739] 每日温度
 */

// @lc code=start
/**
 * @param {number[]} T
 * @return {number[]}
 */
var dailyTemperatures = function(T) {
  const res = []
  for (let i = 0; i < T.length; i++) {
    const ti = T[i];
    let j = i + 1;
    while (j < T.length && T[j] <= ti) {
      j++
    }
    res[i] = j === T.length ? 0 : j - i
  }
  return res;
};
// @lc code=end

