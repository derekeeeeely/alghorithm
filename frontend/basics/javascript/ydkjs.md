# ydkjs

## up & going

- 对象包装器

  ```js
  a = 'ss'
  a.toUpperCase()
  // touppercase是String上的方法，调用时会生成String(a)，调用完成后销毁
  ```

- x == y(11.9.3) toPrimitive(9.2, 8.12.8)
  - same type(NaN)
  - null undefined
  - number string(tonumber)
  - boolean(tonumber) x
  - object(toprimitive) number|string

  toprimitive: number: valueof -> tostring, string: tostring -> valueof

## type & grammer

- js变量无类型，变量里的值是有类型的
- 函数是一个拥有``[[call]]``内部属性的可调用对象，还有一个`length`属性，值为形参数量
- array按照数字索引，a['13']这种可被转为number的键会与a[13]等同，注意
- 原生类型对应都有一个类型构造器函数，生成的是一个包装器对象，而不是一个基础类型值

  ```js
  var a = new String( "abc" );
  typeof a; // "object" ... 不是 "String"
  a instanceof String; // true
  Object.prototype.toString.call( a ); // "[object String]" 内部[[Class]]属性
  a.valueOf() // 包装器对象取值
  ```








