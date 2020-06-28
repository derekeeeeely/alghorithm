- 处理输入：地址栏输入，判断是否为URL （主进程 的 UI线程）
    - 网络请求相关的到底是主进程下的线程还是一个独立的网络进程？

    ![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/a5b4b474-6952-4720-bd59-39b9d2f96f6a/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/a5b4b474-6952-4720-bd59-39b9d2f96f6a/Untitled.png)

- 网络请求：浏览器进程 UI线程 将URL 传递给网络线程
    - 资源是否缓存：强缓存命中 → 不进行请求，读取缓存资源
        - from memory | from disk 都是缓存在本地的强缓存，前者一般有js html 字体等，后者一般有css
        - memory cache会缓存编译解析后的脚本内容，存入该进程地址空间，便于下次快速读取，进程关闭后随进程一起被清空
        - disk cache一般是非脚本文件，写入硬盘，读取速度比memory cache慢
        - expires是http1.0的字段，cache-control为1.1，同时存在时后者优先级更高
        - no-cache是指要协商，no-store才是不强不协商
        - 强缓存未命中，浏览器携带缓存标识向服务端发起请求
        - 上次返回的last-modified，这次请求header带上if-modified-since
        - etag和if-none-match同理 服务端优先考虑etag
        - 协商缓存命中，则浏览器使用缓存资源，否则返回新资源
    - 重定向的情况下 网络线程要通知UI线程，随后网络线程再发起新的请求

        ![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/8773e561-481b-47c9-ac5f-ea046c49d1b3/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/8773e561-481b-47c9-ac5f-ea046c49d1b3/Untitled.png)

    - 请求前需要进行DNS解析
        - 数据链路层（以太网协议）→  网络层（IP ARP） →  传输层（TCP UDP）→ 应用层（HTTP）
        - URL：地址形式的URI实现，DNS解析得到IP地址
        - DNS解析：本地hosts文件 → 本地DNS服务器 → 根DNS服务器 → 域服务器 （递归 | 迭代）
        - DNS TTL：本地DNS服务器缓存解析结果的时长
    - 获得了 IP地址 + 端口后，创建socket，开始建连
        - TCP 三次握手：双方都需要明确双方的收发能力正常
        - TCP头部会有序列号和ACK确认号，确认号的发送方期待接收到的是成功被接收的数据的序列号+1
        - SYN和FIN都是会利用重传保证可靠性的
        - TCP四次挥手：服务端的FIN和ACK分开，所以多了一次，因为需要上层应用决定是否关闭通道，发送FIN
            - 客户端发送一个FIN表示我结束了 seq = x
            - 服务端收到后发送ACK ack number = x + 1
            - 上层应用被告知另一端关闭，发起自己的关闭，发送FIN seq = y
            - 客户端收到后发送ACK ack number = y + 1

        ![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/d01fe22e-c46c-4fe4-8447-ed52c5e19590/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/d01fe22e-c46c-4fe4-8447-ed52c5e19590/Untitled.png)

        ![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/16c8f37d-17e7-43c9-8b75-caa6d08943c6/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/16c8f37d-17e7-43c9-8b75-caa6d08943c6/Untitled.png)

    - HTTPS HTTP2 QUIC
        - TLS

            ![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/2608cb43-82b6-42ed-901c-b18b13af008d/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/2608cb43-82b6-42ed-901c-b18b13af008d/Untitled.png)

            - client hello包含一个随机数a，可支持的加密方式等
            - server hello包含证书、随机数b和非对称加密的公钥
            - client利用公钥加密一个新的随机数c，发给服务端
            - 服务端私钥解密随机数c，随机数abc一起生成用于对称加密的session key
            - 之后的通信都用session key加密
        - HTTP2

            ![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/ea4d0b9f-9142-4fad-a774-c807279cce62/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/ea4d0b9f-9142-4fad-a774-c807279cce62/Untitled.png)

            - HTTP1.x的问题
                - 队头阻塞，之前的请求因某些原因阻塞了，之后的需要等待，解决：分域，资源合并（雪碧图），内联资源等
                - 由于HTTP无状态，每次都要带很多很大的头信息过去，浪费资源
                - 明文传输不安全
            - 二进制分帧
                - HTTP1.X文本格式传输，HTTP2以二进制传输
                - 帧是HTTP2数据传输的最小单位
                - headers帧存头，data帧存数据
            - 流
                - 存在于连接的虚拟通道，可以承载双向的消息，每个流有一个id，比如一个请求+响应 是一个数据流，包含了两条消息，每个消息又有很多帧
            - 多路复用
                - 同域名下所有通信共用一个连接，这个连接可以承载任意数量的双向数据流
                - 数据流以消息形式发送，一个消息可以包含多个帧，帧可以乱序，帧首部会有流标识，用于重新组装
                - 请求可以设置优先级
                - 单个连接 并行交错 请求和响应，提高效率，同域名只占用一个TCP连接，减少内存消耗和延时
            - 服务端推送
            - 首部压缩
                - 霍夫曼编码压缩字符串和整数 HPACK
                - 客户端和服务端都有一个首部表，二次发送请求的时候可以只发送变更的部分
                - 首部表在连接持续过程中一直存在，且两端同步更新
        - HTTP3 QUIC

            ![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/8d1e4497-5375-4d27-811e-1c0c90a5f2b1/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/8d1e4497-5375-4d27-811e-1c0c90a5f2b1/Untitled.png)

            - HTTP2的问题
                - TCP + TLS带来的两次握手，需要消耗很多RTT
                - 丢包的时候，由于重传机制，整个TCP连接都需要等待，造成拥塞（因为TCP 接收端处理的时候只能一个个来，先到的万一丢了，后面的处理时刻就得延后，等待先到的重传）
                - 其实都是TCP的问题了
            - QUIC
                - 基于UDP，UDP虽然不需要握手，但UDP是不可靠的，所以QUIC实现了类似TCP的流量控制和传输可靠性
                - 0RTT 建连 快速握手，这是相比于HTTP2最大的优势
                - 多路复用：同一个物理连接上有多个独立的逻辑数据流，解决了队头拥塞问题
