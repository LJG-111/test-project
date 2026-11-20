import { Loading } from 'element-ui';
import Router from '../../router/index';
let loading = null;

const fun = {
  // 设置js文件配置里的一些字体大小
  setRem: px => {
    // 当前页面宽度相对于 设计图 宽的缩放比例，可根据自己需要修改。
    const scale = document.documentElement.clientWidth / 1920;
    return px * Math.min(scale, 2);
  },
  //生成随机字符串
  createId: () => {
    var d = Date.parse(new Date());
    if (window.performance && typeof window.performance.now === "function") {
      d += performance.now();
    }
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  },
  //loading加载
  loading: () => {
    loading = Loading.service({
      text: '拼命加载中...',
      spinner: 'el-icon-loading',
      customClass: 'lb-loading-icon-cls',
      background: 'rgba(0, 0, 0, 0.8)'
    });
  },
  loadingClose: () => {
    loading.close();
  },
  /**
* @description 动态添加路由
*/
  setAddRouter() {
    // let data = JSON.parse(localStorage.getItem('XXGK_MANAGE_MENU')),
    //   routers = {
    //     path: "/Manage",
    //     name: "Manage",
    //     component: (resolve) => require(['@/pages/newView/manage/manage/manage'], resolve),
    //     children: []
    //   };
    //   console.log('data',data);
    // data.map(res => {
    //   if (res.children && res.children.legth) {
    //     res.children.map(r => {
    //       let obj = {
    //         path: r.menuId,
    //         name: r.menuId,
    //         component: (resolve) => require([`@/pages/newView/manage${r.menuURL}`], resolve),
    //       }
    //       routers.children.push(obj);
    //     });
    //   }
    // });
    console.log('Router', Router)
    let routerArr = [
      {
        path: '/echarts',
        component: () => import('@/pages/echartsVue')
      },
      {
        path: '/tvVue',
        component: () => import('@/pages/tvVue')
      },
      {
        path: '/txtVue',
        component: () => import('@/pages/txtVue')
      },
      {
        path: '/imgVue',
        component: () => import('@/pages/imgVue')
      },
      {
        path: '/selectVue',
        component: () => import('@/pages/selectVue')
      },
      {
        path: '/mapVue',
        component: () => import('@/pages/mapVue')
      }
    ]
    routerArr.map(item => {
      Router.addRoute(item);
    });
  }
}

export default fun;