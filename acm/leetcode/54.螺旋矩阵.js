/*
 * @lc app=leetcode.cn id=54 lang=javascript
 *
 * [54] 螺旋矩阵
 */

// @lc code=start
/**
 * @param {number[][]} matrix
 * @return {number[]}
 */
var spiralOrder = function(matrix) {
  const check = (m) => {
    return Array.prototype.concat.apply([], m).length
  }
  const iter = (mat, res) => {
    if (!mat.length) {
      return res
    }
    const circle = [
      ...(mat.shift()),
      ...(check(mat) ? mat.map(m => m.splice(m.length - 1)[0]) : []),
      ...(check(mat) ? mat.pop().reverse() : []),
      ...(check(mat) ? mat.map(m => m.shift()).reverse() : [])
    ]
    res = [...res, ...circle]
    return iter(mat, res)
  }
  return iter(matrix, [])
};
// @lc code=end

