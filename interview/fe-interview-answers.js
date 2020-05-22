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

// css3 transition transform animation

// 去空格
const str = ' x y z ';
const replaceAll = str.replace(/\s*/g, '');
const replaceR = str.replace(/\s*$/g, '');
const replaceL = str.replace(/^\s*/g, '');
const replaceLR = str.replace(/^\s|\s$/g, '');

// 下划线 -> 驼峰
const toCamel = (str) => {
  return str.replace(/(^|_)(\w)/g, (m, $1, $2) => {
    console.log(m, $1, $2);
    return $2.toUpperCase();
  })
}

// 浏览器离线存储
const html = `<html manifest = "cache.manifest"></html>`
const manifest = `
CACHE MANIFEST
#v0.11

CACHE:

js/app.js
css/style.css

NETWORK:
resourse/logo.png

FALLBACK:
/ /offline.html
`
// html中包含manifest属性时取加载manifest文件，根据manifest文件，首次下载资源并缓存，
// 后续 如果manifest文件没变化 使用缓存内容，有变化 一次性全更新 失败全用旧的

// 大小写替换 replace还真好用 m为match结果 $1为第一个括号 $2为第二个括号 多次调用
const s2b = (str) => {
  return str.replace(/([a-z]*)([A-Z]*)/g, (m, $1, $2) => {
    console.log(m, $1, $2);
    return `${$1.toUpperCase()}${$2.toLowerCase()}`;
  })
}

// css三角形 宽高0 三边border 透明 一边不透明 即可
// 字符子串 个数 正向断言
const strCount = (parent, child) => {
  const reg = new RegExp(`(?=${child})`, 'g');
  const mat = parent.match(reg);
  return mat ? mat.length : 0;
}

// url2obj
const url2obj = (url) => {
  const obj = {};
  url.replace(/(\?|\&)(\w*)=(\w*)/g, (m, $1, $2, $3) => {
    obj[$2] = $3
  })
  return obj
}

// 数组拍平
[].concat.apply([], [1,[2,3],[4,5],[6],7,8])
// 去重
[...new Set([1,2,3])]