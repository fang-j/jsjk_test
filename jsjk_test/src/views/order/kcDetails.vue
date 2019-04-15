<template>
  <div class="wrapper">
    <group gutter="10px">
      <div class="title">{{title}}基本信息</div>
      <cell value-align="left">
        <span slot="title" class="name">工单编号：</span>
        <span class="value">{{data.orderId}}</span>
      </cell>
      <cell value-align="left">
        <span slot="title" class="name">客户编号：</span>
        <span class="value">{{data.customerCode}}</span>
      </cell>
      <cell value-align="left">
        <span slot="title" class="name">客户名称：</span>
        <span class="value">{{data.customerName}}</span>
      </cell>
      <cell value-align="left">
        <span slot="title" class="name">业务类型：</span>
        <span class="value">{{data.lineType}}</span>
      </cell>
      <cell value-align="left" v-if="type === 'open'">
        <span slot="title" class="name">接入方式：</span>
        <span class="value">{{data.transAccess}}</span>
      </cell>
      <cell value-align="left">
        <span slot="title" class="name">带宽：</span>
        <span class="value">{{data.bandwidth}}</span>
      </cell>
      <cell value-align="left">
        <span slot="title" class="name">工单发起时间：</span>
        <span class="value">{{data.orderCreateTime}}</span>
      </cell>
      <cell value-align="left" v-if="type === 'open'">
        <span slot="title" class="name">接入地址：</span>
        <span class="value">{{data.zUserAccessAddress}}</span>
      </cell>
      <cell value-align="left" v-if="type === 'open'">
        <span slot="title" class="name">当前环节：</span>
        <span class="value">{{data.orderStatus}}</span>
      </cell>
      <cell value-align="left" v-if="type === 'check'">
        <span slot="title" class="name">工单状态：</span>
        <span class="value">{{data.orderStatus}}</span>
      </cell>
      <cell value-align="left">
        <span slot="title" class="name">超时状态：</span>
        <span class="value">{{data.outTime}}</span>
      </cell>

    </group>
  </div>
</template>

<script>
import { Group, Cell } from 'vux'

export default {
  name: 'details',
  components: {
    Group,
    Cell
  },
  data () {
    return {
      title: this.$route.query.name,
      data: this.$route.query.list,
      type: this.$route.query.type
    }
  },
  created () {
    console.log(this.data)
  }
}
</script>

<style scoped lang="less">
  .wrapper {
    height: 100%;
  }

  .title {
    padding: 9px 5px 9px 15px;
    line-height: 20px;
    font-size: 14px;
    font-weight: bold;
  }

  .name {
    display: inline-block;
    min-width: 80px;
    font-size: 13px;
    line-height: 13px;
  }

  .value {
    font-size: 13px;
    line-height: 13px;
  }
</style>
