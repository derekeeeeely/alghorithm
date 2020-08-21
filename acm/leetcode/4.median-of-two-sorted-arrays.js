/*
 * @lc app=leetcode id=4 lang=javascript
 *
 * [4] Median of Two Sorted Arrays
 */

// @lc code=start
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
var findMedianSortedArrays = function(nums1, nums2) {
  let tmp = [];
  while (nums1.length && nums2.length) {
    if (nums1[0] < nums2[0]) {
      tmp.push(nums1.shift())
    } else {
      tmp.push(nums2.shift())
    }
  }
  tmp = tmp.concat(nums1, nums2);
  if (tmp.length % 2) {
    return tmp[(tmp.length - 1) / 2]
  }
  return (tmp[tmp.length/2] + tmp[tmp.length/2 - 1]) / 2
};
// @lc code=end

