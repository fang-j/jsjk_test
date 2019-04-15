<template>
  <div class="header">
    <span class="left" @click="$router.go(-1)"></span>
    <div class="title">{{title}}</div>
    <i class="iconfont" v-show="$route.meta.showHeaderMenu" @click="showMenu">&#xe6a9;</i>
  </div>
</template>

<script>

export default {
  data () {
    return {
      title: ''
    }
  },
  methods: {
    showMenu () {
      this.$store.dispatch('showPopup', true)
    },
    setTitle (title) {
      this.title = title
    }
  }
}
</script>

<style scoped lang="less">
  .header {
    line-height: 44px;
    height: 44px;
    background: #5a97ff;
    display: flex;
  }

  .left {
    padding: 0 22px;
    position: absolute;
    top: 0;
    height: 44px;
    line-height: 44px;

    &:before {
      position: absolute;
      content: "";
      width: 12px;
      height: 12px;
      top: 50%;
      left: 50%;
      transform: translateX(-65%) translateY(-50%) rotate(45deg);
      background: #fff;
    }

    &:after {
      position: absolute;
      content: "";
      width: 12px;
      height: 12px;
      top: 50%;
      left: 50%;
      transform: translate(-40%, -50%) rotate(45deg);
      background: #5a97ff;
    }
  }

  .title {
    flex: 1;
    text-align: center;
    color: #fff;
    font-size: 15px;
  }

  .iconfont {
    color: #fff;
    padding: 0 14px;
    position: absolute;
    right: 0;
    top: 0;
  }
</style>
