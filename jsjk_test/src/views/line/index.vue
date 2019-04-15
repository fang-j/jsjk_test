<template>
  <div class="wrapper">
    <tab :line-width="2">
      <tab-item :selected="item.name === lineType" @on-item-click="changeTab(item.name,index)"
                v-for="(item,index) in tabList"
                :key="index">{{item.name}}
      </tab-item>
    </tab>
    <div class="list" ref="list">
      <group gutter="10px" v-for="(item,index) in dataList" :key="index">
        <div class="title"><span class="index">{{index+1}}.</span>{{item.businessType}}</div>
        <cell value-align="left">
          <span class="label" slot="title">客户编号：</span>
          <span class="value">{{item.customerCode}}</span>
        </cell>
        <cell value-align="left">
          <span class="label" slot="title">客户名称：</span>
          <span class="value">{{item.customerName}}</span>
        </cell>
        <cell value-align="left">
          <span class="label" slot="title">业务类型：</span>
          <span class="value">{{item.lineType}}</span>
        </cell>
        <cell value-align="left">
          <span class="label" slot="title">产品实例标识：</span>
          <span class="value">{{item.productNo}}</span>
        </cell>
        <cell value-align="left">
          <span class="label" slot="title">业务保障等级：</span>
          <span class="value">{{item.aAssureGrade}}</span>
        </cell>
        <cell value-align="left">
          <span class="label" slot="title">接入地址：</span>
          <span class="value">{{item.zAddress}}</span>
        </cell>
        <div class="btn-box">
          <div class="btn" @click="open(item)">拓扑</div>
          <div class="btn" @click="openCapacity(item,index)">性能</div>
          <div class="btn" @click="openOrderList(item,'comp')">投诉</div>
          <div class="btn" @click="openOrderList(item,'fault')">故障</div>
        </div>
      </group>
      <div class="load-more" @click="loadMore" v-show="showMore">点击加载更多</div>
      <div class="noResult" v-show="noResult">没有数据…</div>
    </div>
    <popup position="right" v-show="isShowPopup" width="90%">
      <div class="popup-hd">搜索</div>
      <div class="popup-content">
        <group gutter="0">
          <x-input title="客户编号" placeholder="请输入客户编号" text-align="right" v-model="code"></x-input>
          <x-input title="客户名称" placeholder="请输入客户名称" text-align="right"></x-input>
          <x-input title="产品实例标识" placeholder="产品实例标识" text-align="right"></x-input>
          <selector title="业务类型" :options="selectList" direction="rtl"></selector>
        </group>
      </div>
      <div class="popup-ft vux-1px-t">
        <div class="btn vux-1px-r" @click="hidePopup">取消</div>
        <div class="btn vux-1px-r" @click="resetForm">重置</div>
        <div class="btn" @click="seach">确定</div>
      </div>
    </popup>
  </div>
</template>

<script>
import { Tab, TabItem, Popup, Group, Cell, XInput, Selector } from 'vux'
import { mapGetters } from 'vuex'
import { lineList } from '@/api/service'

