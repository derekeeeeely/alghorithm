# GMP

## concept

- G
  - 代表一个goroutine对象，包括了栈、指令指针等内容
  - sched用于保存上下文（传统线程切换上下文由OS来维护，goroutine切换将上下文保存到gobuf对象中）

  ```golang
  type g struct {
    stack stack // 栈
    m *m // 当前m
    sched gobuf // goroutine切换时，用于保存g的上下文
    goid int64 // goroutine的ID
  }
  ```

- M
  - 代表一个线程，对应一个内核线程，G真正的执行在M上
  - g0的栈是M所在线程的栈，也是g实现的，而不是OS实现的
  - M的PC指向绑定的G的函数
  - M从P的runq中获取G，切换到G的栈执行G，M不保存G的状态，这是G可以跨M调度的基础

  ```golang
  type m struct {
    g0 *g // 带有调度栈的goroutine
    curg *g // 当前运行的goroutine
  }
  ```

- P
  - 代表一个处理器，P来调度G在M上执行，P与M联合实现可执行G的条件，P和M不一定数量一致(M可能比P多很多很多)
  - P的数量限制了同时执行的G的最大数量，因为P+M = G的可执行条件
  - P保存了一个runqueue（本地rq）
  - 全局的runqueue在schedt中
  - 1.5以后GOMAXPROCS会默认为系统核数

  ```golang
  type p struct {
    status   uint32
    // 可执行的goroutine队列
    runqhead uint32
    runqtail uint32
    runq     [256]guintptr

    runnext guintptr // 下一个运行的g
  }
  ```

## process

- 传统GM与go的GMP
  - 程序负责创建线程，系统负责调度线程到物理cpu上执行
  - 一个任务开一个线程，1：1，多核机器下：N：1
  - 内核线程调度不可控，消耗大，切换上下文昂贵
  - go的G的调度在用户侧控制，上下文切换也在用户侧（go的runtime实现）
  - P抢占式调度，使得M被block时不影响与之绑定的P的runq中后续G的执行，空闲M也可以去抢G，提高利用率

- basic
  - M和P绑定后从P的runq（local rq）中取G，切换到G的栈，执行
  - P的runq空了以后从global runq取G
  - global runq空了，去偷别人家的P，拿一半
  - 偷也偷不到了，M就idle（空闲）了
  - global rq需要加锁，local rq不需要

- M被block时，M对应的P和P对应的runq以及执行中的G如何处理：
  - M执行的G有syscall时M就block
    - 执行中的G和M一起等待unblock
    - P和P的runq一起被转到另一个idle的M（没有就得new一个m了）
    - unblock以后，去找一个P（类似于空闲M偷P），偷不到就把G丢到global
  - channel阻塞 | IO
    - 这种情况下G被阻塞时，会被放置到wait队列，M继续执行下一个G，如果没有剩下的G了，M就和P解绑，M sleep
    - 操作完以后，G会被唤醒，变成runable，被丢到某个P（唤醒G的那个G2所在的P），绑定下一个M继续执行
- runable goroutine很少的时候，M也不会被销毁，而是留下`runtime.GOMAXPROCS`个`spining`状态的M，等待block发生时挂载在block M下的runable goroutine

- sysmon
  - go程序执行时，runtime会去启动一个特殊的m，sysmon（监控线程），这个m不用绑定p
    - 释放闲置超过5分钟的span物理内存
    - 如果超过2分钟没有垃圾回收，强制执行
    - 将长时间未处理的netpoll结果添加到任务队列
    - **向长时间运行的G任务发出抢占调度**
    - 收回因syscall长时间阻塞的P
  - G任务执行超过10ms，G的抢占标志位会被置为true，G下一次执行函数|方法是，runtime可以将G暂停

- G的暂停方式
  - gosched G以runable状态放到global rq，由于总有M会去global rq找G，所以不需要唤醒，抢占调度就是这样
  - gopark 先丢到wait队列，需要唤醒
  - 其他三种先不管了

## conclude

  ![gmp](https://derekzhou.oss-cn-hongkong.aliyuncs.com/gmp.jpg)

- GMP，G是goroutine对象，包含函数指针、栈、指令、上下文数据等，M是machine，是对内核级线程的抽象，P是processer，包含LRQ和GRQ，M和P绑定，从P的runq中获取G，M的PC指向G函数，切换到G的栈，执行G，清理线程，找下一个G，如此循环。
- P的数量默认与cpu核数量一致，代表同时可执行的G的数量，因为M要和P绑定才能执行G（sysmon除外），M可以有很多，但是一般会有`runtime.GOMAXPROCS`个`spining`状态的M，以备不时之需。
- M绑定P，从P的rq中取G，没了去global取，没了去偷别人家P的一般G，再偷不到M就空闲了（global的有锁，因为是所有M | P共享的）
- syscall阻塞时，当前执行中的G会随M一起阻塞，剩下的G会随P另谋出路，找另一个M绑定，call完以后的G会去找一个别的P，找不到就去grq待业
- channel或者io阻塞时，当前的G会被丢到wait队列，M继续执行下面的G2，没有G2那就MP分家，M休息，G被唤醒以后，被丢到唤醒他的P底下，找M去执行
- sysmon会向长时间运行的G任务发出抢占调度，当前执行中G被丢到grq，M+P用来执行别的G，这就是抢占
