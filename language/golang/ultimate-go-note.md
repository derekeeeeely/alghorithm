# notes

- type
  - a string is a 2 word data structure: a pointer and a length
- struct
  - padding和alignment

  ```golang
    // 假设32位机器
    e3 := struct {
      flag    bool // 1byte + 3byte padding
      counter int16 // 2byte + 2byte padding
      pi      float32
    }{
      flag:    true,
      counter: 10,
      pi:      3.141592,
    }
    // 推荐写法
    e3 := struct {
      pi      float32
      counter int16 // 2byte + 2byte padding
      flag    bool // 1byte + 3byte padding
    }{
      pi:      3.141592,
      counter: 10,
      flag:    true,
    }
    // 之所以补全padding，是为了内存分配时避免太多内存碎片，padding放到后面使碎片尽量集中
  ```

- pointer
  - `*`出现在类型中，如`*int`为int型指针，指向一个int型数据的地址
  - `*`出现在代码中，如`*p1`为操作符，取指针p1指向的地址上存的值
  - `&`取址符，取地址（指针|
  - escape analysis 函数返回指针时会存在heap上，而不是stack上，有点像js的闭包。考虑何时返回指针，何时返回值
  - set pointer: `a := &val` 这样a就是一个指针了，`*a == val`

- array ([5]int)
  - TLB缓存的是虚拟地址和物理地址的映射关系，N*N的矩阵遍历时，行遍历最快，链表遍历中间速度，列遍历最慢，就是因为cache和TLB
  - 大小和类型构成类型，如type [4]int (all array has known size at compiled time.)

- slice([]int)
  - 3 word data: pointer length capacity (slice1 := make([]string, 5, 8))
  - append: 如果capacity到了，会创建并返回一个新的slice，拷贝旧的数据，加上append的数据，cap在1000以下时，新的slice会是double，1000以上减到25%
  - Slice of Slice
    - `newSlice := slice1[2:4]` 如果slice1还有第五个元素，newSlice append的时候会修改原slice1的第五个元素 （没有第三个数的时候cap是自动计算出来的，比如这里就是6）
    - slice1[2:4:4] 这样会创建length 2 cap 2的slice，指向同一个backing array，但是append的话会返回新的，也不会造成修改第五个的问题出现
  - copy: `newSlice := make([]int, len(slice1)) copy(newSlice, slice1)`
  - `for i, r := range "世界 haha" {}` 这里的i打出来将是 0 3 6 7 8 9... codepoint by codepoint
  - go使用utf-8字符集，utf8.UTFMax = 4，中文使用3个byte，英文字符1个byte，至少4byte保证可表示任何字符

- method
  - 定义了receiver的函数称为方法，receiver有value receiver和pointer receiver
  - 两种情况下，不论是user类型还是*user类型的变量都可以call这两个不同的method，go内部会进行转换

  ```golang
  type user struct{}
  func (u user) notify() {
  }
  func (u *user) changeEmail(email string) {
  }
  a := user{}
  b := *user{}
  a.notify()
  a.changeEmail("s") // (&a).changeEmail
  b.notify() // (*b).notify
  b.changeEmail("d")
  ```
