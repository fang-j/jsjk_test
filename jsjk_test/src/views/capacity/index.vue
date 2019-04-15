<template>
  <div class="wrapper">
    <tab :line-width="2">
      <tab-item :selected="item.value === type" v-for="(item,index) in tabList"
                :key="index" @on-item-click="changeTab(item.value)">{{item.name}}
      </tab-item>
    </tab>
    <div class="content-wrapper" ref="wrapper">
      <group gutter="10px" v-for="(item,index) in dataList" :key="index" v-if="type === 'trans'">
        <div class="title" @click="openDetails(item)">产品实例标识：{{item.productNo}}</div>
        <cell value-align="left">
          <span class="label" slot="title">A端地址：</span>
          <span class="value">{{item.aCustomerAdd}}</span>
        </cell>
        <cell value-align="left">
          <span class="label" slot="title">z端地址：</span>
          <span class="value">{{item.zCustomerAdd}}</span>
        </cell>
        <cell value-align="left">
          <span class="label" slot="title">流量(MB)：</span>
          <span class="value">{{item.azethRxoctets}}</span>
        </cell>
        <cell value-align="left">
          <span class="label" slot="title">最新采集时间：</span>
          <span class="value">{{item.collecttime}}</span>
        </cell>
      </group>
      <group gutter="10px" v-for="(item,index) in dataList" :key="index" v-if="type === 'apn'">
        <div class="title" @click="openDetails(item)">产品实例标识：{{item.productNo}}</div>
        <cell value-align="left">
          <span class="label" slot="title">APN名称：</span>
          <span class="value">{{item.apnname}}</span>
        </cell>
        <cell value-align="left">
          <span class="label" slot="title">在线用户数：</span>
          <span class="value">{{item.apnOnlineTermUserCnt}}</span>
        </cell>
        <cell value-align="left">
          <span class="label" slot="title">PDP成功率(%)：</span>
          <span class="value">{{item.succ4gRate}}</span>
        </cell>
        <cell value-align="left">
          <span class="label" slot="title">最新采集时间：</span>
          <span class="value">{{item.starttime}}</span>
        </cell>
      </group>
      <group gutter="10px" v-for="(item,index) in dataList" :key="index" v-if="type === 'net' || type === 'mpls'">
        <div class="title" @click="openDetails(item)">产品实例标识：{{item.productNo}}</div>
        <cell value-align="left">
          <span class="label" slot="title">Z端地址：</span>
          <span class="value">{{item.customerAdd}}</span>
        </cell>
        <cell value-align="left">
          <span class="label" slot="title">流量(MB)：</span>
          <span class="value">{{item.portIn}}</span>
        </cell>
        <cell value-align="left">
          <span class="label" slot="title">峰值利用率(%)：</span>
          <span class="value">{{item.maxUtility}}</span>
        </cell>
        <cell value-align="left">
          <span class="label" slot="title">最新采集时间：</span>
          <span class="value">{{item.timeStamp}}</span>
        </cell>
      </group>
      <group gutter="10px" v-for="(item,index) in dataList" :key="index" v-if="type === 'speech'">
        <div class="title" @click="openDetails(item)">客户编号：{{item.customerCode}}</div>
        <cell value-align="left">
          <span class="label" slot="title">通话时长：</span>
          <span class="value">{{item.chargeLength}}</span>
        </cell>
        <cell value-align="left">
          <span class="label" slot="title">客户业务接入地址：</span>
          <span class="value">{{item.customerAdd}}</span>
        </cell>
        <cell value-align="left">
          <span class="label" slot="title">最新采集时间：</span>
          <span class="value">{{item.timeStamp}}</span>
        </cell>
      </group>
      <group gutter="10px" v-for="(item,index) in dataList" :key="index" v-if="type === 'sms'">
        <div class="title" @click="openDetails(item)">产品实例标识：{{item.productNo}}</div>
        <cell value-align="left">
          <span class="label" slot="title">发送条数：</span>
          <span class="value">{{item.sendTotalCount}}</span>
        </cell>
        <cell value-align="left">
          <span class="label" slot="title">发送成功率：</span>
          <span class="value">{{item.sucUpSendUtil}}</span>
        </cell>
        <cell value-align="left">
          <span class="label" slot="title">服务代码：</span>
          <span class="value">{{item.serviceCode}}</span>
        </cell>
      </group>
      <div class="load-more" @click="loadMore" v-show="showLoad">点击加载更多</div>
      <div class="noData" v-show="showNoData">没有数据…</div>
    </div>
    <popup position="right" width="90%" v-show="isShowPopup">
      <div class="popup-ht">搜索</div>
      <div class="popup-content">
        <group gutter="0">
          <x-input title="产品实例标识" placeholder="产品实例标识" text-align="right" v-model="productNo"></x-input>
          <selector title="业务类型" direction="rtl" :options="selectList" v-model="type"></selector>
        </group>
      </div>
      <div class="popup-ft vux-1px-t">
        <div class="btn vux-1px-r" @click="hidePopup">取消</div>
        <div class="btn vux-1px-r" @click="resetPopup">重置</div>
        <div class="btn" @click="confirmPopup">确定</div>
      </div>
    </popup>
  </div>
