/*
 * @lc app=leetcode.cn id=22 lang=javascript
 *
 * [22] 括号生成
 */

// @lc code=start
/**
 * @param {number} n
 * @return {string[]}
 */
var generateParenthesis = function(n) {
  var res = []
  var go = (l, r, s) => {
    if (l > r) return
    if (l === 0 && r === 0) {
      res.push(s);
      return;
    }
    if (l > 0) go(l - 1, r, s + '(')
    if (r > 0) go(l, r - 1, s + ')')
  }
  go(n, n, '')
  return res;
};
// @lc code=end

