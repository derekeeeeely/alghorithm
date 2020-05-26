/*
 * @lc app=leetcode.cn id=12 lang=javascript
 *
 * [12] 整数转罗马数字
 */

// @lc code=start
/**
 * @param {number} num
 * @return {string}
 */
var intToRoman = function(num) {
  const strs = ['I', 'IV', 'V', 'IX', 'X', 'XL', 'L', 'XC', 'C', 'CD', 'D', 'CM', 'M']
  const res = (num + '').split('').reverse().map((_, i) => {
    if (+_ == 9) {
      return strs[i * 4 + 3]
    } else if (+_ >= 5) {
      return `${strs[i * 4 + 2]}`.padEnd(+_ - 4, `${ strs[i * 4]}`)
    } else if (+_ == 4) {
      return `${strs[i * 4 + 1]}`
    } else {
      return ''.padEnd(+_, `${strs[i * 4]}`)
    }
  })
  return res.reverse().join('')
};
// @lc code=end

