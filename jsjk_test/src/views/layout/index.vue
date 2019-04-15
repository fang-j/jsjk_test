<template>
  <div class="layout">
    <header-back ref="headerBack"></header-back>
    <div class="main">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
  </div>
</template>

<script>
import HeaderBack from './components/headerBack'

export default {
  components: { HeaderBack },
  watch: {
    // to：即将进入的路由
    // 发生改变时触发
    $route (to) {
      // console.log('to:')
      // console.log(to.meta.title)
      this.$refs.headerBack.setTitle(to.meta.title)
    }
  },
  // 第一次进入时触发，如果为缓存页面则不触发
  // 获取当前路由的title
  mounted () {
    // console.log('mo:')
    this.$refs.headerBack.setTitle(this.$route.meta.title)
  }

}
</script>

<style scoped lang="less">
  .layout {
    height: 100%;
  }

  .main {
    position: absolute;
    width: 100%;
    top: 44px;
    bottom: 0;
  }
</style>
