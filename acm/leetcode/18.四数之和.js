/*
 * @lc app=leetcode.cn id=18 lang=javascript
 *
 * [18] 四数之和
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[][]}
 */
var fourSum = function(nums, target) {
  // n2logn
  if (nums.length < 4) { return [] }
  if (typeof nums.find(i => i <= target) === undefined) { return [] }
  let snums = nums.sort((a,b) => a-b)
  let arr = [];
  let res = [];
  for (let i = 0; i < snums.length; i++) {
    let m = snums[i];
    for (let j = i + 1; j < snums.length; j++) {
      let n = snums[j];
      let start = j + 1;
      let end = snums.length - 1;
      while (start < end) {
        let count = m + n + snums[start] + snums[end]
        let str = `${m}_${n}_${snums[start]}_${snums[end]}`
        if (!~arr.indexOf(str)) {
          if (count < target) {
            start++;
          } else if (count > target) {
            end--;
          } else {
            arr.push(str);
            res.push([m,n,snums[start],snums[end]])
            start++
          }
        } else {
          start++
        }
      }
    }
  }
  return res
};
// @lc code=end

