import Vue from 'vue'
import VueRouter from 'vue-router'

// const Foo = () => import('./Foo.vue')

const Login = () => import ('@/components/login/login.vue')
const Home = () => import ('@/components/home/home.vue')
const Users = () => import ('@/components/users/users.vue')
const Rights = () => import ('@/components/rights/rights.vue')
const Role = () => import ('@/components/role/role.vue')
const Goodslist = () => import ('@/components/goods/goodslist.vue')
const GoodsAdd = () => import ('@/components/goods/goodsadd.vue')
const Cateparams = () => import ('@/components/goods/cateparams.vue')
const Goodscate = () => import ('@/components/goods/goodscate.vue')
const Order = () => import ('@/components/order/order.vue')
const Reports = () => import ('@/components/reports/report.vue')

import {
  Message
} from 'element-ui'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [{
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'home',
      path: '/',
      component: Home,
      children: [{
          name: 'users',
          path: '/users',
          component: Users
        },
        {
          name: 'rights',
          path: '/rights',
          component: Rights
        },
        {
          name: 'roles',
          path: '/roles',
          component: Role
        },
        {
          name: 'goods',
          path: '/goods',
          component: Goodslist
        },
        {
          name: 'goodsadd',
          path: '/goodsadd',
          component: GoodsAdd
        },
        {
          name: 'params',
          path: '/params',
          component: Cateparams
        },
        {
          name: 'categories',
          path: '/categories',
          component: Goodscate
        },
        {
          name: 'orders',
          path: '/orders',
          component: Order
        },
        {
          name: 'reports',
          path: '/reports',
          component: Reports
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next()
  } else {
    const token = localStorage.getItem('token')
    if (!token) {
      Message.warning('请先登录')
      router.push({
        name: 'login'
      })
      return
    }
    next()
  }
})

export default router
