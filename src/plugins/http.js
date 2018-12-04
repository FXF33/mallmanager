import axios from 'axios'

import {
  Message
} from 'element-ui';

const MyHttpServer = {}
MyHttpServer.install = (Vue) => {
  // 统一配置baseUrl
  axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
  axios.interceptors.request.use(function (config) {
    // console.log(config.url)
    if (config.url !== 'login') {
      // config参数 headers头部 url标识
      const AUTH_TOKEN = localStorage.getItem('token')
      config.headers['Authorization'] = AUTH_TOKEN
    }
    return config
  }, function (error) {
    return Promise.reject(error)
  })

  //添加相应拦截器
  axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    // console.log(response)
    let {
      meta:{
        msg,
        status
      }
    }=response.data
    if (status!==200&&status!==201) {
      Message.warning(msg)
    }

    return response
  }, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error)
  })
  // 添加实例方法
  Vue.prototype.$http = axios
}

export default MyHttpServer
