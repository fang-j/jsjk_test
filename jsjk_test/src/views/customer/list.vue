<template>
  <div class="wrapper">
    <div class="item" v-for="(item,index) in list" :key="index" @click="open(item)">
      <img :src="item.src" alt="">
      <p>{{item.name}}</p>
    </div>

  </div>
</template>

<script>
export default {
  // beforeRouteEnter (to, from, next) {
  //   to.meta.title = to.query.title
  //   next()
  // },
  data () {
    return {
      list: [
        { name: '客户信息', src: './static/customer/list/line-hlw.png', to: 'customerInfo', type: 'kh' },
        { name: '订购业务', src: './static/customer/list/line-cs.png', to: 'line', type: 'dg' },
        { name: '勘察工单', src: './static/customer/list/line-kc.png', to: 'orderList', type: 'check' },
        { name: '开通工单', src: './static/customer/list/line-kt.png', to: 'orderList', type: 'open' },
        { name: '投诉工单', src: './static/customer/list/line-ts.png', to: 'orderList', type: 'comp' },
        { name: '故障工单', src: './static/customer/list/line-gz.png', to: 'orderList', type: 'fault' },
        { name: '一户一案', src: './static/customer/list/line-mpls.png', to: 'oneCase', type: '' }
      ],
      title: '',
      code: '',
      query: ''
    }
  },
  created () {
    this.initData()
  },
  methods: {
    initData () {
      this.title = this.$route.query.title
      this.code = this.$route.query.code
    },
    open (data) {
      switch (data.to) {
        case 'customerInfo' :
          this.query = { title: this.title, code: this.code, timestamp: new Date().getTime() }
          break
        case 'line':
          this.query = { title: this.title, code: this.code, timestamp: new Date().getTime() }
          break
        case 'orderList':
          this.query = { title: this.title, code: this.code, timestamp: new Date().getTime(), type: data.type }
          break
        case 'oneCase' :
          this.query = { title: this.title, code: this.code, timestamp: new Date().getTime() }
          break
        default:
      }
      this.$router.push({
        name: data.to,
        query: this.query
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
    margin-bottom: 10px;
    text-align: center;
    font-size: 12px;
    height: 90px;
    padding: 5px;

    img {
      height: 48px;
      width: 48px;
      border-radius: 50%;
      margin-bottom: 5px;
    }
  }
</style>
