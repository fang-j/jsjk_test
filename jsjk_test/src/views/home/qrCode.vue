<template>
  <div class="wrapper">
    <div class="item">
      <divider>维护视图APP Android版</divider>
      <qrcode value="https://fir.im/fm8l" type="img"></qrcode>
    </div>
    <div class="item">
      <divider>维护视图APP IOS版</divider>
      <qrcode value="https://fir.im/eknl" type="img"></qrcode>
    </div>
    <div class="item">
      <divider>客户视图APP Android版</divider>
      <qrcode value="https://fir.im/unkw" type="img"></qrcode>
    </div>
    <div class="item">
      <divider>客户视图APP IOS版</divider>
      <qrcode value="https://fir.im/g47y" type="img"></qrcode>
    </div>
  </div>
</template>

<script>
import { Qrcode, Divider } from 'vux'

export default {
  name: 'qrCode',
  components: {
    Qrcode,
    Divider
  }
}
</script>

<style scoped lang="less">
  .wrapper {
    position: absolute;
    top: 0;
    bottom: 0px;
    width: 100%;
    overflow-y: auto;
  }

  .item {
    text-align: center;
    &:last-of-type{
      margin-bottom: 20px;
    }
  }
</style>
