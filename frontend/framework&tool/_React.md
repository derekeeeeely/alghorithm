# React

## 基础

- UI = f(state) 组件
- virtual dom
- jsx
- 生命周期
  - willmount -> render -> didmount -> willreceive -> shouldupdate -> willupdate -> render -> didupdate -> willumount
  - 三个will被删除
  - getDerivedStateFromProps，和didupdate一起 完成willreceive的工作
  - getSnapshotBeforeUpdate在更新前调用，和didupdate一起 完成willupdate的工作
  - didmount后可以拿到dom节点（ref）
  - willunmount做清理
- setstate：传函数则每次都是以最新的state进行计算，做到看起来同步
- forceUpdate强制渲染

## Fiber

## render/commit

## concurrent

## Hooks

- useEffect

## else

- 为什么setstate是异步的
  - 即便state同步更新，props也不能同步更新，因为父组件rerender以后prop才会更新，为了保持一致性
  - 为了享受批量处理带来的性能优化

- setstate -> queue updates（cb attached to fiber node） -> 从头开始遍历fiber树，跳过无工作的fiber -> schedule work -> workloop -> start work -> end work -> effects list -> end of render phase -> commit -> run effects & lifecycles

- 受控组件和非受控组件
  - 表单本身在用户操作后会有一些数据变化，比如input.value = xxx，变化后是展示用户的xxx还是state的值呢
  - 由state来控制 则是受控，需要自己更新state，不控制则非受控，以dom的数据为准

- keys的用途在于减少不必要的重新渲染，相同位置同一个dom元素同一个key可以复用，类似这种，索引做key会带来问题

- React element是不可变的，每次重新渲染都是新的，对应到的dom节点可能是新的，可能是旧的改了点东西
- context避免了逐层传递props