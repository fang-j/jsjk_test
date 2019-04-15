<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
    <loading text="加载中" v-model="isShowLoading"></loading>
  </div>
</template>

<script>
import { Loading } from 'vux'
import { mapGetters } from 'vuex'

export default {
  name: 'App',
  components: {
    Loading
  },
  computed: {
    ...mapGetters([
      'isShowLoading'
    ])
  }
}
</script>

<style lang="less">
  @import '~vux/src/styles/1px.less';
  #app {
    height: 100%;
    background : #f3f3f3;
  }
</style>
