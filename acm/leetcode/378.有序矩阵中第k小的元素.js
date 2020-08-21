/*
 * @lc app=leetcode.cn id=378 lang=javascript
 *
 * [378] 有序矩阵中第K小的元素
 */

// @lc code=start
/**
 * @param {number[][]} matrix
 * @param {number} k
 * @return {number}
 */
var kthSmallest = function(matrix, k) {
  let res = matrix[0][0];
  for (let j = 0; j < k; j++) {
    let i = 0;
    while (1) {
      if (matrix[i][0] === undefined) {
        i++
      } else {
        break;
      }
    }
    if (matrix[i + 1]) {
      let tmp = matrix[i][0];
      let find = false;
      for (let k = i + 1; k < matrix.length; k++) {
        if (matrix[k][0] < tmp) {
          tmp = matrix[k][0];
          find = k;
        }
      }
      if (!find) {
        res = matrix[i].shift();
      } else {
        res = matrix[find].shift();
      }
    } else {
      res = matrix[i].shift();
    }
  }
  return res;
};
// @lc code=end

