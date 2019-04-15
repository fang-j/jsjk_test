<template>
  <div class="wrapper">
    <div class="list-wrapper" ref="wrapper">
      <div class="item" v-for="(item,index) in dataList" :key="index">
        <group gutter="10px">
          <div class="title" @click="openList(item.zhLabel,item.customerCode)">
            <span class="index">{{index+1}}.</span>
            <span class="content">{{item.zhLabel}}</span>
          </div>
          <cell value-align="left">
            <span class="name" slot="title">客户编号：</span>
            <span class="value">{{item.customerCode}}</span>
          </cell>
          <cell value-align="left">
            <span class="name" slot="title">客户服务等级：</span>
            <span class="value" v-if="item.serviceLevel === '1'">金牌</span>
            <span class="value" v-else-if="item.serviceLevel === '2'">银牌</span>
            <span class="value" v-else-if="item.serviceLevel === '3'">铜牌</span>
            <span class="value" v-else>标准</span>
          </cell>
          <cell value-align="left">
            <span class="name" slot="title">客户经理：</span>
            <span class="value">{{item.marketingManager}}</span>
          </cell>
          <cell value-align="left">
            <span class="name" slot="title">客户地市：</span>
            <span class="value">{{item.cityId}}</span>
          </cell>
        </group>
      </div>
      <div class="load-more" @click="loadMore" v-show="showLoadMore">点击加载更多</div>
      <div class="error" v-show="noResult">没有数据…</div>
    </div>
    <!--<div class="right-wrapper">-->
    <!---->
    <!--</div>-->
    <popup v-show="isShowPopup" position="right" width="90%">
      <div class="popup-wrapper">
        <div class="title">搜索</div>
        <div class="content-wrapper">
          <group gutter="0">
            <x-input title="客户编号" placeholder="请输入客户编号" :show-clear="false"
                     text-align="right" v-model="customerCode">
            </x-input>
            <x-input title="客户名称" placeholder="请输入客户名称" :show-clear="false"
                     text-align="right" v-model="zhLabel">
            </x-input>
            <selector title="客户级别" placeholder="请选择客户级别" v-model="cusLevel" direction="rtl"
                      :options="levelOption"></selector>
            <selector title="客户服务等级" placeholder="请选择服务等级" v-model="serviceLevel" direction="rtl"
                      :options="gradeOption"></selector>
          </group>
        </div>
        <div class="popup-ft vux-1px-t">
          <div class="btn vux-1px-r" @click="hidePopup">取消</div>
          <div class="btn vux-1px-r" @click="resetForm">重置</div>
          <div class="btn" @click="seach">确定</div>
        </div>
      </div>
    </popup>

  </div>
</template>

<script>
import { Group, Cell, Popup, XInput, Selector } from 'vux'
import { mapGetters } from 'vuex'
import { customer } from '@/api/service'

export default {
  components: {
    Group,
    Cell,
    Popup,
    XInput,
    Selector
  },
  data () {
    return {
      show: true,
      customerCode: '',
      zhLabel: '',
      serviceLevel: '',
      cusLevel: '',
      gradeOption: [
        { key: '1', value: '金牌' },
        { key: '2', value: '银牌' },
        { key: '3', value: '铜牌' },
        { key: '4', value: '标准' }
      ],
      levelOption: [
        { key: '1', value: '金牌客户' },
        { key: '2', value: '银牌客户' },
        { key: '3', value: '铜牌客户' },
        { key: '4', value: '标准客户' }
      ],
      page: 1,
      dataList: [],
      showLoadMore: false,
      noResult: false,
      timestamp: ''
    }
  },
  computed: {
    ...mapGetters([
      'isShowPopup'
    ])
  },
  // 路由进入之前，让此页面缓存
  beforeRouteEnter (to, from, next) {
    to.meta.keepAlive = true//eslint-disable-line
    if (from.name === 'list') {
      next(vm => {
        vm.$refs.wrapper.scrollTop = to.meta.savePosition
      })
    } else {
      next()
    }
  },
  // 路由离开之前，只有此页面后退离开去home也才让此页面不在缓存
  beforeRouteLeave (to, from, next) {
    const dom = this.$refs.wrapper.scrollTop
    if (to.name === 'list') {
      from.meta.keepAlive = true
      from.meta.savePosition = dom
    } else if (to.name === 'home') {
      from.meta.keepAlive = false
    }
    next()
  },
  created () {
    if (this.$route.query.level !== undefined) {
      this.serviceLevel = this.$route.query.level
    } else {
      this.cusLevel = ''
    }
    this.initCustomer()
  },
  activated () {
    const timestamp = Number(this.$route.query.timestamp)
    if (this.timestamp !== timestamp) {
      this.timestamp = timestamp
      if (this.$route.query.level !== undefined) {
        this.serviceLevel = this.$route.query.level
      } else {
        this.cusLevel = ''
      }
      this.initCustomer()
    }
  },
  methods: {
    loadMore () {
      this.page += 1
      this.initCustomer()
    },
    initCustomer () {
      const param = {
        cityId: '',
        customerAdd: '',
        customerCode: this.customerCode,
        serviceLevel: this.serviceLevel,
        customerGrade: this.cusLevel,
        zhLabel: this.zhLabel
      }
      const payload = {
        page: this.page
      }
      this.noResult = false
      customer(param, payload).then(result => {
        if (result.rows.length && result.rows instanceof Array) {
          if (this.page > 1) {
            this.dataList = this.dataList.concat(result.rows)
          } else {
            this.dataList = result.rows
          }
          this.showLoadMore = true
        } else if (this.page > 1) {
          this.showLoadMore = false
          this.noResult = true
        } else {
          this.dataList = []
          this.showLoadMore = false
          this.noResult = true
        }
      }).catch(error => {
        this.$vux.alert.show({ content: error })
      })
    },
    // 搜索
    seach () {
      this.page = 1
      this.$store.dispatch('showPopup', false)
      this.initCustomer()
    },
    // 重置
    resetForm () {
      this.serviceLevel = ''
      this.cusLevel = ''
      this.customerCode = ''
      this.zhLabel = ''
    },
    hidePopup () {
      this.$store.dispatch('showPopup', false)
    },
    openList (title, code) {
      this.$router.push({
        name: 'list',
        query: {
          title: title,
          code: code
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

  .list-wrapper {
    height: 100%;
    overflow-y: auto;
    padding-bottom: 30px;

    .item {
      .title {
        padding: 7px 15px;
        font-size: 14px;

        .content {
          color: #5a97ff;
        }
      }

      .name, .value {
        font-size: 13px;
        line-height: 13px;
      }

      .name {
        display: block;
        min-width: 80px;
      }
    }

    .load-more, .error {
      text-align: center;
      color: #bbb;
      font-size: 14px;
      line-height: 40px;
    }

    .error {
      padding-top: 30px;
    }

  }

  .popup-wrapper {
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;

    .title {
      text-align: center;
      line-height: 40px;
      height: 40px;
    }

    .content-wrapper {
      position: absolute;
      overflow-y: auto;
      width: 100%;
      top: 40px;
      bottom: 40px;
      font-size: 14px;

      .name {
        font-size: 14px;
      }
    }

    .popup-ft {
      display: flex;
      height: 40px;
      position: absolute;
      bottom: 0;
      width: 100%;

      .btn {
        line-height: 40px;
        flex: 1;
        text-align: center;

        &:last-child {
          background: @theme-color;
          color: #fff;
        }
      }
    }
  }
</style>
