<template>
  <div>
    <!-- 2.为button元素设置v-throttle自定义指令 -->
    <button @click="sayHello" v-throttle>提交</button>
    <!-- <button @click="sayHello" v-throttle="5000">提交</button> -->
    <div style="height:1200px"></div>
    <img v-lazy="'https://ae01.alicdn.com/kf/HTB1C08MbEWF3KVjSZPh760clXXar.png'" alt="">
    <!-- <img v-lazy="'https://ae01.alicdn.com/kf/HTB1enJzakxz61VjSZFt761DSVXa2.png'" alt=""> -->
  </div>
</template>

<script>
import lazyload from './lazyload'
import Vue from 'vue'
// lazyload.install(Vue, { default: 'https://ae01.alicdn.com/kf/HTB1VrL7XBCw3KVjSZFu763AOpXaV.png' })
// 安装使用插件：图片懒加载
// 如果插件lazyload是一个对象，必须提供 install 方法
// 调用install 方法时，会将 Vue 作为第一个参数传入
Vue.use(lazyload, { default: 'https://ae01.alicdn.com/kf/HTB1VrL7XBCw3KVjSZFu763AOpXaV.png' })
// 1.设置v-throttle自定义指令
// 表单防止重复提交
Vue.directive('throttle', {
  bind: (el, binding) => {
    console.log('bind.value', binding.value, typeof binding.value)
    let throttleTime = binding.value // 节流时间
    if (!throttleTime) {
      // 用户若不设置节流时间，则默认2s
      throttleTime = 2000
    }
    let cbFun
    el.addEventListener(
      'click',
      (event) => {
        if (!cbFun) {
          // 第一次执行
          cbFun = setTimeout(() => {
            cbFun = null
          }, throttleTime)
        } else {
          event && event.stopImmediatePropagation()
        }
      },
      true
    )
  }
})
export default {
  methods: {
    sayHello () {
      console.log('hello')
    }
  }
}
</script>

<style>
</style>
