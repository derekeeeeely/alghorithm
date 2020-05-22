/*
 * @lc app=leetcode id=3 lang=javascript
 *
 * [3] Longest Substring Without Repeating Characters
 *
 * https://leetcode.com/problems/longest-substring-without-repeating-characters/description/
 *
 * algorithms
 * Medium (29.94%)
 * Likes:    8671
 * Dislikes: 525
 * Total Accepted:    1.5M
 * Total Submissions: 4.9M
 * Testcase Example:  '"abcabcbb"'
 *
 * Given a string, find the length of the longest substring without repeating
 * characters.
 *
 *
 * Example 1:
 *
 *
 * Input: "abcabcbb"
 * Output: 3
 * Explanation: The answer is "abc", with the length of 3.
 *
 *
 *
 * Example 2:
 *
 *
 * Input: "bbbbb"
 * Output: 1
 * Explanation: The answer is "b", with the length of 1.
 *
 *
 *
 * Example 3:
 *
 *
 * Input: "pwwkew"
 * Output: 3
 * Explanation: The answer is "wke", with the length of 3.
 * ⁠            Note that the answer must be a substring, "pwke" is a
 * subsequence and not a substring.
 *
 *
 *
 *
 *
 */

// @lc code=start
/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function(s) {
	let i = 0;
	let tmp = '';
	let res = '';
	while(i < s.length) {
		if (!tmp.includes(s[i])) {
			tmp += s[i];
		} else {
			if (res.length < tmp.length) {
				res = tmp;
			}
			const reg = `(?<=${s[i]})(\\w*)`;
			tmp = tmp.match(new RegExp(reg))[0];
			tmp += s[i];
		}
		i++;
	}
	return res.length > tmp.length ? res.length : tmp.length;
};
// @lc code=end

