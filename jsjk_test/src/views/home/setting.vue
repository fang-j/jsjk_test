<template>
  <div class="wrapper">
    <div class="item">
      <div class="title" @click="open('resetPwd')">修改密码</div>
    </div>
    <div class="item" @click="open('qrCode')">
      <div class="title">APP二维码</div>
    </div>
    <div class="item" @click="open('installCount')">
      <div class="title">安装次数统计</div>
    </div>
    <div class="btn-box">
      <div class="btn" @click="exit">系统退出</div>
    </div>
  </div>
</template>

<script>
import { logout } from '@/api/service'

export default {
  name: 'setting',
  methods: {
    open (name) {
      this.$router.push({
        name: name
      })
    },
    exit () {
      logout().then(result => {
        if (result.message === 'success') {
          window.location.reload()
        } else {
          this.$vux.alert.show({ content: result.message })
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
  .wrapper {
    position: absolute;
    width: 100%;
    top: 0;
    bottom: 0;
    overflow-y: auto;
  }

  .item {
    background: #fff;
    padding-left: 24px;
    position: relative;
    margin-top: 10px;

    &:before {
      content: "";
      position: absolute;
      top: 11px;
      left: 13px;
      width: 4px;
      height: 14px;
      border-radius: 4px;
      background: @theme-color;
    }

    .title {
      line-height: 36px;
      height: 36px;
      font-size: 14px;
    }
  }

  .btn-box {
    padding: 0 10px;
    margin-top: 20px;

    .btn {
      line-height: 42px;
      height: 44px;
      border: 1px solid rgba(0, 0, 0, 0.2);
      background: @theme-color;
      text-align: center;
      font-size: 18px;
      color: #fff;
      border-radius: 5px;
    }
  }
</style>
