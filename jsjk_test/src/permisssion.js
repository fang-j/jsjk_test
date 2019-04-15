import router from './router/index'
import store from './store'
import { getToken } from './api/service'
import { AlertModule } from 'vux'

// let a = 1
const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  if (store.getters.token) {
    getToken().then(result => {
      if (result.message === 'success') {
        // 设置头部标题
        to.meta.title = to.query.title || to.meta.title
        next()
      } else {
        AlertModule.show({
          content: '登录失效，请重新登录',
          onHide () {
            window.location.reload()
          }
        })
      }
    })
  } else if (whiteList.indexOf(to.path) !== -1) {
    next()
  } else {
    next('/login')
  }
  // if (store.getters.token) {
  //   getToken().then(result => {
  //     if (result.message === 'success') {
  //       // 设置头部导航标题
  //       to.meta.title = to.query.title || to.meta.title
  //       next()
  //     } else {
  //       AlertModule.show({
  //         content: '登录失效，请重新登录',
  //         onHide () {
  //           window.location.reload()
  //         }
  //       })
  //     }
  //   })
  // } else if (whiteList.indexOf(to.path) !== -1) {
  //   next()
  // } else {
  //   next('/login')
  // }
})
