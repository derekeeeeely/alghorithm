/*
 * @lc app=leetcode id=7 lang=javascript
 *
 * [7] Reverse Integer
 */

// @lc code=start
/**
 * @param {number} x
 * @return {number}
 */
var reverse = function(x) {
  if (x >= Math.pow(2, 31) || x + Math.pow(2, 31) < 0) {
    return 0
  }
  const res = (x+'').replace('-','').split('').reverse().join('');
  if (+res >= Math.pow(2, 31) || +res + Math.pow(2, 31) < 0) {
    return 0
  }
  return x > 0 ? +res : -(+res)
};
// @lc code=end

