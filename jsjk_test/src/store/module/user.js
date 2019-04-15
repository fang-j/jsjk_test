export default {
  state: {
    customerName: '',
    loginName: '',
    token: '',
    domainId: '',
    roleId: ''
  },
  mutations: {
    SET_STATE_CUSTOMERNAME (state, cusName) {
      state.customerName = cusName
    },
    SET_STATE_LOGINNAME (state, loginName) {
      state.loginName = loginName
    },
    SET_STATE_TOKEN (state, token) {
      state.token = token
    },
    SET_STATE_DOMAINID (state, domainId) {
      state.domainId = domainId
    },
    SET_STATE_ROLEID (state, roleid) {
      state.roleId = roleid
    }
  },
  actions: {
    setUserInfo ({ commit }, data) {
      commit('SET_STATE_CUSTOMERNAME', data.customerName)
      commit('SET_STATE_LOGINNAME', data.loginName)
      commit('SET_STATE_TOKEN', data.token)
      commit('SET_STATE_DOMAINID', data.domainId)
      commit('SET_STATE_ROLEID', data.roleId)
    }
  }
}
