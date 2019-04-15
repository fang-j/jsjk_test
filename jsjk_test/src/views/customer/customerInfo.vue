<template>
  <div class="wrapper">
    <div class="content-wrapeer">
      <group gutter="10px" v-for="(item,index) in dataList" :key="index">
        <div class="title">客户基本信息</div>
        <cell value-align="left">
          <div class="lable" slot="title">客户名称：</div>
          <span class="value">{{item.zhLabel}}</span>
        </cell>
        <cell value-align="left">
          <div class="lable" slot="title">客户编号：</div>
          <span class="value">{{item.customerCode}}</span>
        </cell>
        <cell value-align="left">
          <div class="lable" slot="title">客户服务等级：</div>
          <span class="value" v-if="item.serviceLevel === '1'">金牌</span>
          <span class="value" v-else-if="item.serviceLevel === '2'">银牌</span>
          <span class="value" v-else-if="item.serviceLevel === '3'">铜牌</span>
          <span class="value" v-else>标准</span>
        </cell>
        <cell value-align="left">
          <div class="lable" slot="title">客户地址：</div>
          <span class="value">{{item.customerAdd}}</span>
        </cell>
        <cell value-align="left">
          <div class="lable" slot="title">客户地市：</div>
          <span class="value">{{item.cityId}}</span>
        </cell>
        <cell value-align="left">
          <div class="lable" slot="title">客户经理：</div>
          <span class="value">{{item.marketingManager}}</span>
        </cell>
        <cell value-align="left">
          <div class="lable" slot="title">联系方式：</div>
          <span class="value">{{item.marketingPhone}}</span>
        </cell>
        <cell value-align="left">
          <div class="lable" slot="title">客户联系人：</div>
          <span class="value">{{item.customerContact}}</span>
        </cell>
        <cell value-align="left">
          <div class="lable" slot="title">联系方式：</div>
          <span class="value">{{item.customerPhone}}</span>
        </cell>
      </group>
    </div>
  </div>
</template>

<script>
import { customer } from '@/api/service'
import { Group, Cell } from 'vux'

export default {
  components: {
    Group,
    Cell
  },
  data () {
    return {
      zhLabel: '',
      code: '',
      dataList: ''
    }
  },
  created () {
    this.initData()
  },
  methods: {
    initData () {
      this.zhLabel = this.$route.query.title
      this.code = this.$route.query.code
      this.loadInfo()
    },
    loadInfo () {
      const param = {
        cityId: '',
        customerAdd: '',
        customerCode: this.code,
        serviceLevel: '',
        customerGrade: '',
        zhLabel: this.zhLabel
      }
      customer(param).then(result => {
        if (result.rows.length > 0) {
          this.dataList = result.rows
          console.log(this.dataList)
        } else {
          this.$vux.alert.show({ content: '暂无数据' })
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
  }

  .content-wrapper {
    background: #fff;
  }

  .title {
    padding: 7px 5px 7px 15px;
    font-size: 14px;
    font-weight: bold;
  }

  .lable {
    min-width: 80px;
  }
  .lable,.value{
    font-size: 13px;
  }
</style>