</template>

<script>
import { Tab, TabItem, Group, Cell, Popup, XInput, Selector } from 'vux'
import { prefList } from '@/api/service'
import { mapGetters } from 'vuex'

export default {
  components: {
    Popup,
    Tab,
    TabItem,
    Group,
    Cell,
    XInput,
    Selector
  },
  data () {
    return {
      showLoad: false,
      showNoData: false,
      timestamp: '',
      lineType: '',
      page: 1,
      type: '',
      productNo: '',
      customerCode: '',
      customerName: '',
      tabList: [
        { name: '数据专线', value: 'trans' },
        { name: 'apn专线', value: 'apn' },
        { name: '互联网专线', value: 'net' },
        { name: '语音专线', value: 'speech' },
        { name: '短信专线', value: 'sms' },
        { name: 'MPLS专线', value: 'mpls' }
      ],
      selectList: [
        { key: 'trans', value: '数据专线' },
        { key: 'apn', value: 'apn专线' },
        { key: 'net', value: '互联网专线' },
        { key: 'speech', value: '语音专线' },
        { key: 'sms', value: '短信专线' },
        { key: 'mpls', value: 'MPLS专线' }
      ],
      dataList: []
    }
  },
  beforeRouteEnter (to, from, next) {
    to.meta.keepAlive = true
    if (from.name === 'capacityDetails') {
      next(vm => {
        vm.$refs.wrapper.scrollTop = to.meta.savePosition
      })
    } else {
      next()
    }
  },
  beforeRouteLeave (to, from, next) {
    const top = this.$refs.wrapper.scrollTop
    if (to.name === 'capacityDetails') {
      from.meta.savePosition = top
    } else if (to.name === 'home') {
      from.meta.keepAlive = false
    }
    next()
  },
  created () {
    this.initData()
  },
  activated () {
    const timestamp = this.$route.query.timestamp
    if (timestamp !== this.timestamp) {
      this.timestamp = timestamp
      this.initData()
    }
  },
  computed: {
    ...mapGetters([
      'isShowPopup'
    ])
  },
  methods: {
    initData () {
      if (this.$route.query.type === undefined) {
        this.type = 'trans'
      } else {
        this.type = this.$route.query.type
      }
      this.getPref()
    },
    // 改变导航
    changeTab (name) {
      this.type = name
      this.page = 1
      this.getPref()
    },
    loadMore () {
      this.page += 1
      this.getPref()
    },
    getPref () {
      const param = {
        type: this.type,
        customerCode: this.customerCode,
        customerName: this.customerName,
        productNo: this.productNo
      }
      const payload = {
        page: this.page
      }
      this.showNoData = false
      prefList(param, payload).then(result => {
        if (result.rows.length) {
          if (this.page > 1) {
            this.dataList = this.dataList.concat(result.rows)
          } else {
            this.dataList = result.rows
          }
          this.showLoad = true
        } else if (this.page > 1) {
          this.showLoad = false
        } else {
          this.showLoad = false
          this.showNoData = true
          this.dataList = []
          this.$vux.alert.show({ content: '暂无数据' })
        }
      })
    },
    openDetails (data) {
      const query = {}
      if (this.type === 'trans') {
        query.flowid = data.flowid
        query.productNo = data.productNo
        query.type = this.type
      } else {
        query.productNo = data.productNo
        query.type = this.type
      }
      this.$router.push({
        name: 'capacityDetails',
        query
      })
    },
    hidePopup () {
      this.$store.dispatch('showPopup', false)
    },
    resetPopup () {
      this.productNo = ''
      this.type = ''
      this.customerCode = ''
      this.customerName = ''
    },
    confirmPopup () {
      this.$store.dispatch('showPopup', false)
      this.page = 1
      this.getPref()
      // this.productNo = ''
    }
  }
}
</script>

<style scoped lang="less">
  .wrapper {
    height: 100%;
  }

  .content-wrapper {
    height: calc(100% - 44px);
    overflow-y: auto;

    .title {
      line-height: 18px;
      padding: 10px 5px 10px 15px;
      color: @theme-color;
    }

    .label, value {
      font-size: 13px;
      line-height: 13px;
    }

    .label {
      display: block;
      min-width: 80px;
    }

    .load-more, .noData {
      text-align: center;
      color: #bbb;
      font-size: 14px;
      line-height: 40px;
    }

    .noData {
      padding-top: 30px;
    }
  }

  .popup-ht {
    text-align: center;
    line-height: 40px;
    height: 40px;
  }

  .popup-content {
    height: calc(100% - 80px);
    overflow-y: auto;
  }

  .popup-ft {
    display: flex;

    .btn {
      flex: 1;
      line-height: 40px;
      text-align: center;
      cursor: pointer;

      &:last-child {
        background: @theme-color;
        color: #ffffff;
      }
    }
  }
</style>
