import foo = require('foo');

export function loadFoo() {
  // 这是懒加载 foo，原始的加载仅仅用来做类型注解
  const _foo: typeof foo = require('foo');
  // 现在，你可以使用 `_foo` 替代 `foo` 来做为一个变量使用
}

namespace xx {
  export function log(msg) {
    console.log(msg)
  }
}