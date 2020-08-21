/*
 * @lc app=leetcode.cn id=13 lang=javascript
 *
 * [13] 罗马数字转整数
 */

// @lc code=start
/**
 * @param {string} s
 * @return {number}
 */
var romanToInt = function(s) {
  let r = 0;
  const data = {
    basic: [
      { k: 'M', v: 1000 },
      { k: 'D', v: 500 },
      { k: 'C', v: 100 },
      { k: 'L', v: 50 },
      { k: 'X', v: 10 },
      { k: 'V', v: 5 },
      { k: 'I', v: 1 },
   ],
    extra: [
      { k: 'CM', v: 900 },
      { k: 'CD', v: 400 },
      { k: 'XC', v: 90 },
      { k: 'XL', v: 40 },
      { k: 'IX', v: 9 },
      { k: 'IV', v: 4 },
    ]
  }
  data.extra.map(item => {
    if (s.includes(item.k)) {
      s = s.replace(item.k, '')
      r += item.v
    }
  })
  while (s.length) {
    const choosen = data.basic.find(_ => _.k === s[0])
    r += choosen.v
    s = s.substring(1)
  }
  return r;
};
// @lc code=end

