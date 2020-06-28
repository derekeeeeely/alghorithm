/*
 * @lc app=leetcode id=8 lang=javascript
 *
 * [8] String to Integer (atoi)
 */

// @lc code=start
/**
 * @param {string} str
 * @return {number}
 */
var myAtoi = function(str) {
  const max = Math.pow(2, 31) - 1
  const min = -Math.pow(2, 31)
  const unsafe = x => x > max || x < min
  let res;
  str.trim().replace(/^(-|\+|\d)(\d*)/, (m, $1, $2) => {
    res = $1 + '' + $2
  })
  if (Number.isNaN(+res)) { return 0 }
  if (!unsafe(+res)) { return +res }
  return +res > 0 ? max : min
};
// @lc code=end

