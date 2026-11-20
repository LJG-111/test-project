import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import echarts from 'echarts'
import fun from '@/assets/js/fun'
import api from '@/assets/http/api'
import '@/components/globalComponents/index'
import '@/assets/js/rem'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import indexDb from './assets/js/indexDb'
// 首页引导插件
import intro from 'intro.js' // introjs库
import 'intro.js/introjs.css' // introjs默认css样式
// introjs还提供了多种主题，可以通过以下方式引入
import 'intro.js/themes/introjs-modern.css' // introjs主题
 
// 把intro.js加入到vue的prototype中，方便使用，就可以直接通过this.$intro()来调用了
Vue.prototype.$intro = intro

let storeName  = { index: ['tableView'], name: 'tableView', key: 'menuid' } //index:索引、name:表名、key:主键
indexDb.openDB('spreadTableView', 1, storeName, function(db){
  Vue.prototype.$tableDb = db //全局保存数据库
});

Vue.use(ElementUI)

Vue.config.productionTip = false

window.echarts = echarts;
window.$fun = fun;
window.$api = api;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
