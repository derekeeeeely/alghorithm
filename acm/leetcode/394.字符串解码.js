/*
 * @lc app=leetcode.cn id=394 lang=javascript
 *
 * [394] 字符串解码
 */

// @lc code=start
/**
 * @param {string} s
 * @return {string}
 */
var decodeString = function(s) {
  const res = []

  const depart = (str) => {
    str = str.replace(/(\d*)\[([^\[\]]*)\]([a-zA-Z]*)/g, (m, $1, $2, $3, $4) => {
      return $2.repeat($1) + $3
    })
    return str.includes('[') ? depart(str) : str
  }

  return depart(s)
};
// @lc code=end

