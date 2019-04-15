export default {
  state: {
    isShowLoading: false,
    showPopup: false,
    areaList: [
      { name: 'province', value: '省中心' },
      { name: 'suqian', value: '宿迁' },
      { name: 'yangzhou', value: '扬州' },
      { name: 'zhenjiang', value: '镇江' },
      { name: 'changzhou', value: '常州' },
      { name: 'taizhou', value: '泰州' },
      { name: 'xuzhou', value: '徐州' },
      { name: 'nanjing', value: '南京' },
      { name: 'nantong', value: '南通' },
      { name: 'lianyungang', value: '连云港' },
      { name: 'yancheng', value: '盐城' },
      { name: 'huaian', value: '淮安' },
      { name: 'wuxi', value: '无锡' }
    ]
  },
  mutations: {
    SET_LOADING_STATE: (state, isShow) => {
      state.isShowLoading = isShow
    },
    SET_SHOWPOPUP_STATE: (state, isShow) => {
      state.showPopup = isShow
    }
  },
  actions: {
    showLoading ({ commit }) {
      commit('SET_LOADING_STATE', true)
    },
    hideLoading ({ commit }) {
      commit('SET_LOADING_STATE', false)
    },
    showPopup ({ commit }, isShow) {
      commit('SET_SHOWPOPUP_STATE', isShow)
    }
  }
}
