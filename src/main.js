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

/* 配置基准地址 */
axios.defaults.baseURL="http://119.45.224.208:8888/api/private/v1/"
/* 添加拦截器,给每一个请求都带上服务器给的token */
axios.interceptors.request.use(config => {
  /* 给请求头添加一个Authorization字段并将token赋值给她 */
  config.headers.Authorization =window.sessionStorage.getItem('token')
 
  return config
})
/* 全局挂载axios */
Vue.prototype.$http=axios

Vue.use(elementUI)
import{
  
}from 'element-ui'

Vue.config.productionTip = false


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
