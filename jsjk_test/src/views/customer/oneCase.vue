<template>
  <div class="wrapper">
    <tab v-model="tabIndex">
      <tab-item @on-item-click="loadBasicInfo">基础信息</tab-item>
      <tab-item @on-item-click="loadSupportQuality">支撑质量</tab-item>
      <tab-item @on-item-click="loadBusinessQuality">业务质量</tab-item>
      <tab-item @on-item-click="loadCustomerService">客户服务</tab-item>
    </tab>
    <div class="content-wrapper" v-show="tabIndex === 0">
      <div class="title">基本信息</div>
      <group gutter="0">
        <cell value-align="left">
          <span class="key" slot="title">客户名称：</span>
          <span class="value">{{customerInfo.zh_label}}</span>
        </cell>
        <cell value-align="left">
          <span class="key" slot="title">客户编号：</span>
          <span class="value">{{customerInfo.customer_code}}</span>
        </cell>
        <cell value-align="left">
          <span class="key" slot="title">客户服务等级：</span>
          <span class="value" v-if="customerInfo.service_level === '1'">金牌</span>
          <span class="value" v-else-if="customerInfo.service_level === '2'">银牌</span>
          <span class="value" v-else-if="customerInfo.service_level === '3'">铜牌</span>
          <span class="value" v-else>标准</span>
        </cell>
        <cell value-align="left">
          <span class="key" slot="title">客户地址：</span>
          <span class="value">{{customerInfo.customer_add}}</span>
        </cell>
        <cell value-align="left">
          <span class="key" slot="title">客户属地：</span>
          <span class="value">{{customerInfo.city_id}}</span>
        </cell>
        <cell value-align="left">
          <span class="key" slot="title">客户经理联系人：</span>
          <span class="value">{{customerInfo.marketing_manager}}</span>
        </cell>
        <cell value-align="left">
          <span class="key" slot="title">客户联系人：</span>
          <span class="value">{{customerInfo.customer_contact}}</span>
        </cell>
        <cell value-align="left">
          <span class="key" slot="title">联系方式：</span>
          <span class="value">{{customerInfo.marketing_phone}}</span>
        </cell>
      </group>
      <div class="business vux-1px-b">订购业务</div>
      <div class="chart-box">
        <div class="chart" ref="chart_1"></div>
        <div class="noData" v-show="isShow">无业务</div>
      </div>
    </div>
    <div class="content-wrapper" v-show="tabIndex === 1">
      <div class="title">售前售中情况</div>
      <div class="chart-wrapper">
        <div class="order-title vux-1px-t">当年勘察工单</div>
        <div class="chart" ref="chart2_1"></div>
        <div class="order-title vux-1px-t">当年开通工单</div>
        <div class="chart" ref="chart2_2"></div>
      </div>
      <div class="business vux-1px-b">投诉概括</div>
      <x-table class="table">
        <thead>
        <tr>
          <th>投诉类型</th>
          <th>2018全年</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>工单总量</td>
          <td>{{compInfo.total}}</td>
        </tr>
        <tr>
          <td>平均故障历时(小时)</td>
          <td>{{compInfo.avg_time}}</td>
        </tr>
        <tr>
          <td>业务可利用率(%)</td>
          <td>{{compInfo.used_rate}}</td>
        </tr>
        </tbody>
      </x-table>
      <!--<div class="chart" ref="chart_1"></div>-->
    </div>
    <div class="content-wrapper" v-show="tabIndex === 2">
      <div class="title">主动监控</div>
      <x-table class="table">
        <thead>
        <tr>
          <th>监控类型</th>
          <th>2018全年</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>故障工单</td>
          <td>{{faultList.fault_num}}</td>
        </tr>
        <tr>
          <td>关联告警</td>
          <td>{{faultList.alarm_conut}}</td>
        </tr>
        </tbody>
      </x-table>
      <div class="business">性能监控</div>
      <div class="search-box">
        <div class="left">
          <selector :options="timeList" v-model="timeType" direction="rtl"></selector>
        </div>
        <div class="right">
          <selector :options="productOption" v-model="productNo" direction="rtl"></selector>
        </div>
        <div class="btn" @click="search">查询</div>
      </div>
      <div class="type-box">
        <div class="line-type">{{lineType}}</div>
        <span class="line-btn" :class="{active: currentIndex === index}"
              v-for="(item,index) in lineList" :key="index"
              @click="changeLineType(item,index)"></span>
      </div>
      <div class="chart2-wrapper">
        <div class="chart-item">
          <div class="chart2" ref="chart3_1" v-show="isShowChart2"></div>
          <div class="noData" v-show="!isShowChart2">
            <img src="./img/nodata.png" alt="">
          </div>
        </div>
        <div class="chart-item">
          <div class="chart2" ref="chart3_2" v-show="isShowChart2"></div>
          <div class="noData" v-show="!isShowChart2">
            <img src="./img/nodata.png" alt="">
          </div>
        </div>
      </div>
    </div>
    <div class="content-wrapper" v-show="tabIndex === 3">
      <div class="table-box">
        <div class="title">客户巡检</div>
        <x-table class="table">
          <thead>
          <tr>
            <th>巡查日期</th>
            <th>巡查人</th>
            <th>巡查情况</th>
            <th>巡查结果</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item,index) in pollingList" :key="index">
            <td>{{moment(item.set_time).format('YYYY-MM-DD')}}</td>
            <td>{{item.polling_man}}</td>
            <td>{{item.polling_result}}</td>
            <td>{{item.hidden_trouble}}</td>
          </tr>
          </tbody>
        </x-table>
      </div>
      <div class="table-box">
        <div class="title">客户拜访</div>
        <x-table class="table">
          <thead>
          <tr>
            <th>拜访日期</th>
            <th>客户联系人</th>
            <th>拜访记录</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item,index) in visitList" :key="index">
            <td>{{item.visit_time}}</td>
            <td>{{item.customer_relate}}</td>
            <td>{{item.visit_detail}}</td>
          </tr>
          </tbody>
        </x-table>

      </div>
      <div class="table-box">
        <div class="title">重保分析</div>
        <x-table class="table">
          <thead>
          <tr>
            <th>重保主题</th>
            <th>重保开始时间</th>
            <th>重保结束时间</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item,index) in importantList" :key="index">
            <td>{{item.topic_title}}</td>
            <td>{{moment(item.start_date).format('YYYY-MM-DD')}}</td>
            <td>{{moment(item.end_date).format('YYYY-MM-DD')}}</td>
          </tr>
          </tbody>
        </x-table>

      </div>
      <div class="table-box">
        <div class="title">切割历史</div>
        <x-table class="table">
          <thead>
          <tr>
            <th>专线编号</th>
            <th>割接开始时间</th>
            <th>割接结束时间</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item,index) in cutnetList" :key="index">
            <td>{{item.service_type}}</td>
            <td>{{moment(item.start_time).format('YYYY-MM-DD')}}</td>
            <td>{{moment(item.end_time).format('YYYY-MM-DD')}}</td>
          </tr>
          </tbody>
        </x-table>

      </div>
    </div>
  </div>
