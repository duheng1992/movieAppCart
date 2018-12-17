import Vue from 'vue'
import App from './App'
import router from './router'
import './base/js/base.js'
import { store } from './store/index.js'
import 'swiper/dist/css/swiper.css'

/*滑动事件*/
import VueTouch from 'vue-touch'
Vue.use(VueTouch, { name: 'v-touch' })

/*图片懒加载  常用的优化方式就是等图片进入可视区之后再去加载图片，在之前给一张loading或者其他图片作为站位 */
import VueLazyload from 'vue-lazyload'
Vue.use(VueLazyload, {
  preLoad: 1.3,
  loading: require('@/assets/head.jpg'),
  attempt: 1
})

/* 轮播图 */
import VueAwesomeSwiper from 'vue-awesome-swiper'
Vue.use(VueAwesomeSwiper)

Vue.config.productionTip = false  //生产环境提示

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

