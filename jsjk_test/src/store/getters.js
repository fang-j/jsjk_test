const getters = {
  // common
  isShowLoading: state => state.common.isShowLoading,
  areaList: state => state.common.areaList,
  isShowPopup: state => state.common.showPopup,
  // user
  customerName: state => state.user.customerName,
  loginName: state => state.user.loginName,
  token: state => state.user.token,
  domainId: state => state.user.domainId,
  roleId: state => state.user.roleId
}
export default getters
