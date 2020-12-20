import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import elementUI from 'element-ui'
/* 引入element ui样式 */
import 'element-ui/lib/theme-chalk/index.css'
/* 引入全局样式 */
import '@/assets/css/rest.css'




Vue.use(elementUI)
import{
  
}from 'element-ui'

Vue.config.productionTip = false


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