export default {
  components: {
    Tab,
    TabItem,
    Popup,
    XInput,
    Cell,
    Group,
    Selector
  },
  computed: {
    ...mapGetters([
      'isShowPopup'
    ])
  },
  data () {
    return {
      show: true,
      code: '',
      tabIndex: '',
      lineType: '',
      timestamp: '',
      customerName: '',
      page: 1,
      productNo: '',
      dataList: [],
      showMore: true,
      noResult: false,
      tabList: [
        { name: '互联网专线', type: 'net' },
        { name: 'MPLS专线', type: 'mpls' },
        { name: '传输专线', type: 'trans' },
        { name: 'APN专线', type: 'apn' },
        { name: '短信专线', type: 'sms' },
        { name: '语音专线', type: 'speech' }
      ],
      selectList: [
        { key: '互联网专线', value: '互联网专线' },
        { key: 'MPLS专线', value: 'MPLS专线' },
        { key: '传输专线', value: '传输专线' },
        { key: 'GPRS专线', value: 'APN专线' },
        { key: '短信专线', value: '短信专线' },
        { key: '语音专线', value: '语音专线' }
      ]
    }
  },
  beforeRouteEnter (to, from, next) {
    to.meta.keepAlive = true
    if (from.name === 'home') {
      next()
    } else {
      next(vm => {
        vm.$refs.list.scrollTop = to.meta.savePosition
      })
    }
  },
  beforeRouteLeave (to, from, next) {
    const top = this.$refs.list.scrollTop
    if (to.name === 'home') {
      from.meta.keepAlive = false
    } else {
      from.meta.savePosition = top
    }
    next()
  },
  created () {
    this.$route.meta.title = '专线列表'
    this.initData()
  },
  activated () {
    const timestamp = Number(this.$route.query.timestamp)
    if (timestamp !== this.timestamp) {
      this.$route.meta.title = '专线列表'
      this.timestamp = timestamp
      // 初始化数据
      this.initData()
    }
  },
  methods: {
    initData () {
      this.$store.dispatch('showPopup', false)
      const type = this.$route.query.type
      if (type !== undefined) {
        this.lineType = type
      } else {
        this.lineType = '互联网专线'
        this.tabIndex = 0
      }
      if (this.$route.query.code !== undefined) {
        this.code = this.$route.query.code
      } else {
        this.code = ''
      }
      this.getLineList()
    },
    changeTab (name, index) {
      this.lineType = name
      this.tabIndex = index
      this.page = 1
      this.getLineList()
      this.$nextTick(() => {
        this.$refs.list.scrollTop = 0
      })
    },
    loadMore () {
      this.page += 1
      this.getLineList()
    },
    getLineList () {
      const param = {
        lineType: this.lineType,
        customerCode: this.code,
        customerName: this.customerName,
        productNo: this.productNo
      }
      const payload = {
        page: this.page
      }
      this.noResult = false
      lineList(param, payload).then(result => {
        if (result.rows.length) {
          if (this.page > 1) {
            this.dataList = this.dataList.concat(result.rows)
          } else {
            this.dataList = result.rows
          }
          this.showMore = true
        } else if (this.page > 1) {
          this.showMore = false
          this.noResult = false
          this.$vux.alert.show({ content: '暂无更多的数据' })
        } else {
          this.dataList = []
          this.showMore = false
          this.noResult = true
        }
      })
    },
    hidePopup () {
      this.$store.dispatch('showPopup', false)
    },
    resetForm () {
    },
    seach () {
      this.$store.dispatch('showPopup', false)
    },
    open (data) {
      this.$router.push({
        name: 'topology',
        query: {
          title: `${data.lineType}${data.serviceId}`,
          serviceId: data.serviceId,
          lineType: data.lineType
        }
      })
    },
    openCapacity (data, index) {
      this.$router.push({
        name: 'capacityDetails',
        query: {
          type: this.tabList[this.tabIndex].type,
          productNo: data.productNo,
          flowid: data.flowid
        }
      })
    },
    openOrderList (data, type) {
      let title = ''
      if (type === 'comp') {
        title = '投诉工单'
      } else {
        title = '故障工单'
      }
      this.$router.push({
        name: 'orderList',
        query: {
          title: title,
          code: data.customerCode,
          type: type
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
  .wrapper {
    height: 100%;
  }

  .list {
    height: calc(100% - 44px);
    overflow-y: auto;

    .title {
      padding: 7px 5px 7px 15px;
      font-size: 14px;
      color: #5a97ff;

      .index {
        color: black;
      }
    }

    .label {
      display: inline-block;
      min-width: 80px;
      overflow: hidden;
    }

    .label, .value {
      line-height: 13px;
      font-size: 13px;
    }

    .btn-box {
      display: flex;
      justify-content: flex-end;
      padding: 10px;

      .btn {
        border: 1px solid #5a97ff;
        line-height: 12px;
        text-align: center;
        padding: 5px 8px;
        border-radius: 3px;
        font-size: 12px;
        color: #5a97ff;
        margin-left: 8px;
        cursor: pointer;
      }
    }

    .load-more, .noResult {
      text-align: center;
      color: #bbb;
      font-size: 14px;
      line-height: 40px;
    }
  }

  .popup-hd {
    font-size: 16px;
    text-align: center;
    line-height: 40px;
    height: 40px;
  }

  .popup-content {
    height: calc(100% - 80px);
    overflow-y: auto;
  }

  .popup-ft {
    height: 40px;
    display: flex;

    .btn {
      flex: 1;
      line-height: 40px;
      text-align: center;

      &:last-child {
        background: #5a97ff;
        color: #fff;
      }
    }
  }
</style>
