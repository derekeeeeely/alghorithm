/*
 * @lc app=leetcode id=10 lang=javascript
 *
 * [10] Regular Expression Matching
 */

// @lc code=start
/**
 * @param {string} s
 * @param {string} p
 * @return {boolean}
 */
var isMatch = function (s, p) {
  if (!p[0]) { return !s[0] }
  const first = !!(s[0] && (s[0] === p[0] || p[0] === '.'))
  if (p.length >= 2 && p[1] === '*') {
    // 首字母匹配 s递归    首字母不匹配 p递归
    return isMatch(s, p.substring(2)) || (first && isMatch(s.substring(1), p))
  } else {
    return first && isMatch(s.substring(1), p.substring(1))
  }
};
// @lc code=end

