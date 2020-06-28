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

  - methods are just functions

  ```golang
  type user struct {
    name string
  }
  func (d user) showName() {
    println(d.name)
  }
  func (d *user) changeName(name string) {
    d.name = name
  }
  func main() {
    xs := user{"derek"}
    xs2 := user{"derekzhou"}
    // 这两个是等价的，调用时，实际是下面的执行
    xs.showName()
    user.showName(xs)

    xs.changeName()
    (*user).changeName(&xs, "ely")

    f1 := xs.showName // 这里的f1是一个two word data struct，第一个指向showName的code，第二个指向data的copy，这里就是xs（如果是pointer receiver则指向pointer）
    fmt.Printf("addr of xs is: %p\n", &xs)
    fmt.Printf("addr of xs.showname is: %p\n", xs.showName)
    fmt.Printf("addr of xs2.showname is: %p\n", xs2.showName) // 函数是同一个
    fmt.Printf("addr of xs.changeName is: %p\n", xs.changeName)
    fmt.Printf("addr of f1 is: %p\n", &f1, "f1 is: ", f1) // f1是指向这个函数的指针，&f1是这个指针的地址

    // user type上定义了两个函数，一个是value receiver，一个是pointer receiver，在创建user类型的变量a时，a的数据结构里包含了指向这两个函数的指针
    // 实际调用时调用的是同一个函数，receiver类型不同可以理解为传入的是变量a还是变量a的指针，考虑是需要改变指针还是改变值去选择使用哪种type

    f2 := xs.changeName
    // f1和f2实际上都是指针，两者第一部分都指向函数，第二部分一个指向的是data的copy，一个指向的是data
  }
  ```

- interface

  ```golang
  // 小技巧
  func read(n int) ([]byte, error) {}
  func read(b []byte) int {}
  // 都是读一个byte slice，为什么选择后者呢，因为前者每次调用都需要为slice分配空间，并在调用退出时将引用传递到栈上
  // 而后者只需要原始的slice在heap上分配好以后，用每次返回的下标去取backing array就好了
  ```

  ```golang
  type reader interface {
    read(b []byte) (int, error)
  }
  type file struct {}
  func (file) read(b []byte) (int, error) {} // read实现了file类型的interface reader
  func retrieve(r reader) error {
    data := make([]byte, 100)
    len, err := r.read(data)
    if err != nil {
      return err
    }
    fmt.Println(string(data[:len]))
    return nil
  }
  func main() {
    f1 := file{"data.json"}
    retrieve(f1) // 判断f1是否实现了reader接口 -> 是，因为存在`read` method的value receiver是file类型
  }
  // 这里的r是一个two word data，第一部分是一个iTable（一种特殊的数据结构），分为类型 和 方法映射矩阵，第二部分是传入的f1的拷贝
  // 接口只是一个valueless类型，方法实现某个类型下的该接口，然后创建该类型的变量后，因为该类型存在该接口的实现的方法，可以调用该方法
  // 这里的r是reader类型，调用reader类型的r的read方法实际上是去reader的iTable查找到传递给r的f1的类型所对应的read方法，找到那个iTable就找到了code
  // 找到了函数code就可以执行，因为数据（f1的拷贝）存在r的第二部分内
  //       reader           iTable
  //    -----------        --------
  //   |           |      |  file  |
  //   |     *     | -->   --------
  //   |           |      |   *    | --> code
  //    -----------        --------
  //   |           |       --------
  //   |     *     | -->  | f copy | --> read()
  //   |           |       --------
  //    -----------
  ```

  这个retrieve方法的入参是接口（泛型），根据实际传入的参数的类型去找到对应的iTable，就可以去调用接口实际的实现函数，这就实现了多态

  ```golang
  type rectangle struct {
    width  int
    height int
  }

  type triangle struct {
    width  int
    height int
  }

  type geometric interface {
    area() int
  }

  func (r rectangle) area() int {
    return r.width * r.height
  }

  func (r triangle) area() int {
    return r.width*r.height/2
  }

  // 这个函数可以接受不同类型的参数，调用同名方法（实际实现不同），返回不同结果
  // 这是一个多态函数
  // 接受任何实现了geometric接口的类型的参数，隐藏具体实现细节
  func commonGeometric(r geometric) {
    fmt.Println("result is: ", r.area())
  }

  func main() {
    rec1 := rectangle{width: 10, height: 20}
    tri1 := triangle{width: 10, height: 20}
    commonGeometric(rec1)
    commonGeometric(tri1)
  }
  ```

  以前说过，方法（存在某个类型receiver的函数）调用时可以使用指针或者该类型，因为go会做内部转换，但那是针对实际类型

  对于接口类型而言，如果他的实现方法的receiver是指针，则只能在调用时传入指针，如果receiver是value，则可以使用指针或者value。原因是对于前者，如果使用的是值，可能获取不到这个值的地址（比如未存储到变量）

  value receiver的方法实现接口时，传入的将是值的copy，pointer receiver为指针

  When we store a value, the interface value has its own copy of the value,
  When we store a pointer, the interface value has its own copy of the address

