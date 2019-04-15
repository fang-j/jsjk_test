import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/views/layout/main'
import Layout from '@/views/layout/index'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/index')
    },
    {
      path: '/main',
      name: 'main',
      component: Main,
      redirect: '/home',
      children: [{
        path: '/home',
        name: 'home',
        component: () => import('@/views/home/index'),
        meta: { keepAlive: true, showHeader: true }
      }]
    },
    {
      path: '/layout',
      name: 'layout',
      component: Layout,
      children: [
        {
          path: '/customer',
          name: 'customer',
          component: () => import('@/views/customer/index'),
          meta: { title: '客户信息', showHeaderMenu: true, keepAlive: true, savePosition: '' }
        },
        {
          path: '/line',
          name: 'line',
          component: () => import('@/views/line/index'),
          meta: { title: '专线列表', showHeaderMenu: true, keepAlive: true }
        },
        {
          path: '/oneCase',
          name: 'oneCase',
          component: () => import('@/views/customer/oneCase'),
          meta: { title: '', showHeaderMenu: false }
        },
        {
          path: '/list',
          name: 'list',
          component: () => import('@/views/customer/list'),
          meta: { title: '', showHeaderMenu: false }
        },
        {
          path: '/customerInfo',
          name: 'customerInfo',
          component: () => import('@/views/customer/customerInfo'),
          meta: { title: '', showHeaderMenu: false }
        },
        // 工单查询
        {
          path: '/order',
          name: 'order',
          component: () => import('@/views/order/index'),
          meta: { title: '工单查询', showHeaderMenu: false }
        },
        {
          path: '/orderList',
          name: 'orderList',
          component: () => import('@/views/order/orderList'),
          meta: { title: '', showHeaderMenu: true }
        },
        {
          path: '/nodeFlow',
          name: 'nodeFlow',
          component: () => import('@/views/order/nodeFlow'),
          meta: { title: '', showHeaderMenu: false }
        },
        {
          path: '/nodeInfo',
          name: 'nodeInfo',
          component: () => import('@/views/order/nodeInfo'),
          meta: { title: '', showHeaderMenu: false }
        },
        {
          path: '/kcDetails',
          name: 'kcDetails',
          component: () => import('@/views/order/kcDetails'),
          meta: { title: '', showHeaderMenu: false }
        },
        //  性能查询
        {
          path: '/capacity',
          name: 'capacity',
          component: () => import('@/views/capacity/index'),
          meta: { title: '性能查询', showHeaderMenu: true, keepAlive: true, savePosition: '' }
        },
        {
          path: '/capacityDetails',
          name: 'capacityDetails',
          component: () => import('@/views/capacity/capacityDetails'),
          meta: { title: '性能查询', showHeaderMenu: false }
        },
        {
          path: '/topology',
          name: 'topology',
          component: () => import('@/views/line/topology'),
          meta: { title: '性能查询', showHeaderMenu: false }
        },
        // 设置
        {
          name: 'setting',
          path: '/setting',
          component: () => import('@/views/home/setting'),
          meta: { title: '设置' }
        },
        // 二维码
        {
          path: '/qrCode',
          name: 'qrCode',
          component: () => import('@/views/home/qrCode'),
          meta: { title: '二维码' }
        },
        // 重置密码
        {
          path: '/resetPwd',
          name: 'resetPwd',
          component: () => import('@/views/home/resetPwd'),
          meta: { title: '修改密码' }
        },
        // 安装次数
        {
          path: '/installCount',
          name: 'installCount',
          component: () => import('@/views/home/installCount'),
          meta: { title: '安装次数统计' }
        }
      ]
    }
  ]
})
