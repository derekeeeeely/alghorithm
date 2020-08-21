- suspense | Transitions | useDeferredValue | SuspenseList

    ![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/1cf0a611-f3a6-4b41-a115-cde163d6f751/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/1cf0a611-f3a6-4b41-a115-cde163d6f751/Untitled.png)

- 代数效应

    ```jsx
    function a() {
    	const res = perform 'xx' // 1.这里的perform被最近的handle捕获
    	dosthElse(res); // 3.恢复到这里了，res = '123'
    }

    try {
    	a()
    } handle(input) {
    	if (input == 'xx') {
    		resume '123' // 2.恢复到之前的执行，并带上 ‘123’
    	}
    }
    // 类似于可恢复的catch，以上代码只是说明，实际暂不可行
    ```

    - 执行一个效应的时候，会创建一个回调，这里就是触发效应现场之后的待执行内容，效应执行完后resume，再去执行回调，实现恢复
    - 做什么和怎么做分开，做什么随便写，只管流程就好了，实际效应由handle函数来做，resume也由handle来触发

- fiber
    - fiber表示节点对象，以链表将fiber nodes连接形成链表树，即虚拟dom
    - update发生时，会生成一个工作fiber树，render阶段需要对相应fiber nodes进行计算和diff，计算完后再commit阶段提交并变更到dom
- concurrent模式
    - 时间切片
        - 默认5ms，每隔这个时间会跳出循环，询问有没有需要处理的交互事件、更高优先级任务
        - 一个时间片内包含多个fiber节点需要计算，每执行完一个节点会去计算时间是否到达5ms，导致时间切片会≥5ms

        ```jsx
        let yieldInterval = 5;
        let deadline = 0;

        // TODO: Make this configurable
        // TODO: Adjust this based on priority?
        const maxYieldInterval = 300;
        let needsPaint = false;
        ```

    - MessageChannel