- embedding

  - inner type promotion

    ```golang
    type user struct {
      name string
    }
    func (user) open {}
    // 这是嵌套，inner type相关的所有东西都可以被提升到outter type
    type admin struct {
      user
      level string
    }
    ad := admin{ person: user{name: "haha"}, level: "ss" }
    ad.user.open
    ad.open // 提升了，所以可用
    // 这不是嵌套
    type admin2 struct {
      person: user
      level: string
    }
    ad2 := admin2{ user: user{name: "haha"}, level: "ss" }
    ad2.user.open
    // 这里不可以使用ad2.open
    ```

    inner和outer实现了同一个interface时，提升不会发生，适用的是outer的实现，但是如果a.b.c()这样调用，适用的是inner对应的实现

    ```golang
    type outerx struct {
      triangle
      length int
    }
    func (r outerx) area() int {
      return r.width * r.height * r.length
    }
    outerx1 := outerx{triangle: triangle{width: 10, height: 20}, length: 10}
    commonGeometric(outerx1) // 2000
    outerx1.area() //2000
    outerx1.triangle.area() // 200
    ```

- export
  - 大写字母开头为导出类型，小写为非导出类型，可以声明New函数用于在外部创建非导出类型

  ```golang
  package users
  type ExportedCount int
  type unexportedCount int
  type New(m int) unexportedCount { return unexportedCount(m) }
  type unexportedUser {
    Age int
    Sex string
  }
  type User { // 可导出type
    Name string // 可导出field
    ID int // 可导出field
    password string // 不可导出field
    unexportedUser // 不可导出field
  }
  // 外部import了users，声明User类型变量时无法传入password
  // 初始化不了unexportedUser，但是初始化完以后可以访问Age和Sex
  a := users.User{Name: "xx", ID: "zzz"}
  a.Age = 2
  a.Sex = "female" // 这是ok的
  ```

- design
  - 通过**行为**而不是状态来组织

  ```golang
  type Speaker interface { speak() }
  type Dog struct { Name string }
  type Cat struct { Name string }
  func (d Dog) speak() {}
  func (c Cat) speak() {}
  // func commonSpeak(s Speaker) { s.speak() }
  ll := []Speaker{Dog{Name:"donald"}, Cat{Name:"miki"}}
  ```

  - 用function来定义api，func传入某个type的data，内部调用method（func based on certain type）
    - 声明interface -> 声明具体类型的接口实现method -> 编写函数作为api，调用实现method

    ```golang
    type ss interface { x(a int) } // interface
    type sss struct {} // struct type
    func (s sss) x(a int) {} // method
    func xx(s ss) (int error) { s.x() return 1, nil } // function for api
    if _, err := xx(b int); err != nil {} // usage
    // b传递给xx后，xx会创建一个ss interface，第一部分是一个itable，包含指向ss类型的指针和ss方法的具体实现的矩阵，第二部分是b的copy（使用指针时为指针）
    ```
    - 实现和抽象分离：接口负责抽象行为，实现负责具体实现，传入的是interface，实际调用的是实际实现（somewhere else各自实现）
    - method的receiver type必须是具体类型，不能是interface
    - struct实际类型 -> interface行为抽象类型 -> method基于具体类型的实现 -> func基于接口的api
  - implicit interface conversion
    - 因为interface的结构是一致的，确定的，方便进行隐式转换，（iTable(pointer+matrix) + value|point）
    - 如果某个实际类型实现了接口A的方法，而接口B的方法是A的一部分，那这个实际类型可以作为B方法的调用者
    - any concrete type stored inside the PullStorer must also implement Puller.

    ```golang
    type Mover interface { move() }
    type Locker interface { lock() }
    type MoveLocker interface { Mover Locker}
    type bike struct{}
    func (bike) move() {}
    func (bike) lock() {}
    a := bike{}
    var ml MoveLocker
    var m Mover
    ml = bike{}
    m = ml // 这是ok的，实现了MoveLocker的具体类型变量一定实现了Mover接口
    ml = m // 这是不对的，但是有办法做到对，↓↓
    b := m.(bike) // 类型断言，如果m中存在bike类型，则把bike的值拷贝给b
    ml = b // 由于b现在是bike类型，实现了MoveLocker，就可以赋给ml了
    // 运行时的type assertion
    // 注意处理未找到|不存在情况，是抛错还是退出还是啥
    if m.(bike) {
      ml = b
    }
    ```
  - when to use interface | concrete type to build api
  - mock using concrete type | interface

