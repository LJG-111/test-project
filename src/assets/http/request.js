import axios from 'axios'     //引入axios

let config,
  baseURL = process.env.VUE_APP_URL;

config = {
  baseURL,
  timeout: 60000       //设置最大请求时间
}
const _axios = axios.create(config)

/* 请求拦截器（请求之前的操作） */
_axios.interceptors.request.use(
  config => {
    //如果有需要在这里开启请求时的loading动画效果
    //   config.headers.Authorization = getToken;  //添加token,需要结合自己的实际情况添加，
    return config;
  },
  err => Promise.reject(err)
);

/* 请求之后的操作 */
_axios.interceptors.response.use(
  res => {
    //在这里关闭请求时的loading动画效果
    //这里用于处理返回的结果，比如如果是返回401无权限，可能会是跳回到登录页的操作，结合自己的业务逻辑写
    // if (res.data.code === 401 ) {
    //     Toast("无权限操作")
    // }
    // if (res.data.code === 400 ) {
    //     Toast("请求网络失败")
    // }
    // if (res.data.code === 404 ) {
    //    Toast("请求网络失败")
    // }
    return res;
  },
  err => {
    if (err) {
      //在这里关闭请求时的loading动画效果
      // Toast("请求网络失败")
    }
    return Promise.reject(err);
  }
);

//封装post,get方法
const http = {
  net: (url = '', data = {}, type = null) => {
    return new Promise((resolve, reject) => {
      let options = {
        url,
        // headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        method: type ? 'GET' : 'POST'//默认post请求
      };
      type ? options.params = data : options.data = data;
      _axios(options).then(res => {
        resolve(res.data)
        return res
      }).catch(err => {
        reject(err);
      })
    })
  }
}


export default http;
