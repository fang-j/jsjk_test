<template>
  <div class="wrapper">
    <div class="list">
      <group gutter="10px" v-for="(item,index) in dataList" :key="index" v-if="type === 'check'">
        <div class="title" @click="openDetail(item)">{{index+1}}.<span class="code">{{item.orderId}}</span></div>
        <cell value-align="left">
          <span class="label" slot="title">客户编号：</span>
          <span class="value">{{item.customerCode}}</span>
        </cell>
        <cell value-align="left">
          <span class="label" slot="title">客户名称：</span>
          <span class="value">{{item.aUserName}}</span>
        </cell>
        <cell value-align="left">
          <span class="label" slot="title">业务类型：</span>
          <span class="value">{{item.lineType}}</span>
        </cell>
        <cell value-align="left">
          <span class="label" slot="title">需求宽带：</span>
          <span class="value">{{item.bandwidth}}</span>
        </cell>
        <cell value-align="left">
          <span class="label" slot="title">工单状态：</span>
          <span class="value">{{item.orderStatus}}</span>
        </cell>
      </group>
      <group gutter="10px" v-for="(item,index) in dataList" :key="index" v-if="type === 'open'">
        <div class="title" @click="openDetail(item)">{{index+1}}.<span class="code">{{item.orderId}}</span></div>
        <cell value-align="left">
          <span class="label" slot="title">客户编号：</span>
          <span class="value">{{item.customerCode}}</span>
        </cell>
        <cell value-align="left">
          <span class="label" slot="title">客户名称：</span>
          <span class="value">{{item.aUserName}}</span>
        </cell>
        <cell value-align="left">
          <span class="label" slot="title">业务类型：</span>
          <span class="value">{{item.lineType}}</span>
        </cell>
        <cell value-align="left">
          <span class="label" slot="title">产品标识实例：</span>
          <span class="value">{{item.productNo}}</span>
        </cell>
        <cell value-align="left">
          <span class="label" slot="title">带宽：</span>
          <span class="value">{{item.bandwidth}}</span>
        </cell>
        <cell value-align="left">
          <span class="label" slot="title">接入地址：</span>
          <span class="value">{{item.serviceZAddress}}</span>
        </cell>
        <cell value-align="left">
          <span class="label" slot="title">当前环节：</span>
          <span class="value">{{item.orderStatus}}</span>
        </cell>
        <div class="btn-wrapper">
          <span class="btn" @click="open(item)">流程图</span>
        </div>
      </group>
      <group gutter="10px" v-for="(item,index) in dataList" :key="index" v-if="type === 'comp'">
        <div class="title">{{index+1}}.<span class="code">{{item.eomsOrderId}}</span></div>
        <cell value-align="left">
          <span class="label" slot="title">客户编号：</span>
          <span class="value">{{item.customerNo}}</span>
        </cell>
        <cell value-align="left">
          <span class="label" slot="title">客户名称：</span>
          <span class="value">{{item.customerName}}</span>
        </cell>
        <cell value-align="left">
          <span class="label" slot="title">业务类型：</span>
          <span class="value">{{item.specialTypeName}}</span>
        </cell>
        <cell value-align="left">
          <span class="label" slot="title">产品实例标识：</span>
          <span class="value">{{item.flowId}}</span>
        </cell>
        <cell value-align="left">
          <span class="label" slot="title">客户联系人：</span>
          <span class="value">{{item.currentManager}}</span>
        </cell>
        <cell value-align="left">
          <span class="label" slot="title">联系方式：</span>
          <span class="value">{{item.currentManagerPhone}}</span>
        </cell>
        <cell value-align="left">
          <span class="label" slot="title">投诉内容：</span>
          <span class="value">{{item.topic}}</span>
        </cell>
        <cell value-align="left">
          <span class="label" slot="title">投诉时间：</span>
          <span class="value">{{item.requestTime}}</span>
        </cell>
        <cell value-align="left">
          <span class="label" slot="title">超时状态：</span>
          <span class="value">{{item.outTime}}</span>
        </cell>
        <div class="btn-wrapper">
          <span class="btn" @click="open(item)">环节详情</span>
        </div>
      </group>
      <group gutter="10px" v-for="(item,index) in dataList" :key="index" v-if="type === 'fault'">
        <div class="title">{{index+1}}.<span class="code">{{item.eomsOrderId}}</span></div>
        <cell value-align="left">
          <span class="label" slot="title">客户编号：</span>
          <span class="value">{{item.customerNo}}</span>
        </cell>
        <cell value-align="left">
          <span class="label" slot="title">客户名称：</span>
          <span class="value">{{item.customerName}}</span>
        </cell>
        <cell value-align="left">
          <span class="label" slot="title">业务类型：</span>
          <span class="value">{{item.specialTypeName}}</span>
        </cell>
        <cell value-align="left">
          <span class="label" slot="title">产品实例标识：</span>
          <span class="value">{{item.userId}}</span>
        </cell>
        <cell value-align="left">
          <span class="label" slot="title">故障发生时间：</span>
          <span class="value">{{item.requestTime}}</span>
        </cell>
        <cell value-align="left">
          <span class="label" slot="title">告警名称：</span>
          <span class="value">{{item.alarmName}}</span>
        </cell>
        <cell value-align="left">
          <span class="label" slot="title">告警对象/设备：</span>
          <span class="value">{{item.alarmNe}}</span>
        </cell>
        <cell value-align="left">
          <span class="label" slot="title">超时状态：</span>
          <span class="value">{{item.outTime}}</span>
        </cell>
        <div class="btn-wrapper">
          <span class="btn" @click="open(item)">处理进度</span>
        </div>
      </group>
      <div class="loadMore" v-show="showMore" @click="loadMore">点击加载更多</div>
      <div class="noRequest" v-show="noRequest">没有数据...</div>
    </div>
    <popup v-show="isShowPopup" position="right" width="90%">
      <div class="popup-hd">搜索</div>
      <group gutter="0" class="popup-content">
        <x-input title="工单编号" placeholder="请输入工单编号" text-align="right" v-model="orderId"></x-input>
        <x-input title="客户编号" placeholder="请输入客户编号" text-align="right" v-model="customerCode"></x-input>
        <x-input title="客户名称" placeholder="请输入客户名称" text-align="right" v-model="customerName"></x-input>
        <x-input title="产品实例标识" placeholder="请输入产品实例标识" text-align="right" v-model="productNo"></x-input>
      </group>
      <div class="popup-ft vux-1px-t">
        <div class="btn vux-1px-r" @click="cancel">取消</div>
        <div class="btn vux-1px-r" @click="reset">重置</div>
        <div class="btn vux-1px-r" @click="search">确定</div>
      </div>
    </popup>
  </div>