- error

  - go的error其实就是一个简单的接口，实际存的就是一个string

  ```golang
  // 以下为errors包的内容
  // error是一个interface
  type error interface {
    Error() string
  }
  // 具体类型
  type errorString struct {
    s string
  }
  // 实现方法，返回e.s
  func (e *errorString) Error() string {
    return e.s
  }
  // 导出一个非导出类型的接口类型
  func New(text string) error {
    return &errorString{text}
  }
  //       error
  //  --------------
  // | *errorString |      errorString
  //  --------------       -----------
  // |      *       | --> |   "Bad"   |
  //  --------------       -----------
  // interface第一部分存的是对应的struct类型的指针，所以&errorString实际也就是error
  func webCall() error {
    return New("bad boy")
  }
  if err := webCall(); err != nil {}
  // if there is a concrete type value is stored in a error type interface
  // err != nil :是否有一个具体类型的值存在error类型的接口中
  ```

- mutex | atomic | rwMutex

  ```golang
  mutex sync.Mutex
  rwMutex sync.RWMutex
  for i:= 0; i < 10; i++ {
    mutex.lock()
    {
      // do sth
    }
    mutex.unlock()
  }

  atomic.AddInt64()
  ```

- channel
  - 创建、关闭、读写、种类

    ```golang
    ch := make(chan int) // 无buffer类型，发送和接收会发生阻塞
    ch2 := make(chan int, 4) // 有buffer类型，缓存满时发送会阻塞，缓存清空时接收会阻塞
    go func() {
      ch <- 2 // 写
    }()
    fmt.Println(<-ch) // 读
    close(ch) // 重复关闭会panic，向已经关闭的send会panic，已经关闭还是可以读，读完已有数据以后读出的是默认值

    s, ok := <- ch // s:0, ok: false表示已关闭
    fmt.Println(s, ok)
    for i := range ch {
      fmt.Println(i)
    }
    ```
  - 超时控制 | goroutine
    ```golang
    // goroutine
    ch := make(chan int)
    go func() {
      ch <- 1
    }()
    <-ch

    // 超时,case后是一个send或者receive，哪个先完成则执行对应case
    select {
      case <- ch:
        // get data from ch
      case <- time.After(2 * time.Second) // 可以换成任意的异常控制流
        // read data from ch timeout
    }

    // range，这里的s是ch里的值，读完后是默认值，除非close，不然会一直for循环
    for s := range ch {
      fmt.Println(s)
    }
    ```
  - 个人理解
    ```golang
    c := make(chan int)
    go func() {
      println("start G1")
      c <- 1
      println("end G1")
    }()
    println("outside start")
    println(<-c)
    println("outside end")
    // outside start -> start G1 -> end G1 -> 1 -> outside end
    // G1 new M1 绑定 P，执行G1，send阻塞，G1阻塞，M继续执行剩下的G（没了，所以MP解绑，M SLEEP），send完以后G1变成runable
    // G1被新的M+P捕获，继续执行，输出end G1
    // receiver阻塞解除，继续执行，输出1和outside end
    // 问题是receiver是怎么阻塞的，有另一个线程负责receiver吗
    ```