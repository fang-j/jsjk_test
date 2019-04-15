import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import common from './module/common'
import user from './module/user'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    common,
    user
  },
  getters
})
