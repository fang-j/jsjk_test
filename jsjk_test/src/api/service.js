import fetch from '../until/fetch'
import store from '../store'

// user
export function login (data) {
  return fetch({
    baseURL: process.env.VUE_APP_SYS_PATH,
    method: 'post',
    url: 'mainApp/login',
    data
  })
}

// 获取验证码
export function getVerificationCode () {
  return fetch({
    baseURL: process.env.VUE_APP_SYS_PATH,
    method: 'get',
    url: 'getVerificationCode'
  })
}

//  获取首页客户概况
export function rankCount () {
  return fetch({
    baseURL: process.env.VUE_APP_REST_PATH,
    method: 'get',
    url: `resource/customer/get/rankCount?token=${store.getters.token}`
  })
}

//  获取首页业务概况
export function report () {
  return fetch({
    baseURL: process.env.VUE_APP_REST_PATH,
    method: 'get',
    url: `index/part/city/report?token=${store.getters.token}`
  })
}

//  获取首页在途工单
export function order () {
  return fetch({
    baseURL: process.env.VUE_APP_REST_PATH,
    method: 'get',
    url: `index/part/order/app?token=${store.getters.token}`
  })
}

//  获取首页性能劣化统计
export function getAppPref () {
  return fetch({
    baseURL: process.env.VUE_APP_REST_PATH,
    method: 'get',
    url: `pref/getAppPref?token=${store.getters.token}`
  })
}

//  获取token
export function getToken () {
  return fetch({
    baseURL: process.env.VUE_APP_REST_PATH,
    url: `sys/heart?token=${store.getters.token}`,
    method: 'get'
  })
}

// 分页传参
export function addPageParam (payload = {}) {
  let url = ''
  const PAGE = 1
  const LIMIT = 50
  url += payload.page ? payload.page : PAGE
  url += '/'
  url += payload.limit ? payload.limit : LIMIT
  return url
}

//  客户信息列表
export function customer (params, payload) {
  let url = `resource/customer/getToken/${addPageParam(payload)}`
  url += `?token=${store.getters.token}`
  return fetch({
    baseURL: process.env.VUE_APP_REST_PATH,
    method: 'post',
    url,
    data: params
  })
}

//  专线列表
export function lineList (params, payload) {
  let url = `resource/service/getApp/${payload.page}/10`
  url += `?token=${store.getters.token}`
  url += params.lineType ? `&lineType=${params.lineType}` : ''
  url += params.customerCode ? `&customerCode=${params.customerCode}` : ''
  url += params.customerName ? `&customerName=${params.customerName}` : ''
  url += params.productNo ? `&productNo=${params.productNo}` : ''
  return fetch({
    baseURL: process.env.VUE_APP_REST_PATH,
    url,
    method: 'get'
  })
}

// 性能列表
export function prefList (params, payload) {
  let url = `pref/get/${addPageParam(payload)}`
  url += `?token=${store.getters.token}`
  url += params.type ? `&type=${params.type}` : ''
  url += params.customerCode ? `&customerCode =${params.customerCode}` : ''
  url += params.customerName ? `&customerName=${params.customerName}` : ''
  url += params.productNo ? `&productNo=${params.productNo}` : ''
  return fetch({
    baseURL: process.env.VUE_APP_REST_PATH,
    method: 'get',
    url
  })
}

// 工单查询
export function orderList (data, type, page, limit) {
  return fetch({
    baseURL: process.env.VUE_APP_REST_PATH,
    method: 'post',
    url: `order/${type}/get/${page}/${limit}?token=${store.getters.token}&type=app`,
    data
  })
}

// 开通工单环节信息查询
export function orderNodeFlow (type, orderId) {
  return fetch({
    baseURL: process.env.VUE_APP_REST_PATH,
    url: `order/${type}/get/joint?token=${store.getters.token}&orderId=${orderId}`,
    method: 'get'
  })
}

