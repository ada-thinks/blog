通过对比**核心原理（响应式）**、**开发模式（API**）、**性能优化（编译）** 这三大维度，可快速掌握 Vue2 与 Vue3 的本质差异。
### **一、响应式原理：从 Object.defineProperty 到 Proxy**
| **维度**       | **Vue2（Object.defineProperty）**                          | **Vue3（Proxy）**                                              |
|----------------|-------------------------------------------------------------|---------------------------------------------------------------|
| **实现方式**   | 劫持对象属性的 getter/setter，需递归遍历所有属性             | 直接劫持整个对象，通过 Proxy 监听所有操作（属性读写、删除、添加） |
| **数组支持**   | 重写数组原型方法（push/pop 等），无法监听下标直接修改       | 原生支持数组变化监听，包括下标修改和 length 变化               |
| **嵌套对象**   | 深度递归遍历，初始化性能差，大型对象卡顿                     | **延迟响应式**（访问时才递归处理内层对象），减少初始化开销          |
| **新增/删除属性** | 需用 `$set`/`$delete` 手动触发更新                           | 自动监听属性增减，无需额外 API                                 |


### **二、API 与开发模式**
1. **核心开发模式**
   - **Vue2（Options API）**：
     - 通过 `data/methods/computed` 等选项组织逻辑，代码按功能模块拆分
     - 复杂组件中逻辑碎片化（如状态、DOM 操作分散在不同选项）
   - **Vue3（Composition API）**：
     - 通过 `setup()` 函数集中组织相关逻辑（如状态管理、生命周期）
     - 支持自定义 Hook 函数复用逻辑，避免 Mixin 的命名冲突问题

2. **类型支持**
   - Vue2：依赖 Flow 类型检查，已停止维护，无法推导 `this` 类型
   - Vue3：原生支持 TypeScript，精准推导组件属性（`props`）和状态（`state`）类型


### **三、源码架构与性能优化**
1. **源码组织**
   - **Vue2**：单目录（src）管理，模块耦合高，难以复用
   - **Vue3**：Monorepo 架构（独立 package），支持按需引入（如 `@vue/reactivity`），Tree-Shaking 更彻底

2. **编译优化**
   - **Vue2**：整棵虚拟 DOM 树 diff，性能与模板大小正相关
   - **Vue3**：
     - **Block Tree**：将模板按动态节点分割区块，只更新动态部分
     - **静态标记**：跳过静态节点 diff，减少比较次数
     - **最长递增子序列（LIS）算法**：优化列表更新时的 DOM 移动操作

    > 口语化: vdom 从之前的每次更新，
都进行一次**完整遍历对比**，改为了**切分区块树**，来进行**动态内容更新**。也就是只更新
vdom 的绑定了动态数据的部分，把速度提高了 6 倍


3. **体积优化**
   - Vue3 移除冷门功能（如 inline-template），结合 Composition API 实现更彻底的 Tree-Shaking，打包体积比 Vue2 减少约 40%




### **四、生命周期与新特性**
1. **生命周期钩子变化**
   | Vue2 钩子                | Vue3 对应钩子（在 setup 中使用）       | 新增钩子              |
   |-------------------------|--------------------------------------|-----------------------|
   | beforeCreate            | 无（setup 替代初始化逻辑）            | setup（初始化入口）   |
   | created                 | 无（setup 替代初始化逻辑）            | onBeforeMount         |
   | beforeMount             | onBeforeMount                        | onMounted             |
   | mounted                 | onMounted                            | onBeforeUpdate        |
   | beforeUpdate            | onBeforeUpdate                       | onUpdated             |
   | updated                 | onUpdated                            | onBeforeUnmount       |
   | beforeDestroy           | onBeforeUnmount                      | onUnmounted           |
   | destroyed               | onUnmounted                          | onErrorCaptured       |
   | errorCaptured           | onErrorCaptured                      | onRenderTracked       |
   |                         |                                      | onRenderTriggered     |

2. **新特性**
   - **Fragment**：组件可返回多个根节点（无需包裹 `<div>`）
   - **Teleport**：将组件内容渲染到指定 DOM 位置（如模态框挂载到 body）
   - **Suspense**：处理异步组件加载状态（loading/error 状态显示）


### **五、其他关键差异**
| 功能点               | Vue2                          | Vue3                          |
|----------------------|-------------------------------|-------------------------------|
| 全局 API             | `Vue.component()` 等挂载在 Vue | `app.component()` 链式调用     |
| 父子组件通信         | `this.$emit`/`this.$parent`    | `defineEmits`/`defineProps`    |
| 数据监听             | `watch` 选项或 `$watch`        | `watch` 函数（支持回调函数）  |
| 响应式 API          | `Vue.observable`/`this.$data`  | `ref()`/`reactive()` 函数     |
| 异步组件             | `component: () => import(...)` | 支持 `Suspense` + 异步组件    |


## **记忆口诀与核心场景**
- **响应式选 Proxy**：数组/对象增减属性更灵活，大型数据初始化更快
- **API 用组合式**：逻辑复用靠 Hook，TypeScript 推导更精准
- **性能看编译**：Block Tree 跳静态，LIS 算法省 DOM 操作
- **新特性记三个**：Fragment 去包裹，Teleport 挪位置，Suspense 处理异步

