/*
 * @lc app=leetcode.cn id=17 lang=javascript
 *
 * [17] 电话号码的字母组合
 */

// @lc code=start
/**
 * @param {string} digits
 * @return {string[]}
 */
var letterCombinations = function(digits) {
  if (!digits) { return [] }
  const obj = {
    '2': ['a', 'b', 'c'],
    '3': ['d', 'e', 'f'],
    '4': ['g', 'h', 'i'],
    '5': ['j', 'k', 'l'],
    '6': ['m', 'n', 'o'],
    '7': ['p', 'q', 'r', 's'],
    '8': ['t', 'u', 'v'],
    '9': ['w', 'x', 'y', 'z'],
  }
  var iter = (dig, res) => {
    if (dig.length == 1) {
      const arr = obj[dig].map(_i => {
        return res ? res.map(_j => _j + _i) : _i
      })
      return Array.prototype.concat.apply([], arr)
    } else {
      res = iter(dig[0], res)
      return iter(dig.substring(1), res)
    }
  }
  return iter(digits)
};
// @lc code=end