</template>

<script>
import {
  oneCustomerInfo,
  orderBusiness,
  oneOrderOpenkcInfo,
  oneComplainInfo,
  oneFaultInfo,
  lineList,
  customerService,
  capacityDetails
} from '@/api/service'
import { Tab, TabItem, Group, Cell, XTable, Selector } from 'vux'
import GroupTitle from 'vux/src/components/group-title/index'
import moment from 'moment'

const echarts = require('echarts')

export default {
  components: {
    GroupTitle,
    Tab,
    TabItem,
    Group,
    Cell,
    XTable,
    Selector
  },
  data () {
    return {
      startTime: '',
      endTime: '',
      customerCode: '',
      title: '',
      timestamp: '',
      isShow: false, // 业务状态
      tabIndex: 0,
      dataList: '',
      currentIndex: 0, // 专线按钮
      customerInfo: '', // 客户信息
      compInfo: '', // 投诉概括
      timeList: [
        { key: 'day', value: '日' },
        { key: '5min', value: '5分钟' },
        { key: 'min', value: '15分钟' },
        { key: 'hour', value: '小时' },
        { key: 'month', value: '月' }
      ], // 查询时间间隔数据
      timeType: 'day',
      productList: [], // 所有产品标识数据
      productNo: '', // 默认产品编号
      productOption: [], // 产品编号列表
      flowid: '',
      lineList: [], // 专线列表
      lineType: '', // 专线zn
      page: 1,
      type: '', // 专线en
      faultList: [], // 主动监控
      pollingList: '',
      visitList: '',
      importantList: '',
      cutnetList: '',
      isShowChart2: true,
      xTime: '',
      chartLineData: { xAxisData: [], legend: [], seriesData: [], seriesDataTwo: [] },
      chartBarData: { xAxisData: [], legend: [], seriesData: [], seriesDataTwo: [] }
    }
  },
  created () {
    this.startTime = moment().subtract(6, 'day').format('YYYY-MM-DD hh:mm:ss') // 取7天前的时间
    this.endTime = moment().format('YYYY-MM-DD hh:mm:ss')
    this.customerCode = this.$route.query.code
    this.title = this.$route.query.title
    this.loadBasicInfo()
  },
  methods: {
    // 基本信息
    loadBasicInfo () {
      this.getBasicInfo()
      this.getOrderBusiness()
    },
    // 基本信息
    getBasicInfo () {
      oneCustomerInfo(this.customerCode).then(result => {
        if (result.length > 0) {
          this.customerInfo = result[0]
        } else {
          this.customerInfo = []
        }
      })
    },
    // 订购业务
    getOrderBusiness () {
      this.lineList = []
      orderBusiness(this.customerCode).then(result => {
        if (result.length > 0) {
          const legend = []
          const seriesData = []
          result.forEach(item => {
            legend.push(item.line_type)
            seriesData.push({ name: item.line_type, value: item.num })
            switch (item.line_type) {
              case 'MPLS专线':
                this.lineList.push({ key: 'mpls', value: item.line_type })
                break
              case '互联网专线':
                this.lineList.push({ key: 'net', value: item.line_type })
                break
              case '语音专线':
                this.lineList.push({ key: 'speech', value: item.line_type })
                break
              case 'GPRS专线':
                this.lineList.push({ key: 'apn', value: item.line_type })
                break
              case '短信专线':
                this.lineList.push({ key: 'sms', value: item.line_type })
                break
              case '传输专线':
                this.lineList.push({ key: 'trans', value: item.line_type })
                break
              default:
            }
          })
          this.lineType = this.lineList[0].value
          this.type = this.lineList[0].key
          this.initEchart(legend, seriesData)
        } else {
          this.initEchart()
          this.isShow = true
        }
      })
    },
    // 加载支撑质量
    loadSupportQuality () {
      oneOrderOpenkcInfo(this.customerCode).then(result => {
        if (result.length > 0) {
          // 勘察数据
          const seriesData1 = [{ name: '超时', value: result[0].out_kc_num }, { name: '未超时', value: result[0].kc_num }]
          // 开通数据
          const seriesData2 = [{ name: '超时', value: result[0].out_open_num }, {
            name: '未超时',
            value: result[0].open_num
          }]
          this.initEchartTwo(seriesData1, this.$refs.chart2_1, '当年勘察工单')
          this.initEchartTwo(seriesData2, this.$refs.chart2_2, '当年开通工单')
        }
      })
      oneComplainInfo(this.customerCode).then(result => {
        if (result.length > 0) {
          this.compInfo = result[0]
        } else {
          this.compInfo = []
        }
      })
    },
    // 加载导航业务质量该页面所需的数据
    loadBusinessQuality () {
      this.getOneFaultInfo()
      this.getCapacityList()
    },
    // 主动监控
    getOneFaultInfo () {
      oneFaultInfo(this.customerCode).then(result => {
        if (result.length > 0) {
          this.faultList = result[0]
        } else {
          this.faultList = []
        }
      })
    },
    // 获取专线产品实例编号
    getCapacityList () {
      const params = {
        lineType: this.lineType,
        customerCode: this.customerCode
      }
      const payload = {
        page: this.page
      }
      this.productOption = []
      console.log(params)
      lineList(params, payload).then(result => {
        const data = result.rows
        if (data.length > 0) {
          if (this.page > 1) {
            this.productList = this.productList.concat(data)
          } else {
            this.productList = data
            if (this.lineType === 'MPLS专线') {
              this.productList.forEach(item => {
                this.productOption.push({ key: item.flowid, value: item.productNo })
              })
              this.productNo = this.productList[0].flowid
            } else {
              this.productList.forEach(item => {
                this.productOption.push({ key: item.productNo, value: item.productNo })
              })
              this.productNo = this.productList[0].productNo
              this.flowid = this.productList[0].flowid
            }
          }
          this.getCapacityDetial()
        } else {
          this.productList = []
          this.isShowChart2 = false
        }
      })
    },
    // 获取专线详情数据数据
    getCapacityDetial () {
      const params = {}
      this.chartBarData = { xAxisData: [], legend: [], seriesData: [], seriesDataTwo: [] }
      this.chartLineData = { xAxisData: [], legend: [], seriesData: [], seriesDataTwo: [] }
      switch (this.type) {
        case 'trans':
          params.timeType = this.timeType
          params.timeStamp = this.startTime
          params.timeStampEnd = this.endTime
          params.productNo = this.productNo
          // params.flowid = this.flowid
          break
        case 'net':
          params.productNo = this.productNo
          params.startDate = this.startTime
          params.endDate = this.endTime
          break
        case 'apn':
          params.timeType = this.timeType
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
          params.customerCode = this.customerCode
          if (this.timeType === 'month') {
            params.timeStamp = this.startTime
            params.timeStampEnd = this.endTime
          } else {
            params.startTime = this.startTime
            params.endTime = this.endTime
          }
          break
        case 'mpls':
          params.flowid = this.productNo
          params.startDate = this.startTime
          params.endDate = this.endTime
          break
        default:
      }
      capacityDetails(this.type, params).then(result => {
        const data = result.rows
        if (data.length > 0) {
          this.isShowChart2 = true
          data.forEach(item => {
            switch (this.type) {
              case 'trans':
                this.initTime(item.collecttime)
                this.chartBarData.xAxisData.push(this.xTime)
                this.chartBarData.legend = ['端口入流量(MB)', '端口出流量(MB)']
                this.chartBarData.seriesData.push(item.portIn)
                this.chartBarData.seriesDataTwo.push(item.inUtility)
                this.chartLineData.xAxisData.push(this.xTime)
                this.chartLineData.legend = ['端口入带宽利用率(%)', '端口出带宽利用率(%)']
                this.chartLineData.seriesData.push(item.portOut)
                this.chartLineData.seriesDataTwo.push(item.outUtility)
                break
              case 'net':
                this.initTime(item.timeStamp)
                this.chartBarData.xAxisData.push(this.xTime)
                this.chartBarData.legend = ['上行流量(MB)', '下行流量(MB)']
                this.chartBarData.seriesData.push(item.portIn)
                this.chartBarData.seriesDataTwo.push(item.inUtility)
                this.chartLineData.xAxisData.push(this.xTime)
                this.chartLineData.legend = ['上行带宽利用率(%)', '下行带宽利用率(%)']
                this.chartLineData.seriesData.push(item.portOut)
                this.chartLineData.seriesDataTwo.push(item.outUtility)
                break
              case 'speech':
                this.initTime(item.startTime)
                this.chartBarData.xAxisData.push(this.xTime)
                this.chartBarData.legend = ['呼叫话务量(erl)', '被叫话务量(erl)']
                this.chartBarData.seriesData.push(item.callingSetupTime)
                this.chartBarData.seriesDataTwo.push(item.callingSuccRate)
                this.chartLineData.xAxisData.push(this.xTime)
                this.chartLineData.legend = ['主叫接通率(%)', '被叫接通率(%)']
                this.chartLineData.seriesData.push(item.calledSetupTime)
                this.chartLineData.seriesDataTwo.push(item.calledSuccRate)
                break
              case 'sms':
                this.initTime(item.startTime)
                this.chartBarData.xAxisData.push(this.xTime)
                this.chartBarData.legend = ['短信发送量(条)', '短信接收量(条)']
                this.chartBarData.seriesData.push(item.downSubmitTotalCount)
                this.chartBarData.seriesDataTwo.push(item.sucDownSubmitUtil)
                this.chartLineData.xAxisData.push(this.xTime)
                this.chartLineData.legend = ['短信发送成功率(%)', '短信接收成功率(%)']
                this.chartLineData.seriesData.push(item.upSendCount)
                this.chartLineData.seriesDataTwo.push(item.sucUpSendUtil)
                break
              case 'apn':
                this.initTime(item.starttime)
                this.chartBarData.xAxisData.push(this.xTime)
                this.chartBarData.legend = ['上行流量(MB)', '下行流量(MB)']
                this.chartBarData.seriesData.push(item.incoctpgwApn)
                this.chartBarData.seriesDataTwo.push(item.succ4gRate)
                this.chartLineData.xAxisData.push(this.xTime)
                this.chartLineData.legend = ['PDP激活成功率(%)', 'IP地址利用率(%)']
                this.chartLineData.seriesData.push(item.outoctpgwApn)
                this.chartLineData.seriesDataTwo.push(item.ippoolRate)
                break
              case 'mpls':
                this.initTime(item.timeStamp)
                this.chartBarData.xAxisData.push(this.xTime)
                this.chartBarData.legend = ['上行流量(MB)', '下行流量(MB)']
                this.chartBarData.seriesData.push(item.portIn)
                this.chartBarData.seriesDataTwo.push(item.inUtility)
                this.chartLineData.xAxisData.push(this.xTime)
                this.chartLineData.legend = ['上行带宽利用率(%)', '下行带宽利用率(%)']
                this.chartLineData.seriesData.push(item.portOut)
                this.chartLineData.seriesDataTwo.push(item.outUtility)
                break
            }
          })
          this.initBarChart()
          this.initLineChart()
        } else {
          this.isShowChart2 = false
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 加载客户服务
    loadCustomerService () {
      this.getCustomerService('polling')
      this.getCustomerService('visit')
      this.getCustomerService('important')
      this.getCustomerService('cutnet')
    },
    getCustomerService (type) {
      customerService(type, this.customerCode).then(result => {
        if (result.length > 0) {
          switch (type) {
            case 'polling':
              this.pollingList = result
              break
            case 'visit':
              this.visitList = result
              break
            case 'important':
              this.importantList = result
              break
            case 'cutnet':
              this.cutnetList = result
              break
          }
        }
      })
    },
    // 以上都是数据的获取及处理
    initTime (date) {
      switch (this.timeType) {
        case 'day':
          this.xTime = date.substring(5, 10)
          break
        case '5min':
          this.xTime = date.substring(11, 16)
          break
        case '15min':
          this.xTime = date.substring(11, 16)
          break
        case 'min':
          this.xTime = date.substring(11, 16)
          break
        case 'hour':
          this.xTime = date.substring(11, 16)
          break
        case 'month':
          this.xTime = date.substring(0, 7)
          break
        default:
      }
    },
    // 改变选项
    changeLineType (data, index) {
      this.lineType = data.value
      this.type = data.key
      this.currentIndex = index
      this.page = 1
      this.loadType()
      this.getCapacityList()
    },
    // 专线对应的不同类型的时间
    loadType () {
      if (this.type === 'net' || this.type === 'sms' || this.type === 'mpls') {
        this.timeList = [
          { key: 'day', value: '日' },
          { key: '15min', value: '15分钟' },
          { key: 'hour', value: '小时' },
          { key: 'month', value: '月' }
        ]
        this.timeType = 'day'
      }
      if (this.type === 'speech') {
        this.timeList = [
          { key: 'day', value: '日' },
          { key: 'min', value: '15分钟' },
          { key: 'hour', value: '小时' }
        ]
        this.timeType = 'day'
      }
    },
    // 基础信息图表
    initEchart (legend, seriesData) {
      let myChart = echarts.init(this.$refs.chart_1)
      if (legend === undefined && seriesData === undefined) {
        myChart.dispose()
        this.isShow = true
      } else {
        this.isShow = false
        myChart.setOption({
          tooltip: {
            type: 'axios'
          },
          color: ['#f79002', '#56c5aa', '#1ca3f9', '#7dc065', '#ff6c6f', '#5a97ff'],
          legend: {
            orient: 'vertical',
            right: '10',
            left: 'right',
            data: legend
          },
          series: [{
            name: '订购业务',
            type: 'pie',
            radius: '75%',
            center: ['38%', '50%'],
            data: seriesData,
            label: {
              formatter: '{c}条'
            }
          }]
        })
        myChart.on('click', params => {
          console.log(params)
          this.$router.push({
            name: 'line',
            query: {
              code: this.customerCode,
              type: params.name
            }
          })
        })
      }
    },
    // 支撑质量图表
    initEchartTwo (seriesData, dom, name) {
      console.log(seriesData)
      let myChart = echarts.init(dom)
      myChart.setOption({
        tooltip: {
          type: 'axios'
        },
        color: ['#37a2da', '#ffd85c'],
        series: [{
          name: name,
          type: 'pie',
          data: seriesData
        }]
      })
    },
    // 业务质量柱状图
    initBarChart () {
      this.$nextTick(() => {
        const myChart = echarts.init(this.$refs.chart3_1)
        myChart.resize()
        myChart.setOption({
          tooltip: {
            type: 'axios'
          },
          color: ['#28d5c7', '#5a97ff'],
          legend: {
            x: 'center',
            y: 'bottom',
            data: this.chartBarData.legend
          },
          grid: {
            containLabel: true,
            left: '3',
            right: '4',
            top: '15',
            bottom: '30'
          },
          xAxis: [{
            data: this.chartBarData.xAxisData
          }],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [{
            name: this.chartBarData.legend[0],
            type: 'bar',
            data: this.chartBarData.seriesData
          }, {
            name: this.chartBarData.legend[1],
            type: 'bar',
            data: this.chartLineData.seriesData
          }]
        })
      })
    },
    //  业务质量折线图
    initLineChart () {
      this.$nextTick(() => {
        const myChart = echarts.init(this.$refs.chart3_2)
        myChart.resize()
        myChart.setOption({
          tooltip: {
            type: 'axis'
          },
          color: ['#28d5c7', '#5a97ff'],
          grid: {
            containLabel: true,
            left: '3',
            right: '4',
            top: '15',
            bottom: '30'
          },
          legend: {
            x: 'center',
            y: 'bottom',
            data: this.chartLineData.legend
          },
          xAxis: {
            type: 'category',
            data: this.chartLineData.xAxisData
          },
          yAxis: {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: '#666666',
                width: 0.5
              }
            }
          },
          series: [
            {
              name: this.chartLineData.legend[0],
              type: 'line',
              data: this.chartBarData.seriesDataTwo
            },
            {
              name: this.chartLineData.legend[1],
              type: 'line',
              data: this.chartLineData.seriesDataTwo
            }]
        })
      })
    },
    //  查询
    search () {
      this.getCapacityDetial()
    }
  }
}
</script>

<style scoped lang="less">
  .wrapper {
    position: relative;
    height: 100%;
    width: 100%;
  }

  .content-wrapper {
    position: absolute;
    top: 54px;
    bottom: 10px;
    width: 100%;
    overflow-y: auto;

    .title {
      line-height: 36px;
      height: 36px;
      padding-left: 24px;
      font-size: 14px;
      position: relative;
      background: #fff;

      &:after {
        content: "";
        width: 4px;
        height: 14px;
        position: absolute;
        top: 11px;
        left: 15px;
        background: #5a97ff;
        border-radius: 4px;
      }
    }

    .key {
      display: inline-block;
      min-width: 80px;
    }

    .key, .value {
      font-size: 13px;
      line-height: 13px;
    }

    .business {
      margin-top: 10px;
      position: relative;
      padding-left: 24px;
      font-size: 13px;
      line-height: 36px;
      height: 36px;
      background: #fff;

      &:before {
        content: "";
        width: 4px;
        height: 14px;
        position: absolute;
        top: 11px;
        left: 15px;
        background: #5a97ff;
        border-radius: 4px;
      }
    }

    .chart {
      width: 100%;
      height: 220px;
      background: #fff;
      padding: 10px 0;
    }

    .chart-box {
      position: relative;

      .noData {
        text-align: center;
        line-height: 220px;
        height: 220px;
        font-size: 14px;
        color: #999;
        background: #fff;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 999;
      }
    }

    .table-box {
      margin-bottom: 10px;

      &:first-of-type {
        margin-top: 10px;
      }
    }

    .table {
      background: #fff;

      thead {
        background: #5a97ff;
        color: #fff;
      }

      th, td {
        font-size: 14px;
        line-height: 20px;
        padding: 8px;
      }

      td {
        color: #666;
      }
    }

    .chart-wrapper {
      .order-title {
        background: #fff;
        text-align: center;
        line-height: 36px;
        height: 36px;
        font-size: 14px;
      }
    }

    .chart2-wrapper {
      position: relative;

      .chart-item {
        height: 240px;
        background: #fff;
        margin-top: 10px;
        padding: 0 10px 10px 10px;

        .chart2 {
          height: 240px;
          /*width: 100%;*/
        }

        .noData {
          height: 240px;

          img {
            width: 180px;
            margin: 0 auto;
            display: block;
          }
        }
      }
    }

    .search-box {
      display: flex;
      border-top: 1px solid #ddd;
      border-bottom: 1px solid #ddd;
      background: #fff;

      .left {
        width: 100px
      }

      .right {
        flex: 1;
        border-left: 1px solid #ddd;
      }

      .btn {
        height: 44px;
        line-height: 44px;
        background: #5a97ff;
        color: #fff;
        width: 70px;
        padding: 0 5px;
        text-align: center;
      }
    }

    .type-box {
      padding: 10px;
      background: #fff;
      text-align: center;

      .line-type {
        text-align: center;
        margin-bottom: 5px;
      }

      .line-btn {
        padding: 8px 14px;
        display: inline-block;
        margin: 0 10px;
        border-radius: 2px;
        background: #ccc;

        &.active {
          background: #5a97ff;
        }
      }
    }
  }
</style>
