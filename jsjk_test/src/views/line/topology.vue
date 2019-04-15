<template>
  <div class="wrapper">
    <div class="item" v-for="(item,index) in dataList" :key="index">
      <img :src="'./static/topo/'+item.type+'.png'">
      <p>{{item.text}}</p>
      <div class="line" v-if="index<dataList.length-1"></div>
    </div>
  </div>
</template>

<script>
import { lineTopo } from '@/api/service'

export default {
  name: 'topology',
  data () {
    return {
      serviceId: this.$route.query.serviceId,
      lineType: this.$route.query.lineType,
      dataList: []
    }
  },
  created () {
    this.getLineTopo()
  },
  methods: {
    getLineTopo () {
      lineTopo(this.serviceId).then(result => {
        this.dataList = result.nodes
      })
    }
  }
}
</script>

<style scoped lang="less">
  .wrapper {
    height: 100%;
    padding: 30px 0;
  }

  .item {
    display: flex;
    flex-direction: column;
    align-items: center;

    img {
      width: 50px;
      height: 50px;
    }

    p {
      font-size: 13px;
      text-align: center;
      margin-top: 2px;
    }

    .line {
      height: 50px;
      width: 2px;
      background: #74dfff;
    }
  }
</style>
