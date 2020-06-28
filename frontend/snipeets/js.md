- esm

    ![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/f296c4b3-2c3b-489b-a99e-1b947714250c/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/f296c4b3-2c3b-489b-a99e-1b947714250c/Untitled.png)

    - construction: find → download → parse into module record
    - instantiation: linking

        ![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/a8abd758-4a9a-4920-b41f-3b2f32698a10/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/a8abd758-4a9a-4920-b41f-3b2f32698a10/Untitled.png)

        - export 和import指向同一个地址，cmd是copy
        - module map深度遍历 同url只记录一次，避免之后多次运行，缓存策略
        - 这个阶段输出的是 instances以及memory location也就是 code + state（未赋值），但还没执行
    - evaluation: find real value and excute
- cmd
    - cmd 执行过程中遇到require再去加载（文件打包好，直接读文件），所以可以动态加载，而esm先要下载 link 执行所以是静态加载
    - esm dynamic import提案，dynamic import会有一个新的模块依赖graph