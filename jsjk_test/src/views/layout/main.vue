<template>
  <div class="layout">
    <header-bar v-show="$route.meta.showHeader"></header-bar>
    <div class="main">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
  </div>
</template>

<script>
import HeaderBar from './components/headerBar'

export default {
  components: {
    HeaderBar
  },
  data () {
    return {}
  }
}
</script>

<style scoped lang="less">
  .layout {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .main {
    position: absolute;
    top: 80px;
    bottom: 0;
    width: 100%;
  }
</style>
