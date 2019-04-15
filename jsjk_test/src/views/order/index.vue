<template>
  <div class="wrapper">
    <div class="item" v-for="(item,index) in list" :key="index" @click="openOrderList(item)">
      <img :src="item.src">
      <p class="name">{{item.name}}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'index',
  data () {
    return {
      list: [
        { name: '勘察工单', src: './static/customer/list/line-kc.png', type: 'check' },
        { name: '开通工单', src: './static/customer/list/line-kt.png', type: 'open' },
        { name: '投诉工单', src: './static/customer/list/line-ts.png', type: 'comp' },
        { name: '故障工单', src: './static/customer/list/line-gz.png', type: 'fault' }
      ]
    }
  },
  methods: {
    openOrderList (data) {
      this.$router.push({
        name: 'orderList',
        query: {
          title: data.name,
          type: data.type,
          timestamp: new Date().getTime()
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
  .wrapper {
    height: 100%;
    background: #fff;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    padding: 12px;
  }

  .item {
    width: 33.33%;
    text-align: center;
    margin-bottom: 10px;
    height: 90px;

    img {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      margin-top: 5px;
      margin-bottom: 6px;
    }

    .name {
      font-size: 12px;
    }
  }
</style>
