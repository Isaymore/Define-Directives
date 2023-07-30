const LazyLoad = {
  // install方法
  install (Vue, options) {
    // 代替真实图片的占位图
    const defaultSrc = options.default
    Vue.directive('lazy', {
      // 指令第一次绑定到元素时调用，用于执行一次性的初始化设置
      bind (el, binding) {
        LazyLoad.init(el, binding.value, defaultSrc)
      },
      // 当被绑定的元素插入到 DOM 中时调用
      //   监听滚动事件，判断图片是否进入可视区域等
      inserted (el) {
        // 兼容处理
        if ('IntersectionObserver' in window) {
          LazyLoad.observe(el)
        } else {
          LazyLoad.listenerScroll(el)
        }
      }
    })
  },
  // 初始化
  init (el, val, def) {
    // 将真实图片地址保存在元素的自定义属性data-src中
    el.setAttribute('data-src', val)
    // 设置占位图
    el.setAttribute('src', def)
  },
  // 利用IntersectionObserver监听el
  observe (el) {
    const io = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        const realSrc = el.dataset.src
        if (realSrc) {
          // el.setAttribute('src', realSrc)
          // 图片进入可视区域，加载真实图片
          el.src = realSrc
          // 移除自定义属性data-src
          el.removeAttribute('data-src')
          io.unobserve(el) // 停止监听
        }
      }
    })
    // 开始监听元素
    io.observe(el)
  },
  // 监听scroll事件
  listenerScroll (el) {
    // 页面初始化时，执行load方法。因为页面初始化时，用户没有滚动页面
    LazyLoad.load(el)
    const handler = LazyLoad.throttle(LazyLoad.load, 300)
    console.log('load-handler', handler, typeof handler)
    window.addEventListener('scroll', () => {
      handler(el)
    })
  },
  // 加载真实图片
  load (el) {
    console.log('load-el', el, typeof el)
    // 获取当前视口（当前可见窗口（或当前设备屏幕））的高度
    const windowHeight = document.documentElement.clientHeight
    // 获取该元素相对于视口的位置信息（边界矩形），包括元素的位置、大小和边界等
    const rect = el.getBoundingClientRect()
    // console.log('rect', rect, typeof rect)
    // 元素上边界相对于视口顶部的距离
    const elTop = rect.top
    // 元素下边界相对于视口定部的距离
    const elBtm = rect.bottom
    const realSrc = el.dataset.src
    if (elTop - windowHeight < 0 && elBtm > 0) {
      if (realSrc) {
        el.src = realSrc
        el.removeAttribute('data-src')
      }
    }
  },
  // 节流
  throttle (fn, delay) {
    let timer
    let prevTime
    return function (...args) {
      console.log('throttle-args', args, typeof args)
      const currTime = Date.now()
      const context = this
      console.log('throttle-this', this, typeof this)
      console.log('throttle-context', context, typeof context)
      if (!prevTime) prevTime = currTime
      // 清除上一次执行函数的定时器
      clearTimeout(timer)

      if (currTime - prevTime > delay) {
        prevTime = currTime
        // 原始函数fn接受args剩余参数数组传递的参数，即fn(img元素)
        fn.apply(context, args)
        // 清除上一次执行函数的定时器
        clearTimeout(timer)
        return
      }

      timer = setTimeout(function () {
        prevTime = Date.now()
        timer = null
        // 原始函数fn接受args剩余参数数组传递的参数，即fn(img元素)
        fn.apply(context, args)
      }, delay)
    }
  }

}
export default LazyLoad
