/*
 * @lc app=leetcode id=6 lang=javascript
 *
 * [6] ZigZag Conversion
 */

// @lc code=start
/**
 * @param {string} s
 * @param {number} numRows
 * @return {string}
 */
var convert = function(s, numRows) {
  let arr = [];
  Array.from({ length: numRows }, () => {
    arr.push([])
  });
  if (numRows === 1) {
    return s
  }
  let i = 0;
  while (s[i]) {
    const idx = i % (2 * numRows - 2);
    const times = Math.floor(i / (2 * numRows - 2));
    if (idx < numRows) {
      arr[idx][times * (numRows - 1)] = s[i]
    } else {
      arr[numRows - 1 - idx + (numRows - 1)][times * (numRows - 1) + idx - numRows + 1] = s[i]
    }
    i++;
  }
  return Array.prototype.concat.apply([], arr).join('')
};
// @lc code=end

