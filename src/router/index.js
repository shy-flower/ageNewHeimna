import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/components/home.vue'
import Welcome from '@/components/welcome.vue'
Vue.use(VueRouter)

const routes = [
  {path:'/', redirect:"/home"},
 {path:'/home',component:Home},
 {path:"/welcome",component:Welcome}
]

const router = new VueRouter({
  routes
})

/* 挂载路由导航守卫 */
router.beforeEach((to,from,next)=>{
  /* 
  1. to代表将要访问的路径
  2. from代表从那个路径过来的
  3. next代表是一个函数,有两种表达方式
   next() 放行
   next('/home')代表强制跳转到指定路径页面 
  */
  if(to.path ==='/home')  return next()
  const tokenStr= window.sessionStorage.getItem('token')
  if(!tokenStr){
  return  next('/home')
  }
  next()
})
export default router
