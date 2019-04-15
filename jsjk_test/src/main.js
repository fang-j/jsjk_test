// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './style/index.less'
import store from './store'
import axios from 'axios'
import { AlertPlugin } from 'vux'
import './iconfont/iconfont.css'
import './permisssion'
// dasdasadadssa
// dsdsafvcx
// xcffef
Vue.prototype.axios = axios
Vue.config.productionTip = false
Vue.use(AlertPlugin)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
