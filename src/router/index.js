import Vue from 'vue'
import VueRouter from 'vue-router'
// import checkId from '../views/checkId.vue'
// import bottle from '../views/bottle.vue'
import Exchange from '../views/Exchange.vue'
import PlayerJoin from '../views/PlayerJoin.vue'
import DmControl from '../views/DmControl.vue'
import PlayerView from '../views/PlayerView.vue'
import Register from '../views/ExchangeRegister.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '',
    name: 'home',
    component: Exchange
  },
  {
    path: '/playerJoin',
    name: 'playerJoin',
    component: PlayerJoin
  },
  {
    path: '/controlCenter',
    name: 'controlCenter',
    component: DmControl
  },
  {
    path: '/playerView/:id',
    name: 'playerView',
    component: PlayerView
  },
  {
    path: '/register',
    name: 'register',
    component: Register
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
