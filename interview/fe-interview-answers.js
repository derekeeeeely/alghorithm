// 第一天
// link和@import 引入样式的区别
// link是html标签，import是css提供的
// link样式作为页面资源加载，import样式文件在页面加载完后加载

// 递归实现长度为5，元素2-32不重复随机整数
let n = 0;
const arr = [];
function generateNum(rangeL, rangeR) {
  return Math.floor(Math.random() * (rangeR - rangeL + 1) + rangeL);
}
function randX(x = 5, num = generateNum(2, 32)) {
  if (n < x) {
    if (!~arr.findIndex(i => i === num)) {
      arr.push(num);
      n++;
    }
    randX();
  } else {
    return
  }
}
randX();
console.log(arr);

// 第二天
// css3 transition transform animation

// 去空格
const str = ' x y z ';
const replaceAll = str.replace(/\s*/g, '');
const replaceR = str.replace(/\s*$/g, '');
const replaceL = str.replace(/^\s*/g, '');
const replaceLR = str.replace(/^\s|\s$/g, '');
