import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/menuPage/echarts'
  },
  {
    path: '/menuPage',
    name: 'menuPage',
    component: () => import('@/pages/menuPage'),
    redirect: '/menuPage/echarts',
    children: [
      { path: 'echarts',  name: 'echarts',  component: () => import('../pages/echartsVue') },
      { path: 'mapVue',   name: 'mapVue',   component: () => import('../pages/mapVue') },
      { path: 'outLine',  name: 'outLine',  component: () => import('../pages/outLineMap') },
      { path: 'selectVue',name: 'selectVue',component: () => import('../pages/selectVue') },
      { path: 'elCascader',name:'elCascader',component: () => import('../pages/testVue/elCascader') },
      { path: 'tvVue',    name: 'tvVue',    component: () => import('../pages/tvVue') },
      { path: 'imgVue',   name: 'imgVue',   component: () => import('../pages/imgVue') },
      { path: 'txtVue',   name: 'txtVue',   component: () => import('../pages/txtVue') },
      { path: 'aiVue',    name: 'aiVue',    component: () => import('../pages/aiVue') },

      // 抽奖活动 —— 父路由 + 两个子路由
      { path: 'choujiang', name: 'choujiang', redirect: '/menuPage/choujiang/zhuanpan' },
      { path: 'choujiang/zhuanpan', name: 'choujiangZhuanpan', component: () => import('../pages/choujiangVue/index.vue') },
      { path: 'choujiang/jiugong',  name: 'choujiangJiugong',  component: () => import('../pages/choujiangVue/jiugong.vue') },
      { path: 'choujiang/lm',       name: 'choujiangLm',      component: () => import('../pages/choujiangVue/lm.vue') },

      { path: 'page1',    name: 'page1',    component: () => import('../pages/page1') },
      { path: 'page2',    name: 'page2',    component: () => import('../pages/page2') }
    ]
  },
  // 兼容旧路径
  { path: '/CJVue',   redirect: '/menuPage/choujiang/zhuanpan' },
  { path: '/zhuanpan',redirect: '/menuPage/choujiang/zhuanpan' },
  { path: '/jiugong', redirect: '/menuPage/choujiang/jiugong'  },
  { path: '/lm',      redirect: '/menuPage/choujiang/lm'     },
  { path: '/echarts', redirect: '/menuPage/echarts' },
  { path: '/mapVue',  redirect: '/menuPage/mapVue' },
  { path: '/outLine', redirect: '/menuPage/outLine' },
  { path: '/selectVue', redirect: '/menuPage/selectVue' },
  { path: '/elCascader', redirect: '/menuPage/elCascader' },
  { path: '/tvVue',   redirect: '/menuPage/tvVue' },
  { path: '/imgVue',  redirect: '/menuPage/imgVue' },
  { path: '/txtVue',  redirect: '/menuPage/txtVue' },
  { path: '/aiVue',   redirect: '/menuPage/aiVue' },
  { path: '/page1',   redirect: '/menuPage/page1' },
  { path: '/page2',   redirect: '/menuPage/page2' },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/tvVue')
  }
]

const router = new VueRouter({
  mode: 'hash',
  routes
})

export default router
