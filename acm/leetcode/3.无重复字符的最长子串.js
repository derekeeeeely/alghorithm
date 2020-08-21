/*
 * @lc app=leetcode.cn id=3 lang=javascript
 *
 * [3] 无重复字符的最长子串
 */

// @lc code=start
/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function (s) {
  let i = 0;
  let tmp = '';
  let res = '';
  while (i < s.length) {
    if (!tmp.includes(s[i])) {
      tmp += s[i];
    } else {
      if (res.length < tmp.length) {
        res = tmp;
      }
      const reg = `(?<=${s[i]})(\\w*)`;
      tmp = tmp.match(new RegExp(reg))[0];
      tmp += s[i];
    }
    i++;
  }
  return res.length > tmp.length ? res.length : tmp.length;
};
// @lc code=end

