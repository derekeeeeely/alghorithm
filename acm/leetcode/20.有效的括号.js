/*
 * @lc app=leetcode.cn id=20 lang=javascript
 *
 * [20] 有效的括号
 */

// @lc code=start
/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function(s) {
  if (!s) { return true }
  var match = (a, b) => {
    return (a == '(' && b == ')') || (a == '[' && b == ']') || (a == '{' && b == '}')
  }
  var left = [];
  var right = [];
  for (const i of s) {
    if (~['(','[','{'].indexOf(i)) {
      left.push(i)
    } else {
      right.push(i)
    }
    if (right.length > left.length) {
      return false
    } else if (left.length > right.length && right.length == 0) {
      continue
    } else {
      if (!match(left.pop(), right.shift())) {
        return false
      }
      continue
    }
  }
  return left.length == right.length
};
// @lc code=end

