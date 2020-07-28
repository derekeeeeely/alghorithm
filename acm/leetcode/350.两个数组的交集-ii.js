/*
 * @lc app=leetcode.cn id=350 lang=javascript
 *
 * [350] 两个数组的交集 II
 */

// @lc code=start
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number[]}
 */
var intersect = function(nums1, nums2) {
  const res = [];
  const dd = nums1.length > nums2.length;
  const less = dd ? nums2 : nums1;
  const more = dd ? nums1 : nums2;
  for (let i = 0; i < less.length; i++) {
    const choosen = more.findIndex(_ => _ === less[i])
    if (choosen !== -1) {
      more.splice(choosen, 1);
      res.push(less[i]);
    }
  }
  return res;
  // const map = new Map();
  //   for (const n of nums1) {
  //       if (map.has(n)) {
  //           map.set(n, map.get(n) + 1);
  //       } else {
  //           map.set(n, 1);
  //       }
  //   }
  //   const result = [];
  //   for (const n of nums2) {
  //       if (map.has(n) && map.get(n) > 0) {
  //           result.push(n);
  //           map.set(n, map.get(n) - 1);
  //       }
  //   }
  //   return result;
};
// @lc code=end

