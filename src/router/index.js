import Vue from 'vue'
import VueRouter from 'vue-router'
// import checkId from '../views/checkId.vue'
// import bottle from '../views/bottle.vue'
import Exchange from '../views/Exchange.vue'
import PlayerJoin from '../views/PlayerJoin.vue'
import DmControl from '../views/DmControl.vue'
import PlayerView from '../views/PlayerView.vue'
import Register from '../views/ExchangeRegister.vue'
import Login from '../views/DmLogin.vue'
import playerLogin from '../views/PlayerLogin.vue'
import CheckPhone from '../views/CheckPhone.vue'
import lottoy from '../views/lottoy.vue'
import setAddress from '../views/setAddress.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '',
    name: 'checkId',
    component: Login
  },
  {
    path: '/script/register/:id',
    name: 'scriptRegister',
    component: () => import(/* webpackChunkName: "about" */ '../views/Register.vue')
  },
  {
    path: '/home',
    name: 'home',
    component: Exchange
  },
  {
    path: '/playerJoin/:roomid',
    name: 'playerJoin',
    component: PlayerJoin
  },
  {
    path: '/controlCenter/:roomid',
    name: 'controlCenter',
    component: DmControl
  },
  {
    path: '/playerView/:id',
    name: 'playerView',
    component: PlayerView
  },
  {
    path: '/register/:id',
    name: 'register',
    component: Register
  },
  {
    path: '/dmlogin',
    name: 'login',
    component: Login
  },
  {
    path: '/playerLogin/:id',
    name: 'playerLogin',
    component: playerLogin
  },
  {
    path: '/check_phone',
    name: 'check_phone',
    component: CheckPhone
  },
  {
    path: '/lottery/:phone',
    name: 'lottery',
    component: lottoy
  },
  {
    path: '/setAddress/:phone',
    name: 'setAddress',
    component: setAddress
  },
  
  // {
  //   path: '/',
  //   name: 'Home',
  //   component: bottle,
  // },
  // {
  //   path: '/main',
  //   name: 'Main',
  //   component: () => import(/* webpackChunkName: "about" */ '../views/Main.vue')
  // },
  // // {
  // //   path: '/about',
  // //   name: 'About',
  // //   // route level code-splitting
  // //   // this generates a separate chunk (about.[hash].js) for this route
  // //   // which is lazy-loaded when the route is visited.
  // //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // // },
  // {
  //   path: '/script/register/:id',
  //   name: 'register',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/Register.vue')
  // },
  // {
  //   path: '/registerInfo/:id',
  //   name: 'RegisterInfo',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/RegisterInfo.vue')
  // },
  // {
  //   path: '/ActiveSuccess',
  //   name: 'ActiveSuccess',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/ActiveSuccess.vue')
  // },
  // {
  //   path: '/login',
  //   name: 'login',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue')
  // },
  // {
  //   path: '/bottle',
  //   name: 'bottle',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/bottle.vue')
  // },
  // {
  //   path: '*',
  //   name: '404',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/404.vue')
  // }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
