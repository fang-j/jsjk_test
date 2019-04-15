<template>
  <div class="wrapper">
    <div class="pane1">
      <div class="item-box">
        <div class="item" v-for="(item,index) in tabList" @click="openCustomer(item)" :key="index">
          <img :src="item.img">
          <p>{{item.name}}</p>
        </div>
      </div>
    </div>
    <div class="pane1">
      <div class="title vux-1px-b">客户概况</div>
      <div class="cuser-box">
        <div class="item vux-1px-r" v-for="(item,index) in rankCountList" :key="index"
             @click="openLevelCus(item.SERVICE_LEVEL)">
          <img :src="'../../../static/home/home-'+item.SERVICE_LEVEL+'.png'">
          <p>{{item.NUM}}</p>
        </div>
      </div>
    </div>
    <div class="pane1">
      <div class="title vux-1px-b">业务概况</div>
      <div class="chart" ref="chart">
      </div>
    </div>
    <div class="pane1">
      <div class="title vux-1px-b">在途工单</div>
      <div class="item-box-1">
        <div class="item vux-1px-r">
          <div class="option" @click="openOrderList('勘察工单','check')">
            勘察
            <span class="count">{{orderList.checkOrderDealing}}</span>
            <span>/{{orderList.checkOrderCount}}</span>
          </div>
          <div class="option" @click="openOrderList('开通工单','open')">
            开通
            <span class="count">{{orderList.openOrderDealing}}</span>
            <span>/{{orderList.openOrderCount}}</span>
          </div>
        </div>
        <div class="item">
          <div class="option" @click="openOrderList('投诉工单','comp')">
            投诉
            <span class="count">{{orderList.complainOrderDealing}}</span>
            <span>/{{orderList.complainOrderCount}}</span>
          </div>
          <div class="option" @click="openOrderList('故障工单','fault')">
            故障
            <span class="count">{{orderList.alarmOrderDealing}}</span>
            <span>/{{orderList.alarmOrderCount}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="pane1">
      <div class="title vux-1px-b">性能劣化</div>
      <div class="item-box-1">
        <div class="item vux-1px-r">
          <div class="option" v-for="(item,index) in prefList" v-if="index<3" :key="index"
               @click="openCapacity(item.LINE_TYPE)">
            <span>{{item.LINE_TYPE.substring(0,item.LINE_TYPE.length-2)}}</span>
            <span class="count">{{item.TOTAL}}</span>
            <span>/{{item.ALARMCOUNT}}</span>
          </div>
        </div>
        <div class="item">
          <div class="option" v-for="(item,index) in prefList" v-if="index>=3" :key="index"
               @click="openCapacity(item.LINE_TYPE)">
            <span v-if="item.LINE_TYPE === 'GPRS专线'">APN</span>
            <span v-else>{{item.LINE_TYPE.substring(0,item.LINE_TYPE.length-2)}}</span>
            <span class="count">{{item.ALARMCOUNT}}</span>
            <span>/{{item.TOTAL}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { rankCount, report, order, getAppPref } from '@/api/service'
import test from '../../test/index'

const echarts = require('echarts')
export default {
  name: 'home',
  components: {
    test
  },
  data () {
    return {
      rankCountList: [],
      reportList: [],
      tabList: [
        { name: '客户信息', img: './static/home/home-busi.png', type: 'customer' },
        { name: '业务信息', img: './static/home/home-capacity.png', type: 'line' },
        { name: '工单查询', img: './static/home/home-order.png', type: 'order' },
        { name: '性能查询', img: './static/home/home-zzfw.png', type: 'capacity' }
      ],
      orderList: '',
      prefList: '',
      timestamp: '',
      type: ''
    }
  },
  activated () {
    const time = Number(this.$route.query.timestamp)
    if (this.timestamp !== time) {
      this.timestamp = time
      this.loadData()
    }
  },
  methods: {
    loadData () {
      this.getRankCount()
      this.getReport()
      this.getOrder()
      this.getAppPrefInfo()
      // Promise.all([
      //   rankCount(),
      //   report(),
      //   order(),
      //   getAppPref()
      // ]).then(result => {
      //   if (result[0].length) {
      //     this.rankCountList = result[0]
      //     this.reportList = result[1].rows.map(item => {
      //       return { name: item.type, value: item.serviceCount }
      //     })
      //     this.orderList = result[2]
      //     this.prefList = result[3].rows
      //     this.initChart()
      //   }
      // }).catch(error => {
      //   this.$vux.alert.show({ content: error })
      // })
    },
    initChart () {
      // this.$nextTick(() => {
      let myChart = echarts.init(this.$refs.chart)
      const legent = []
      this.reportList.forEach(item => {
        legent.push(item.name)
      })
      myChart.setOption({
        tooltip: {
          type: 'axios'
        },
        legend: {
          orient: 'vertical',
          right: '10',
          left: 'right',
          data: legent
        },
        grid: {
          x: '35'
        },
        series: [{
          name: '销量',
          type: 'pie',
          radius: '45%',
          center: ['35%', '50%'],
          label: {
            formatter: '{c}条'
          },
          color: ['#f79002', '#56c5aa', '#1ca3f9', '#7dc065', '#ff6c6f', '#5a97ff'],
          data: this.reportList,
          itemStyle: {
            normal: {}
          }
        }]
      })
      // const that = this
      myChart.on('click', params => {
        this.$router.push({
          name: 'line',
          query: {
            timestamp: new Date().getTime(),
            type: params.data.name
          }
        })
      })
      // })
    },
    // 获取客户概况数据
    getRankCount () {
      rankCount().then(result => {
        this.rankCountList = result
      }).catch(err => {
        this.$vux.alert.show({ content: err.message })
      })
    },
    // 获取业务概况数据
    getReport () {
      report().then(result => {
        this.reportList = result.rows.map(item => {
          return { name: item.type, value: item.serviceCount }
        })
        this.initChart()
      }).catch(err => {
        this.$vux.alert.show({ content: err.message })
      })
    },
    // 获取在途工单数据
    getOrder () {
      order().then(result => {
        this.orderList = result
      }).catch(err => {
        this.$vux.alert.show({ content: err.message })
      })
    },
    // 获取性能裂化数据
    getAppPrefInfo () {
      getAppPref().then(result => {
        this.prefList = result.rows
      }).catch(err => {
        this.$vux.alert.show({ content: err.message })
      })
    },
    openCustomer (data) {
      this.$router.push({
        name: data.type,
        query: {
          timestamp: new Date().getTime()
        }
      })
    },
    openLevelCus (level) {
      this.$router.push({
        name: 'customer',
        query: {
          level: level
        }
      })
    },
    openCapacity (type) {
      switch (type) {
        case '传输专线':
          this.type = 'trans'
          break
        case 'GPRS专线':
          this.type = 'apn'
          break
        case '语音专线':
          this.type = 'speech'
          break
        case '互联网专线':
          this.type = 'net'
          break
        case '短信专线':
          this.type = 'sms'
          break
        default:
      }
      this.$router.push({
        name: 'capacity',
        query: {
          type: this.type
        }
      })
    },
    openOrderList (title, type) {
      this.$router.push({
        name: 'orderList',
        query: {
          title: title,
          type: type,
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
    overflow-y: auto;
    padding: 10px 0;
  }

  .pane1 {
    background: #fff;
    margin-bottom: 10px;

    .item-box {
      display: flex;

      .item {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 10px 0;
        cursor: pointer;

        img {
          width: 40px;
          height: 40px;
        }

        p {
          margin-top: 4px;
          color: #999;
          font-size: 12px;
          text-align: center;
        }
      }
    }

    .title {
      position: relative;
      line-height: 36px;
      height: 36px;
      font-size: 14px;
      padding-left: 24px;

      &:before {
        content: "";
        position: absolute;
        width: 4px;
        height: 14px;
        background: #5a97ff;
        top: 11px;
        left: 13px;
        border-radius: 4px;
      }
    }

    .cuser-box {
      display: flex;

      .item {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px 10px;
        cursor: pointer;

        img {
          width: 28px;
          height: 28px;
        }

        p {
          margin-top: 6px;
          font-size: 16px;
          line-height: 20px;
          color: #138939;
        }
      }
    }

    .chart {
      height: 240px;
      width: 100%;
      padding: 10px 0;
    }

    .item-box-1 {
      display: flex;
      padding: 10px 0;

      .item {
        flex: 1;

        .option {
          text-align: center;
          font-size: 14px;
          line-height: 24px;

          .count {
            color: #F85F57;
          }
        }
      }
    }
  }
</style>
