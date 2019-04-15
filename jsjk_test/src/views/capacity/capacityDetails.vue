<template>
  <div class="wrapper">
    <div class="content-wrapper">
      <div class="head">
        <selector title="时间粒度" direction="rtl" v-model="timeType" :options="timeOption"
                  @on-change="changeTime"></selector>
      </div>
      <div class="time-picker">
        <span class="name">时间:</span>
        <input type="text" placeholder="请选择开始时间" v-model="startTime" id="startTime">
        <span>-</span>
        <input type="text" placeholder="请选择结束时间" v-model="endTime" id="endTime">
        <div class="btn" @click="search">查询</div>
      </div>
      <div class="chart-wrapper">
        <div class="chart-item">
          <div class="chart" ref="chart" v-show="!noResult"></div>
          <div class="noResult"  v-show="noResult">
            <img src="./img/nodata.png">
          </div>
        </div>
        <div class="chart-item">
          <div class="chart" ref="chart2" v-show="!noResult"></div>
          <div class="noResult"  v-show="noResult">
            <img src="./img/nodata.png">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Selector } from 'vux'
import moment from 'moment'
import { capacityDetails } from '@/api/service'

const echarts = require('echarts')

export default {
  components: {
    Selector
  },
  data () {
    return {
      timeType: 'day',
      timeOption: [
        { key: 'day', value: '日' },
        { key: 'min', value: '15分钟' },
        { key: 'hour', value: '小时' },
        { key: 'month', value: '月' }
      ],
      startTime: '',
      endTime: '',
      type: this.$route.query.type,
      productNo: this.$route.query.productNo,
      flowid: this.$route.query.flowid,
      noResult: false, // 无数据
      xTime: '',
      xAxisOptions: [], // 横坐标时间
      legend: [], // 图例组件1
      legend2: [], // 图例组件2
      seriesDataOne1: [],
      seriesDataOne2: [],
      seriesDataTwo1: [],
      seriesDataTwo2: []
    }
  },
  created () {
    this.startTime = moment().subtract(6, 'd').format('YYYY-MM-DD HH:mm:ss') // 取6天前的时间
    this.endTime = moment().format('YYYY-MM-DD HH:mm:ss') // 当前时间
    this.initDate()
  },
  mounted () {
    // eslint-disable-next-line
    laydate.render({
      elem: '#startTime',
      type: 'datetime',
      theme: '#5a97ff',
      value: this.startTime,
      change: val => {
        this.startTime = val
      }
    })
    // eslint-disable-next-line
    laydate.render({
      elem: '#endTime',
      type: 'datetime',
      theme: '#5a97ff',
      value: this.endTime,
      change: val => {
        this.endTime = val
      }
    })
  },
  methods: {
    initDate () {
      if (this.type === 'net' || this.type === 'sms' || this.type === 'mpls') {
        this.timeOption = [
          { key: 'day', value: '日' },
          { key: '15min', value: '15分钟' },
          { key: 'hour', value: '小时' },
          { key: 'month', value: '月' }
        ]
      }
      if (this.type === 'speech') {
        this.timeOption = [
          { key: 'day', value: '日' },
          { key: 'min', value: '15分钟' },
          { key: 'hour', value: '小时' }
        ]
      }
      this.getCapacityDetails()
    },
    // 截取时间
    initTime (date) {
      switch (this.timeType) {
        case 'day':
          this.xTime = date.substring(5, 10)
          break
        case 'min':
          this.xTime = date.substring(11, 16)
          break
        case '5min':
          this.xTime = date.substring(11, 16)
          break
        case '15min':
          this.xTime = date.substring(11, 16)
          break
        case 'hour':
          this.xTime = date.substring(11, 16)
          break
        case 'month':
          this.xTime = date.substring(0, 7)
          break
      }
    },
    getCapacityDetails () {
      const params = {}
      this.seriesDataOne1 = []
      this.seriesDataOne2 = []
      this.seriesDataTwo1 = []
      this.seriesDataTwo2 = []
      this.xAxisOptions = []
      params.timeType = this.timeType
      switch (this.type) {
        case 'trans':
          params.productNo = this.productNo
          params.flowid = this.flowid
          params.timeStamp = this.startTime
          params.timeStampEnd = this.endTime
          break
        case 'net':
          params.productNo = this.productNo
          params.startDate = this.startTime
          params.endDate = this.endTime
          break
        case 'apn':
          params.productNo = this.productNo
          params.timeStamp = this.startTime
          params.endDate = this.endTime
          break
        case 'sms':
          params.productNo = this.productNo
          params.startTime = this.startTime
          params.endTime = this.endTime
          break
        case 'speech':
          params.customerCode = this.productNo
          if (this.timeType === 'month') {
            params.timeStamp = this.startTime
            params.timeStampEnd = this.endTime
          } else {
            params.startTime = this.startTime
            params.endTime = this.endTime
          }
          break
        case 'mpls':
          params.flowid = this.flowid
          params.startDate = this.startTime
          params.endDate = this.endTime
          break
        default:
      }
      capacityDetails(this.type, params).then(result => {
        const data = result.rows
        if (data.length > 0) {
          data.forEach(item => {
            switch (this.type) {
              case 'trans':
                this.initTime(item.collecttime)
                this.xAxisOptions.push(this.xTime)
                this.legend = ['端口入流量(MB)', '端口出流量(MB)']
                this.legend2 = ['端口入带宽利用率', '端口出带宽利用率']
                this.seriesDataOne1.push(item.portIn)
                this.seriesDataOne2.push(item.portOut)
                this.seriesDataTwo1.push(item.inUtility)
                this.seriesDataTwo2.push(item.outUtility)
                break
              case 'net':
                this.initTime(item.timeStamp)
                this.xAxisOptions.push(this.xTime)
                this.legend = ['上行流量(MB)', '下行流量(MB)']
                this.legend2 = ['上行带宽利用率(%)', '下行带宽利用率(%)']
                this.seriesDataOne1.push(item.portIn)
                this.seriesDataOne2.push(item.portOut)
                this.seriesDataTwo1.push(item.inUtility)
                this.seriesDataTwo2.push(item.outUtility)
                break
              case 'apn':
                this.initTime(item.starttime)
                this.xAxisOptions.push(this.xTime)
                this.legend = ['上行流量(MB)', '下行流量(MB)']
                this.legend2 = ['PDP激活成功率(%)', 'IP地址利用率(%)']
                this.seriesDataOne1.push(item.incoctpgwApn)
                this.seriesDataOne2.push(item.outoctpgwApn)
                this.seriesDataTwo1.push(item.succ4gRate)
                this.seriesDataTwo2.push(item.ippoolRate)
                break
              case 'mpls':
                this.initTime(item.timeStamp)
                this.xAxisOptions.push(this.xTime)
                this.legend = ['上行流量(MB)', '下行流量(MB)']
                this.legend2 = ['上行带宽利用率(%)', '下行带宽利用率(%)']
                this.seriesDataOne1.push(item.portIn)
                this.seriesDataOne2.push(item.portOut)
                this.seriesDataTwo1.push(item.inUtility)
                this.seriesDataTwo2.push(item.outUtility)
                break
              case 'speech':
                this.initTime(item.startTime)
                this.xAxisOptions.push(this.xTime)
                this.legend = ['呼叫话务量(erl)', '被叫话务量(erl)']
                this.legend2 = ['主叫接通率(%)', '被叫接通率(%)']
                this.seriesDataOne1.push(item.callingSetupTime)
                this.seriesDataOne2.push(item.calledSetupTime)
                this.seriesDataTwo1.push(item.callingSuccRate)
                this.seriesDataTwo2.push(item.calledSuccRate)
                break
              case 'sms':
                this.initTime(item.startTime)
                this.xAxisOptions.push(this.xTime)
                this.legend = ['短信发送量(条)', '短信接收量(条)']
                this.legend2 = ['短信发送成功率(%)', '短信接收成功率(%)']
                this.seriesDataOne1.push(item.downSubmitTotalCount)
                this.seriesDataOne2.push(item.upSendCount)
                this.seriesDataTwo1.push(item.sucDownSubmitUtil)
                this.seriesDataTwo2.push(item.sucUpSendUtil)
                break
            }
          })
          console.log(this.seriesDataOne1)
          this.initEchart()
          this.initEchartTwo()
        } else {
          this.noResult = true
        }
      })
    },
    initEchart () {
      const myChart = echarts.init(this.$refs.chart)
      myChart.setOption({
        tooltip: {
          show: true,
          trigger: 'item'
        },
        color: ['#28d5c7', '#5a97ff'],
        legend: {
          x: 'center',
          y: 'bottom',
          data: this.legend
        },
        grid: {
          containLabel: true,
          left: '3',
          right: '4',
          top: '15',
          bottom: '30'
        },
        xAxis: [
          {
            data: this.xAxisOptions
          }
        ],
        yAxis: [
          {
            type: 'value',
            splitLine: { show: false },
            axisLine: {
              lineStyle: {
                color: '#666666',
                width: 0.5
              }
            }
          }
        ],
        series: [
          {
            name: this.legend[0],
            type: 'bar',
            radius: '75%',
            center: ['38%', '50%'],
            data: this.seriesDataOne1
          },
          {
            name: this.legend[1],
            type: 'bar',
            radius: '75%',
            center: ['38%', '50%'],
            data: this.seriesDataOne2
          }]
      })
    },
    initEchartTwo () {
      const myChart = echarts.init(this.$refs.chart2)
      myChart.setOption({
        tooltip: {
          trigger: 'axis'
        },
        color: ['#ff9f10', '#ff69ff'],
        legend: {
          x: 'center',
          y: 'bottom',
          data: this.legend2
        },
        grid: {
          containLabel: true,
          left: '3',
          right: '4',
          top: '15',
          bottom: '30'
        },
        xAxis: [
          {
            type: 'category',
            axisLine: {
              lineStyle: {
                color: '#666666',
                width: 0.5
              }
            },
            data: this.xAxisOptions
          }
        ],
        yAxis: [
          {
            type: 'value',
            splitLine: { show: false },
            axisLine: {
              lineStyle: {
                color: '#666666',
                width: 0.5
              }
            }
          }
        ],
        series: [
          {
            name: this.legend2[0],
            type: 'line',
            radius: '75%',
            center: ['38%', '50%'],
            data: this.seriesDataTwo1
          },
          {
            name: this.legend2[1],
            type: 'line',
            radius: '75%',
            center: ['38%', '50%'],
            data: this.seriesDataTwo2
          }]
      })
    },
    // 改变时间粒度
    changeTime (value) {
      if (value === 'day') {
        this.startTime = moment().subtract(6, 'd').format('YYYY-MM-DD HH:mm:ss')
        this.endTime = moment().format('YYYY-MM-DD HH:mm:ss')
      } else if (value === 'min' || value === '5min' || value === 'hour' || value === '15min') {
        this.startTime = moment().subtract(10, 'h').format('YYYY-MM-DD HH:mm:ss') // 10个小时前的日期
        this.endTime = moment().format('YYYY-MM-DD HH:mm:ss')
      } else if (value === 'month') {
        this.startTime = moment().subtract(9, 'M').format('YYYY-MM-DD HH:mm:ss') // 取9个月前的日期
        this.endTime = moment().format('YYYY-MM-DD HH:mm:ss')
      }
    },
    //  查询
    search () {
      this.getCapacityDetails()
      console.log(this.seriesDataOne1)
    }
  }
}
</script>

<style scoped lang="less">
  .wrapper {
    height: 100%;
  }

  .content-wrapper {
    height: 100%;
    overflow-y: auto;
  }

  .head {
    background: #fff;
    font-size: 14px;
  }

  .time-picker {
    padding: 10px;
    font-size: 14px;
    line-height: 32px;
    display: flex;
    align-items: center;

    input {
      height: 32px;
      text-align: center;
      padding: 0 5px;
      border-radius: 3px;
      border: 1px solid #eee;
      color: #999;
      margin: 0 5px;
      flex: 1;
      width: 100%;
    }

    .btn {
      background: @theme-color;
      line-height: 30px;
      color: #fff;
      padding: 0 5px;
      border-radius: 3px;
    }
  }

  .chart-wrapper {
    .chart-item {
      height: 240px;
      background: #fff;
      margin-bottom: 10px;
      padding: 0 10px 10px 10px;

      .chart {
        height: 240px;
      }

      .noResult {
        height: 240px;

        img {
          width: 180px;
          margin: 0 auto;
          display: block;
        }
      }
    }
  }
</style>
