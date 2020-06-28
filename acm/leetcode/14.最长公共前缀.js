/*
 * @lc app=leetcode.cn id=14 lang=javascript
 *
 * [14] 最长公共前缀
 */

// @lc code=start
/**
 * @param {string[]} strs
 * @return {string}
 */
var longestCommonPrefix = function(strs) {
  if (!strs.length) { return '' }
  var compare2 = (a, b) => {
    let r = ''
    while (a.length && b.length) {
      if (a[0] !== b[0]) {
        break;
      }
      r += a[0];
      a = a.substring(1);
      b = b.substring(1);
    }
    return r
  }
  return strs.reduce((m, n) => {
    return compare2(m, n)
  })
};
// @lc code=end