- 读取数据：浏览器进程的网络线程获取到html以后，需要将数据传递给渲染进程，别的文件可能是给下载管理器之类的东西，传递给渲染进程之前需要对内容和域进行安全检查
    - 一般情况下一个tab对应一个渲染进程，当从A打开B，且AB属于同一站点时，B复用A的渲染进程
    - 数据传输(网络 → 渲染)完成后渲染进程通知浏览器主进程，更新浏览器界面状态
    - 渲染阶段
- 准备渲染进程：检查完毕后网络线程告诉UI线程数据准备完毕，UI线程去找到一个渲染进程开始渲染。网络请求和UI线程查找渲染进程这两步可以是并行的
- 开始渲染，至此导航结束，如果要离开页面，UI线程会通知render进程，是否需要处理beforeunload

    ![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/f7a02280-c2d9-4488-a0c0-37c6a01ee743/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/f7a02280-c2d9-4488-a0c0-37c6a01ee743/Untitled.png)

    跳转新的站点（非同一），旧的渲染进程被通知unload page

    ![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/00b7a579-f8dc-4ab2-bfd2-12785783e6c4/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/00b7a579-f8dc-4ab2-bfd2-12785783e6c4/Untitled.png)

- 渲染

    ![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/e1e6b518-c47c-4870-880e-c4f307bc488b/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/e1e6b518-c47c-4870-880e-c4f307bc488b/Untitled.png)

    - 渲染进程接收到导航提交并开始接收html数据后，渲染进程的主线程开始解析html

        ![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/78e578fe-caef-43a6-b639-ed6d29298305/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/78e578fe-caef-43a6-b639-ed6d29298305/Untitled.png)

    - 交由浏览器进程的网络线程进行 link和img标签资源的预加载
    - 遇到script标签时会暂停html解析，会加载 解析 执行js，因为js可能会改变dom
        - defer 不阻塞html解析 并行进行，加载完后执行DOMContentLoaded 会等待defer脚本执行完 多个defer顺序执行
        - async 不阻塞html 不阻塞DOMContentLoaded 多个async互不相关，执行顺序不相关
    - 计算style：即便未提供，也有一个默认样式用于计算

        ![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/a45a181f-d623-435b-8c60-c52b0ae41ea2/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/a45a181f-d623-435b-8c60-c52b0ae41ea2/Untitled.png)

    - layout：cssom和dom不足以画出页面，因为还需要位置信息，主线程需要进行layout操作
        - 计算每个node的位置
        - display none的node不会是layout tree的一部分，hidden和伪类会是layout一部分
        - Dom tree + computed styles → layout tree
    - layer tree
        - layout tree → layer tree 根据layout tree去生成layer tree，明确哪些element归于哪个layer，will-change属性可以告知浏览器该element是会变化的，可以进行优化（单独归属于一个layer从而不影响其他layer？）
    - paint
        - walk through layout tree to produce paint record： 先a再b再c
    - 重排重绘是很昂贵的操作，js的执行可能会导致“不流畅”

        ![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/04e907ca-396f-4276-b75b-9593e7dea4a4/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/04e907ca-396f-4276-b75b-9593e7dea4a4/Untitled.png)

        - 将大的js任务拆分成多个小任务分配到每一帧（requestAnimationFrame），从而避免上述情况发生

            ![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/4c795019-5ba8-49f4-9f1c-717971492964/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/4c795019-5ba8-49f4-9f1c-717971492964/Untitled.png)

        - 利用webworker 避免js执行阻塞主线程
    - Compositing合成
        - dom + computed styles + layout + layer tree + paint record都是在主线程
        - 之后的tile + raster + draw quad等是在合成线程
        - 知道了dom，知道了style，知道了位置layout，知道了顺序paint record，把这些东西画出来，把这些信息反映到实际的像素点上的过程是栅格化rasterizing
        - 将页面分成多个layer层，分别rasterize，然后在发生scroll或者动画的场景去合成一个新的frame
        - layer tree和paint record都有了以后，主线程将这些信息提交给合成线程
        - 合成线程 将layer分成很多个tile，交给raster（光栅）线程们，raster线程处理完后存入GPU memory ，raster线程生成的是每个片的bitmap，然后交给GPU

            ![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/1e2823d5-db31-4212-9819-617716e1845c/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/1e2823d5-db31-4212-9819-617716e1845c/Untitled.png)

            ![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/aa3f06d3-ce10-48b8-b7c3-20c762284773/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/aa3f06d3-ce10-48b8-b7c3-20c762284773/Untitled.png)

        - 合成线程可以 为raster线程 分配优先级，从而保证视窗内的东西先raster
        - 合成线程生成合成帧，通过IPC给到浏览器进程，然后再给到GPU

            ![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/010aba0e-d77c-46eb-83d9-e925d4b7fce5/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/010aba0e-d77c-46eb-83d9-e925d4b7fce5/Untitled.png)

        - 合成线程不阻塞主线程，但如果样式或dom更新，需要重排重绘的话就不一样了
        - paint record

            ![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/7dcfbfec-9689-4a31-be6f-fe2b3958d4b8/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/7dcfbfec-9689-4a31-be6f-fe2b3958d4b8/Untitled.png)

    - 响应事件
        - 用户交互时，浏览器进程把event给到渲染进程（所有的页面代码都在这里执行），渲染进程的合成线程找到事件目标元素，再通知主线程去执行注册的listener

            ![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/e6f40a99-474b-4fee-8481-781715632442/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/e6f40a99-474b-4fee-8481-781715632442/Untitled.png)

        - 如果没有listener，compositor可以响应input 独立于渲染进程的主线程外去 合成新的frame
        - 合成线程在合成的时候会对区域进行标记，标记是否 需要处理 slow scrollable region，是则表示有listener，标记区域外的input发生时不需要等待主线程的处理，直接合成新的frame
        - 如果利用冒泡的特性把事件都代理到顶层，会导致整个页面都是slow scrollable region，这样的话compositor需要等待主线程，对于用户来说肯定是变慢了。要么别这么干，要么在注册listener的时候加个{passive: true}的参数，使得compositor和主线程的handler可以并行
        - hit test：compositor把事件传递给主线程时，需要先根据paint record找到x y 对应的target
        - 合并事件（屏幕60帧为例，每秒120次mousemove要频繁hit test + event handle，这两都是主线程做的，页面肯定要卡住了），并且推迟到下一次requestAnimationFrame之前，以免页面卡住。离散的事件不需要合并，比如点击

            ![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/4cee5518-fdf4-44e0-ae30-b58e56196ae8/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/4cee5518-fdf4-44e0-ae30-b58e56196ae8/Untitled.png)

        - 优化js执行
            - 使用requestAnimationFrame 拆分大任务为多个微任务到每一帧

            ```jsx
            var taskList = breakBigTaskIntoMicroTasks(monsterTaskList);
            requestAnimationFrame(processTaskList);

            function processTaskList(taskStartTime) {
              var taskFinishTime;

              do {
                // Assume the next task is pushed onto a stack.
                var nextTask = taskList.pop();

                // Process nextTask.
                processTask(nextTask);

                // Go again if there’s enough time to do the next task.
                taskFinishTime = window.performance.now();
              } while (taskFinishTime - taskStartTime < 3);
            	// 每一帧开头的3ms去执行分隔后的微任务

              if (taskList.length > 0)
                requestAnimationFrame(processTaskList);
            		// 安排下一帧

            }
            ```

            - 使用web worker

    ![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/b95fb066-1484-4788-bdda-317a5e6998d4/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/b95fb066-1484-4788-bdda-317a5e6998d4/Untitled.png)

    - 解析dom 解析css计算computed styles
    - 生成layout tree和layer tree
    - 每个layer生成paint record，交给compositor线程
    - compositor线程将layer分成多个tile，交给raster线程池 转化成位图（可能会用到GPU加速转化，用了GPU加速的话生成的位图在GPU内存中）
    - 绘制命令给回到浏览器进程，将页面内容绘制存入内存（调用GL），并显示到屏幕（扫描）
        - 位图是一个像素数组，GPU对位图进行坐标转换、光栅化、着色等操作
        - 显示器的电子枪逐行扫描缓冲区数据，一行扫完发出H-Sync信号，一页扫完显示一帧并发出V-Sync信号，开始下一页扫描
    - 重排 重绘 直接合成
        - 重排全流程都要进行（比如修改几何位置），重绘的话会跳过布局（比如更改背景）
        - 如果变更不需要重排重绘，如transform动画，可以直接触发paint之后的合成，且因为不占用主线程，效率是最高的
        - 优化：样式变更 统一一次而不是分多次
        - 构建虚拟dom，js计算变更差异一起提交，再使用createdocumentfragment汇总dom变更，fragment不影响已有dom

        ![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/41dee932-017f-4a96-9059-730303dfe0a8/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/41dee932-017f-4a96-9059-730303dfe0a8/Untitled.png)

        - render process

        ![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/b7686eaa-a2a4-4447-90a2-8947ca8dcc98/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/b7686eaa-a2a4-4447-90a2-8947ca8dcc98/Untitled.png)

    - Viz
        - chrome的多进程架构朝着SOA的方向走，渲染相关的会走向两个service，一个负责Chrome UI等区域，另一个就是Viz Service
        - 光栅化、合成器、GPU调用都包括在Viz service内，统一到一个进程内

            ![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/50125629-2ea8-4d25-9bbd-0a0ba54166cb/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/50125629-2ea8-4d25-9bbd-0a0ba54166cb/Untitled.png)

            - 现有的渲染流水线有很多IPC
            - 在渲染进程的Layer compositor之外还有浏览器进程的Display compositor（为什么不直出？）

        - 阶段化升级 先不了解了，不太懂，需要花时间

    - how blink work

        [How Blink Work 中文译文](https://www.zybuluo.com/rogeryi/note/1358865)

        [Life of a Pixel](https://docs.google.com/presentation/d/1boPxbgNrTU0ddsc144rcXayGA_WF53k96imRH8Mp34Y/edit#slide=id.g60f92a5151_40_0)

        ![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/9b3d8285-5f3b-44ee-b15b-96f3a245fc28/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/9b3d8285-5f3b-44ee-b15b-96f3a245fc28/Untitled.png)

        ![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/23755767-6ffa-4d74-aea1-c5f2585b17e3/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/23755767-6ffa-4d74-aea1-c5f2585b17e3/Untitled.png)

        - GPU加速raster生成位图，保存在GPU memory，此时还没到屏幕

        ![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/4f1cac85-7778-4bdb-9fb8-043417b9bc39/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/4f1cac85-7778-4bdb-9fb8-043417b9bc39/Untitled.png)

        - raster通过skia库去实现opengl调用，根据drawrectop生成自己的draw op的buffer，在raster最后阶段flush

        ![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/6ba2a68d-474f-4c32-8a64-93915c7cdd3e/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/6ba2a68d-474f-4c32-8a64-93915c7cdd3e/Untitled.png)

        ![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/2ff1aeef-0de5-414b-82de-6facbcaa0d1e/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/2ff1aeef-0de5-414b-82de-6facbcaa0d1e/Untitled.png)

        ![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/172848c7-948b-4991-a6bf-d0274d89744c/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/172848c7-948b-4991-a6bf-d0274d89744c/Untitled.png)

        - 每个layer可以单独绘制
        - 主线程：dom + computed styles + layout tree + layer tree(layer list) + paint(paint ops)
        - 合成线程：tiles → raster → gpu raster → in memeory bitmaps → CompositorFrame
            - raster可以将paint ops转为bitmaps，可以使用GPU加速taster
            - layer可以很大，而且不一定都在视口内，所以compositor会把layer分成很多的tile
            - tile是raster的工作单元，根据离视口位置设置优先级，raster线程池工作，raster的输出是存在内存里的bitmaps
            - 所有tiles都rastered以后，compositor生成draw quads，一个quad是一个绘制命令，对应一个tile，合在一起给到浏览器进程
            - 合成线程的输出是CompositorFrame 合成帧

        ![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/5fe49c62-e930-4c83-a48d-52cd2db7b40a/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/5fe49c62-e930-4c83-a48d-52cd2db7b40a/Untitled.png)

        - 合成线程有两棵树，一个正在画，一个新提交，可以中途加入？

        - Viz

        ![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/88d30b14-f23b-461b-ac12-15d5fb85353f/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/88d30b14-f23b-461b-ac12-15d5fb85353f/Untitled.png)

        - overview

        ![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/bdb79f40-0313-4a4e-9d02-9000ee23ddcd/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/bdb79f40-0313-4a4e-9d02-9000ee23ddcd/Untitled.png)

        ![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/e190799e-da20-41a4-a448-e1f1b82047ac/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/e190799e-da20-41a4-a448-e1f1b82047ac/Untitled.png)