</template>

<script>
import { Group, Cell, Popup, XInput } from 'vux'
import { orderList } from '@/api/service'
import { mapGetters } from 'vuex'

export default {
  name: 'orderList',
  components: {
    Group,
    Cell,
    Popup,
    XInput
  },
  data () {
    return {
      type: '',
      title: '',
      timestamp: '',
      orderId: '', // 工单编号
      productNo: '', // 产品实例标识
      customerCode: '', // 客户编号
      customerName: '', // 客户名称
      lineType: '',
      page: 1,
      limit: 10,
      params: {}, // 请求接口参数
      dataList: [],
      showMore: true,
      noRequest: false,
      showPopup: true
    }
  },
  computed: {
    ...mapGetters([
      'isShowPopup'
    ])
  },
  created () {
    // this.$store.dispatch('showPopup', false)
    this.initData()
  },
  methods: {
    initData () {
      this.type = this.$route.query.type
      this.timestamp = this.$route.query.timestamp
      this.title = this.$route.query.title
      this.customerCode = this.$route.query.code
      this.getOrderData()
    },
    getOrderData () {
      const page = this.type === 'check' ? this.page : (this.page - 1) * this.limit
      switch (this.type) {
        case 'check' :
          this.params = {
            orderId: this.orderId,
            productNo: this.productNo,
            customerCode: this.customerCode,
            customerName: this.customerName,
            lineType: this.lineType
          }
          break
        case 'open' :
          this.params = {
            orderId: this.orderId,
            productNo: this.productNo,
            customerCode: this.customerCode,
            customerName: this.customerName
          }
          break
        case 'comp':
          this.params = {
            eomsOrderId: this.orderId,
            flowId: this.productNo,
            customerNo: this.customerCode,
            customerName: this.customerName
          }
          break
        case 'fault':
          this.params = {
            eomsOrderId: this.orderId,
            userId: this.productNo,
            customerNo: this.customerCode,
            customerName: this.customerName,
            orderStartTime: '',
            orderStartTimeEnd: ''
          }
          break
        default:
      }
      this.noRequest = false
      orderList(this.params, this.type, page, this.limit).then(result => {
        const data = result.rows
        if (data.length > 0) {
          if (this.page > 1) {
            this.dataList = this.dataList.concat(data)
          } else {
            this.dataList = data
          }
          this.showMore = true
        } else if (this.page > 1) {
          this.showMore = false
        } else {
          this.dataList = []
          this.showMore = false
          this.noRequest = true
        }
      })
    },
    loadMore () {
      this.page += 1
      this.getOrderData()
    },
    search () {
      this.$store.dispatch('showPopup', false)
      this.page = 1
      this.getOrderData()
    },
    reset () {
      this.customerCode = ''
      this.customerName = ''
      this.productNo = ''
      this.orderId = ''
    },
    cancel () {
      this.$store.dispatch('showPopup', false)
    },
    open (data) {
      if (this.type === 'open') {
        this.$router.push({
          name: 'nodeFlow',
          query: {
            title: `${this.title}${data.orderId}`,
            type: this.type,
            orderId: data.orderId,
            orderStatus: data.orderStatus
          }
        })
      } else {
        this.$router.push({
          name: 'nodeInfo',
          query: {
            title: `${this.title}${data.eomsOrderId}`,
            type: this.type,
            item: data,
            eomsOrderId: data.eomsOrderId
          }
        })
      }
    },
    // 跳转到详情页
    openDetail (data) {
      console.log(data)
      this.$router.push({
        name: 'kcDetails',
        query: {
          title: `${this.title}${data.orderId}`,
          list: data,
          type: this.type,
          name: this.title
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
  .list {
    position: absolute;
    width: 100%;
    top: 0;
    bottom: 0px;
    overflow-y: auto;

    .title {
      padding: 7px 5px 7px 15px;
      font-size: 14px;

      .code {
        color: @theme-color;
      }
    }

    .label {
      display: inline-block;
      min-width: 80px;
    }

    .btn-wrapper {
      display: flex;
      justify-content: flex-end;
      padding: 10px 8px 10px 0;

      .btn {
        display: inline-block;
        color: @theme-color;
        border: 1px solid @theme-color;
        border-radius: 3px;
        font-size: 12px;
        padding: 5px;
        line-height: 12px;
        cursor: pointer;
      }
    }

    .loadMore {
      font-size: 14px;
      color: #bbb;
      text-align: center;
      padding: 10px;
    }

    .noRequest {
      text-align: center;
      padding-top: 40px;
      color: #999;
    }
  }

  .popup-hd {
    text-align: center;
    line-height: 40px;
    height: 40px;
  }

  .popup-content {
    position: absolute;
    top: 40px;
    bottom: 40px;
    width: 100%;
  }

  .popup-ft {
    height: 40px;
    display: flex;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;

    .btn {
      flex: 1;
      line-height: 40px;
      text-align: center;

      &:last-child {
        background: @theme-color;
        color: #fff;
      }
    }
  }
</style>
