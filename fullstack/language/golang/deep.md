# deep

- go函数调用
  - 通过堆栈传递参数，入栈的顺序是从右到左
  - 函数返回值通过堆栈传递并由调用者预先分配内存空间
  - 调用函数时都是传值，接收方会对入参进行复制再计算
- interface
  - 类型实现接口的方法只需隐式实现，不需显式声明，仅在需要时检验
  - interface{} 类型并不表示任意类型，interface{} 类型的变量在运行期间的类型只是 interface{}，实现为一种特殊类型
  - 编译器会隐式对变量解引用获取指针指向的结构体，所以指针调用结构体接收者方法是ok的，但是结构体调用指针接收者方法是不可以的（因为go函数调用是值传递，参数为结构体时，复制的是结构体的值，无法根据结构体找到唯一的地址，此时有两个这个结构体了，没有复制原地址（指针））
  - interface{} -> eface

  ```golang
  // 所有类型都可转换成eface
  type eface struct { // 16 bytes
    _type *_type
    data  unsafe.Pointer
  }
  ```

  - iface

  ```golang
  type iface struct {
    tab  *itab
    data unsafe.Pointer
  }
  type itab struct { // 32 bytes
    inter *interfacetype
    _type *_type
    hash  uint32 // copy of _type.hash. Used for type switches.
    _     [4]byte
    fun   [1]uintptr // variable sized. fun[0]==0 means _type does not implement inter. 这里是方法的实现
  }
  type _type struct {
    size       uintptr
    ptrdata    uintptr // size of memory prefix holding all pointers
    hash       uint32
    tflag      tflag
    align      uint8
    fieldalign uint8
    kind       uint8
    alg        *typeAlg
    // gcdata stores the GC type data for the garbage collector.
    // If the KindGCProg bit is set in kind, gcdata is a GC program.
    // Otherwise it is a ptrmask bitmap. See mbitmap.go for details.
    gcdata    *byte
    str       nameOff
    ptrToThis typeOff
  }
  ```

  ```golang
  package main

  type Duck interface {
    Quack()
  }
  type Cat struct {
    Name string
  }
  func (c *Cat) Quack() {
    println(c.Name)
  }
  func main() {
    // Cat实现了Duck接口的Quack方法，实现的是接收者为指针的版本
    // 所以这里可以完成这样的赋值，同时初始化的c是一个cat类型指针
    // 隐式获取到c指针背后的cat类型的数据，然后调用Quack方法
    var c Duck = &Cat{ Name: "hello kitty" }
    c.Quack()
  }
  ```

  - `var c Duck = &Cat{ Name: "hello kitty" }`

    ![newobject]('./newobject.png')
    ```golang
    LEAQ    type."".Cat(SB), AX                ;; AX = &type."".Cat
    MOVQ    AX, (SP)                           ;; SP = &type."".Cat
    CALL    runtime.newobject(SB)              ;; SP + 8 = &Cat{}
    MOVQ    8(SP), DI                          ;; DI = &Cat{}
    MOVQ    $8, 8(DI)                          ;; StringHeader(DI.Name).Len = 8
    LEAQ    go.string."grooming"(SB), AX       ;; AX = &"grooming"
    MOVQ    AX, (DI)                           ;; StringHeader(DI.Name).Data = &"grooming"
    ```
    - 初始化结构体
      - 将Cat类型的指针（cat struct本身的指针）放到栈SP上
      - call runtime.newobject，将Cat类型指针作为入参，分配一个内存空间，并把地址放到SP+8，也就是new的data的地址压栈
      - SP+8现在存的是一个Cat类型指针，指向的是new的那个东西，把他（指针）拷贝到DI寄存器
      - 在堆上（实际的c存的地方）设置字符串内容和长度
      - 如果换成结构体接收、初始化一个结构体，这一步的区别在于分配的内存在堆上还是栈上，初始化结构体时，在栈上，初始化指针时，栈上只有地址，实际在堆上
      ![newobject]('./newobject2.png')
    - 类型转换
      - Duck是一个iface类型的接口，SP和SP+8这两部分其实就组成了这个iface,SP+8是指向数据的指针，SP是编译器生成的itab结构体指针的拷贝
    - 调用Quack的时候实际是去取itab里的func字段里的指向Quack的指针