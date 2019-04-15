<template>
  <div class="wrapper">
    <div class="panel" v-for="(item,index) in itemList" :key="index">
      <group gutter="10px">
        <div class="title">{{item.nodeName}}</div>
        <cell value-align="left" v-for="(list,index2) in item.nodeDNs" :key="index2">
          <span class="label" slot="title">{{list.nodeDN}}：</span>
          <span class="value" v-if="item.value !== null">{{item.value[list.nodeDNKey]}}</span>
        </cell>
      </group>
    </div>
  </div>
</template>

<script>
import { Group, Cell } from 'vux'
import { orderNodeFlow } from '@/api/service'

export default {
  name: 'nodeInfo',
  components: {
    Group,
    Cell
  },
  data () {
    return {
      itemList: [],
      type: this.$route.query.type,
      outList: this.$route.query.item, //  默认派单的取值为最外层数据
      dataList: ''
    }
  },
  created () {
    this.initData()
  },
  methods: {
    initData () {
      this.getNodeFlow()
    },
    getNodeFlow () {
      const { type, eomsOrderId } = this.$route.query
      orderNodeFlow(type, eomsOrderId).then(result => {
        if (result.rows.length > 0) {
          this.dataList = result.rows
          if (this.type === 'comp') {
            this.itemList = [
              {
                nodeName: '派单',
                value: null,
                names: [],
                nodeDNs: [
                  { nodeDN: '派单时间', nodeDNKey: 'orderStartTime' },
                  { nodeDN: '集团编号', nodeDNKey: 'customerNo' }]
              },
              {
                nodeName: '任务拆单',
                value: null,
                names: ['任务拆单'],
                nodeDNs: [
                  { nodeDN: '操作时间', nodeDNKey: 'currentStartTime' },
                  { nodeDN: '当前操作人', nodeDNKey: 'currentManager' },
                  { nodeDN: '操作部门', nodeDNKey: 'currentDept' },
                  { nodeDN: '操作人联系方式', nodeDNKey: 'currentManagerPhone' }]
              },
              {
                nodeName: '处理中',
                value: null,
                names: ['分析、预处理', '综合代维系统处理', '集团客户传输组处理', 'GPRS专网处理'],
                nodeDNs: [
                  { nodeDN: '操作时间', nodeDNKey: 'currentStartTime' },
                  { nodeDN: '当前操作人', nodeDNKey: 'currentManager' },
                  { nodeDN: '操作部门', nodeDNKey: 'currentDept' },
                  { nodeDN: '操作人联系方式', nodeDNKey: 'currentManagerPhone' },
                  { nodeDN: '处理意见', nodeDNKey: 'dealdescription' }]
              },
              {
                nodeName: '结果判定、回复前端',
                value: null,
                names: ['处理结果判定', '回复前端部门', '处理结果判定、回复前端部门'],
                nodeDNs: [
                  { nodeDN: '操作时间', nodeDNKey: 'currentStartTime' },
                  { nodeDN: '当前操作人', nodeDNKey: 'currentManager' },
                  { nodeDN: '操作部门', nodeDNKey: 'currentDept' },
                  { nodeDN: '操作人联系方式', nodeDNKey: 'currentManagerPhone' },
                  { nodeDN: '处理意见', nodeDNKey: 'dealdescription' },
                  { nodeDN: '完成时间', nodeDNKey: 'currentEndTime' }]
              }
            ]
            this.loadPageTs()
          } else {
            this.itemList = [
              {
                nodeName: '派单',
                value: null,
                names: [],
                nodeDNs: [
                  { nodeDN: '派单时间', nodeDNKey: 'alarmTime' },
                  { nodeDN: '故障网元', nodeDNKey: 'alarmNe' },
                  { nodeDN: '告警名称', nodeDNKey: 'alarmName' },
                  { nodeDN: '告警产生时间', nodeDNKey: 'orderStartTime' },
                  { nodeDN: '告警清除时间', nodeDNKey: 'alarmCleanTime' },
                  { nodeDN: '电路编号', nodeDNKey: 'lineName' }
                ]
              },
              {
                nodeName: '处理中',
                value: null,
                names: ['分公司客响班', '合作系统处理'],
                nodeDNs: [
                  { nodeDN: '操作时间', nodeDNKey: 'currentStartTime' },
                  { nodeDN: '当前操作人', nodeDNKey: 'currentManager' },
                  { nodeDN: '操作部门', nodeDNKey: 'currentDept' },
                  { nodeDN: '操作人联系方式', nodeDNKey: 'currentManagerPhone' },
                  { nodeDN: '处理结果', nodeDNKey: 'dealResult' }]
              },
              {
                nodeName: '归档',
                value: null,
                names: ['监控质检', '工单归档'],
                nodeDNs: [
                  { nodeDN: '操作时间', nodeDNKey: 'currentStartTime' },
                  { nodeDN: '当前操作人', nodeDNKey: 'currentManager' },
                  { nodeDN: '操作部门', nodeDNKey: 'currentDept' },
                  { nodeDN: '操作人联系方式', nodeDNKey: 'currentManagerPhone' },
                  { nodeDN: '处理结果', nodeDNKey: 'dealResult' }

                ]
              }
            ]
            this.loadPageGz()
          }
        } else {
          this.itemList = []
          this.$vux.alert.show({ content: '暂无数据' })
        }
      })
    },
    loadPageTs () {
      const arr = this.dataList
      this.itemList[0].value = this.outList
      // 根据itemList的names判断数据属于哪个字段
      arr.forEach(item => {
        this.itemList.forEach(item2 => {
          // 判断是否存在字段
          const count = item2.names.indexOf(item.currentStep)
          if (count !== -1) {
            item2.value = item
          }
        })
      })
      console.log(this.itemList)
    },
    loadPageGz () {
      const arr = this.dataList
      this.itemList[0].value = this.outList
      console.log(this.outList)
      arr.forEach(item => {
        this.itemList.forEach(item2 => {
          const count = item2.names.indexOf(item.currentStep)
          if (count !== -1) {
            item2.value = item
          }
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
  .wrapper {
    position: absolute;
    padding-bottom: 30px;
    width: 100%;
    top: 0;
    bottom: 0;
    overflow-y: auto;
  }

  .panel {
    .title {
      padding: 10px 5px 10px 20px;
      line-height: 18px;
      font-size: 14px;
      color: @theme-color;
    }

    .label, .value {
      font-size: 13px;
    }
  }
</style>
