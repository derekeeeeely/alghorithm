/*
 * @lc app=leetcode.cn id=62 lang=javascript
 *
 * [62] 不同路径
 */

// @lc code=start
/**
 * @param {number} m
 * @param {number} n
 * @return {number}
 * c(m+n-2)(n-1) = (m+n-2 * ... * m) / (1 * ... * n-1)
 */
var uniquePaths = function(m, n) {
  if (m == 1 || n == 1) { return 1 }
  return factorial(m + n - 2, m) / factorial(n - 1, 1);
};
var factorial = (a, b, s = b) => {
  while (b < a) {
    return factorial(a, ++b, s * b);
  }
  return s
}
// @lc code=end

