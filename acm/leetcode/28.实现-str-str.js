/*
 * @lc app=leetcode.cn id=28 lang=javascript
 *
 * [28] 实现 strStr()
 */

// @lc code=start
/**
 * @param {string} haystack
 * @param {string} needle
 * @return {number}
 */
var strStr = function(haystack, needle) {
  if (!needle) { return 0 }

  var generateNextArr = (str) => {
    var y = 0;
    var x = 1;
    var next = new Array(str.length).fill(0);
    while (x < str.length) {
      if (str[x] == str[y]) {
        y++;
        next[x] = y;
        x++;
      } else if (y > 0) {
        y = y - 1;
      } else {
        next[x] = 0;
        x++;
      }
    }
    return next;
  }

  var i = 0; // string
  var j = 0; // pattern
  var next = generateNextArr(needle)
  while (i < haystack.length && j < needle.length) {
    if (haystack[i] == needle[j]) {
      j++
      i++
    } else if (j > 0) {
      j = next[j - 1]
    } else {
      i++
    }
  }
  if (j == needle.length) {
    return i - j
  } else {
    return -1
  }


};
// @lc code=end

