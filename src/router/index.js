import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/components/home.vue'
import Welcome from '@/components/welcome.vue'
import Message from '@/components/message.vue'
import Users from '@/components/users.vue'
import Rights from '@/components/rights.vue'
import Roles from '@/components/roles.vue'
import Goods from '@/components/goods/goods.vue'
import AddGoods from '@/components/goods/addGoods.vue'
import params from '@/components/params.vue'
import categories from '@/components/categories.vue'
import orders from '@/components/orders.vue'
import reports from '@/components/reports.vue'
Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: "/home"
  },
  {
    path: '/home',
    component: Home,
    
  },
  { path: '/welcome',
   component:Welcome,
   redirect:'/message',
   children:[
    { path:'/message',component:Message},
    { path:'/users',component:Users},
    { path:'/rights',component:Rights},
    { path:'/roles',component:Roles},
    { path:'/goods',component:Goods},
    { path:'/addGoods',component:AddGoods},
    { path:'/params',component:params},
    { path:'/categories',component:categories},
    { path:'/orders',component:orders},
    { path:'/reports',component:reports},
   ]
  }
 
]

const router = new VueRouter({
  routes,
})

/* 挂载路由导航守卫 */
router.beforeEach((to, from, next) => {
  /* 
  1. to代表将要访问的路径
  2. from代表从那个路径过来的
  3. next代表是一个函数,有两种表达方式
   next() 放行
   next('/home')代表强制跳转到指定路径页面 
  */
  if (to.path === '/home') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) {
    return next('/home')
  }
  next()
})
export default router