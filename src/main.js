import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import elementUI from 'element-ui'
import axios from 'axios'
/* 引入element ui样式 */
import 'element-ui/lib/theme-chalk/index.css'
/* 引入全局样式 */
import '@/assets/css/rest.css'
/* 引入字体图标 */
import '@/assets/icon/iconfont.css'
/* 全局挂载axios */
Vue.prototype.$http=axios
/* 配置基准地址 */
axios.defaults.baseURL="http://119.45.224.208:8888/api/private/v1/"


Vue.use(elementUI)
import{
  
}from 'element-ui'

Vue.config.productionTip = false


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
