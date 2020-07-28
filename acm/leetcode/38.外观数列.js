/*
 * @lc app=leetcode.cn id=38 lang=javascript
 *
 * [38] 外观数列
 */

// @lc code=start
/**
 * @param {number} n
 * @return {string}
 */
var countAndSay = function(n) {
  const iter = (str) => {
    let s = 1;
    let a = '';
    `${str}$`.split('').reduce((m, n) => {
      if (m == n) {
        s++;
      } else {
        a += `${s}${m}`;
        s = 1;
      }
      return n
    })
    return a;
  }
  if (n == 1) { return '1' } else {
    return iter(countAndSay(n - 1));
  }

};
// @lc code=end

