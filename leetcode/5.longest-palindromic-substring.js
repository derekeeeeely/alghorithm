/*
 * @lc app=leetcode id=5 lang=javascript
 *
 * [5] Longest Palindromic Substring
 */

// @lc code=start
/**
 * @param {string} s
 * @return {string}
 */
var longestPalindrome = function(s) {
  // 这是我的版本， 240ms
  // let tmp = ''
  // let res = ''
  // const spread2 = (idx1, idx2, len = 1) => {
  //   const left = s[idx1 - len];
  //   const right = s[idx2 + len];
  //   if (left && left === right) {
  //     tmp = s.slice(idx1 - len, idx1 - len + len * 2 + 2);
  //     return spread2(idx1, idx2, ++len);
  //   } else {
  //     return tmp;
  //   }
  // }
  // const spread = (idx, len = 1) => {

  //   const m = s[idx];
  //   const left = s[idx - len];
  //   const right = s[idx + len];
  //   if (left && left === right) {
  //     tmp = s.slice(idx - len, idx - len + len * 2 + 1);
  //     return spread(idx, ++len);
  //   } else {
  //     return tmp;
  //   }
  // }
  // for (let i = 0; i < s.length; i++) {
  //   tmp = s[i];
  //   let s1 = spread(i);
  //   let s2 = ''
  //   if (s[i+1] === s[i]) {
  //     tmp = s.slice(i, i + 2);
  //     s2 = spread2(i, i + 1);
  //   }
  //   let ti = s1.length > s2.length ? s1 : s2;
  //   if (res.length < ti.length) {
  //     res = ti;
  //   }
  // }
  // return res
  let res = ''
  for (let i = 0; i < s.length; i++) {
    for (let j = 0; j < 2; j++) {
      let left = i; // 核心还是回文中心
      let right = i + j; // 奇偶两种情况这样就能覆盖了
      while (s[left] && s[left] === s[right]) {
        left--;
        right++;
      }
      if (right - left - 1 > res.length) {
        res = s.substring(left + 1, right);
      }
    }
  }
  return res
};
// @lc code=end

