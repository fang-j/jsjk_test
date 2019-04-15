import axios from 'axios'
import store from '../store'
// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_PATH, // api的baseurl
  timeout: 30000 // 请求超时时间
})
// request拦截器=>对请求参数做处理
service.interceptors.request.use(config => {
  store.dispatch('showLoading')
  return config
}, error => { // 请求错误处理
  store.dispatch('hideLoading')
  Promise.reject(error)
})
// response拦截器==>对响应做处理
service.interceptors.response.use(response => {
  store.dispatch('hideLoading')
  return response.data
}, error => {
  store.dispatch('hideLoading')
  return Promise.reject(error)
})
export default service
