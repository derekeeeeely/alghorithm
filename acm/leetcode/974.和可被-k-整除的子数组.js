/*
 * @lc app=leetcode.cn id=974 lang=javascript
 *
 * [974] 和可被 K 整除的子数组
 */

// @lc code=start
/**
 * @param {number[]} A
 * @param {number} K
 * @return {number}
 */
var subarraysDivByK = function(A, K) {

  // var obj = []
  // var sum = (start, end) => {
  //   let r = 0
  //   for (let j = start; j <= end; j++) {
  //     r += A[j]
  //   }
  //   return r
  // }
  // var count = 0;

  // var foo = (idx) => {
  //   if (obj[idx] !== undefined) { return obj[idx] }
  //   let item = A[idx];
  //   if (idx === A.length - 1) {
  //     return item % K == 0 ? 1 : 0;
  //   } else {
  //     if (item % K == 0) {
  //       return foo(idx + 1) + 1;
  //     } else {
  //       let cursor = idx + 1;
  //       let times = 0;

  //       while (cursor < A.length) {
  //         if (sum(idx, cursor) % K == 0) {
  //           return foo(cursor + 1, ) + 1;
  //         } else {
  //           cursor++;
  //         }
  //       }

  //       return 0;
  //     }
  //   }
  // }

  // for (let i = A.length - 1; i >= 0; i--) {
  //   const num = foo(i);
  //   obj[i] = num;
  //   count += num;
  // }

  // return count;

  // 这真的是一道数学题...
  // i...j 之和mod K 0 => 0...j - 0...i-1 mod K 0 => ...i 和 ...j mod K 同余 => 前缀和mod K所有情况的 重复次数 相加 即是答案

  let map = { 0: 1 }   // 为了让边界情况也能适用通式
  let preSum = 0       // 保存前缀和模K的结果，初始值0
  let count = 0        // 计数
  for (let i = 0; i < A.length; i++) { // 一次遍历做完所有事
    preSum = (preSum + A[i]) % K // 上一次的前缀和累加当前项，再mod
    if (preSum < 0) preSum += K  // 处理preSum为负数的情况，需要加 K
    if (map[preSum]) {      // 之前存过的 与当前preSum相等的key
      count += map[preSum]  // 把它出现的次数累加给count
    }
    if (map[preSum]) {      // 以前存过，出现次数+1
      map[preSum]++
    } else {                // 新存入，初始值1
      map[preSum] = 1
    }
  }
  return count              // 返回计数结果
};
// @lc code=end