// 一户一案
// 客户信息
export function oneCustomerInfo (customerCode) {
  return fetch({
    baseURL: process.env.VUE_APP_RCPT_PATH,
    url: `jk-one-customer-info?customerCode=${customerCode}`,
    method: 'get'
  })
}

// 订购业务
export function orderBusiness (customerCode) {
  return fetch({
    baseURL: process.env.VUE_APP_RCPT_PATH,
    url: `jk-one-service-info?customerCode=${customerCode}`,
    method: 'get'
  })
}

// 售前售中情况
export function oneOrderOpenkcInfo (customerCode) {
  return fetch({
    baseURL: process.env.VUE_APP_RCPT_PATH,
    url: `jk-one-order-openkc-info?customerCode=${customerCode}`,
    method: 'get'
  })
}

// 投诉概括
export function oneComplainInfo (customerCode) {
  return fetch({
    baseURL: process.env.VUE_APP_RCPT_PATH,
    url: `jk-one-complain-info?customerCode=${customerCode}`,
    method: 'get'
  })
}

// 主动监控
export function oneFaultInfo (customerCode) {
  return fetch({
    baseURL: process.env.VUE_APP_RCPT_PATH,
    url: `jk-one-fault-info?customerCode=${customerCode}`,
    method: 'get'
  })
}

// 工单详情
export function capacityDetails (type, params) {
  let url = ''
  switch (type) {
    case 'trans':
      url += '/perf/trans/get/1/20'
      break
    case 'net':
      url += '/perf/net/new/get/1/20'
      break
    case 'apn':
      if (params.timeType === '5min') {
        url += '/perf/gprs/getMins/1/20'
      } else {
        url += '/perf/gprs/get/1/20'
      }
      break
    case 'sms':
      url += '/perf/sms/get/0/20'
      break
    case 'speech':
      if (params.timeType === 'month') {
        url += '/perf/speech/chaLen/1/20'
      } else {
        url += '/perf/ims/get/1/20'
      }
      break
    case 'mpls':
      url += 'perf/mspl/get/1/20'
      break
    default:
      url += ''
  }
  url += `?token=${store.getters.token}`
  return fetch({
    baseURL: process.env.VUE_APP_REST_PATH,
    method: 'post',
    url,
    data: params
  })
}

// 客户服务
// http://10.40.107.155:8088/jklsm/rs/rcpt/jk-one-custowmer-polling?customerCode=25010003877
// http://10.40.107.155:8088/jklsm/rs/rcpt/jk-one-custowmer-visit?customerCode=25010004030
// http://10.40.107.155:8088/jklsm/rs/rcpt/jk-one-custowmer-important?customerCode=52310000007
// http://10.40.107.155:8088/jklsm/rs/rcpt/jk-one-custowmer-cutnet?customerCode=51210000843
export function customerService (type, customerCode) {
  return fetch({
    baseURL: process.env.VUE_APP_RCPT_PATH,
    method: 'get',
    url: `/jk-one-custowmer-${type}?customerCode=${customerCode}`
  })
}

// 专线拓扑
export function lineTopo (serviceId) {
  return fetch({
    baseURL: process.env.VUE_APP_REST_PATH,
    method: 'get',
    url: `/topo/get/${serviceId}?token=${store.getters.token}`
  })
}

// 退出
export function logout () {
  return fetch({
    baseURL: process.env.VUE_APP_REST_PATH,
    url: `sys/logout?token=${store.getters.token}`,
    method: 'get'
  })
}

//  修改密码
export function psw (params) {
  let url = 'manger/view/cust/pwd'
  url += `?token=${store.getters.token}`
  return fetch({
    baseURL: process.env.VUE_APP_REST_PATH,
    url,
    method: 'post',
    data: params
  })
}

//  获取安装次数
export function getInstallationTimes (stime, etime) {
  let url = 'jk-line-app-downLoad?'
  url += stime ? `&startTime=${stime}` : ''
  url += stime ? `&endTime=${etime}` : ''
  return fetch({
    baseURL: process.env.VUE_APP_RCPT_PATH,
    url,
    method: 'get'
  })
}
