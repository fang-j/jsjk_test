<template>
  <div class="wrapper">
    <popover placement="bottom" class="list-item" v-for="(item,index) in dataList" :key="index"
             v-if="orderStatus === '已完成'">
      <div slot="content" class="popover-demo-content">
        <p class="name">联系人：{{item.value.username}}</p>
        <p class="name">联系电话：{{item.value.phoneNum}}</p>
      </div>
      <div class="btn btn-default"><span :class="orderStatus === '已完成' ? 'green' : 'yellow'">{{item.nodeName}}</span>
      </div>
      <div class="line" v-show="index<dataList.length-1"></div>
    </popover>
    <popover placement="bottom" class="list-item" v-for="(item,index) in dataList" :key="index"
             v-if="orderStatus !== '已完成'">
      <div slot="content" class="popover-demo-content" v-if="item.value !== null">
        <p class="name">联系人：{{item.value.username}}</p>
        <p class="name">联系电话：{{item.value.phoneNum}}</p>
      </div>
      <div class="btn btn-default" v-if="count === index"><span class="yellow">{{item.nodeName}}</span></div>
      <div class="btn btn-default" v-else><span :class="item.value !== null  ? 'green' : ''">{{item.nodeName}}</span></div>
      <div class="line" v-show="index<dataList.length-1"></div>
    </popover>
    <div class="lengend">
      <div class="item">
        <span class="cell green"></span>
        <span class="name">完成环节</span>
      </div>
      <div class="item">
        <span class="cell yellow"></span>
        <span class="name">当前环节</span>
      </div>
      <div class="item">
        <span class="cell gray"></span>
        <span class="name">未经环节</span>
      </div>
    </div>
  </div>
</template>

<script>
import { Popover } from 'vux'
import { orderNodeFlow } from '@/api/service'
import ClickOutside from '@/directives/clickoutside'

export default {
  name: 'nodeFlow',
  components: {
    Popover
  },
  directives: {
    ClickOutside
  },
  data () {
    return {
      showPopover: true,
      orderStatus: this.$route.query.orderStatus,
      openImg: [
        {
          nodeName: '方案审核',
          value: null,
          names: ['定单审核预调度', '派发设计单', '', '线路方案设计', '线路方案审核', '省部方案审核', '省部审核', '定单审核']
        },
        {
          nodeName: '管线施工',
          value: null,
          names: ['派发测试单', '派发施工单', '施工预约', '挂起确认', '挂起审核', '解除挂起', '管线施工', '管线施工资源入库(绿色)', '施工审核', '管线资源入库', '管线资源入库审核']
        },
        {
          nodeName: '资源配置',
          value: null,
          names: ['光路调度', '光路调度(绿色)', '资源配置', '电路确认', '资源配置异常审核',
            '资源配置异常制作(补录专线)', '省干传输资源配置']
        },
        {
          nodeName: '数据制作',
          value: null,
          names: ['互联网数据制作', '公网IP分配', '语音数据制作', 'MPLS-VPN数据制作', '局数据配置',
            '局数据确认', '数据制作(地市GRE隧道)', 'MPLS-VPN数据制作', 'GPRS核心网局数据配置',
            'HLR局数据配置(省中心)', 'HLR局数据配置(无锡中心)']
        },
        {
          nodeName: '客户端设备安装',
          value: null,
          names: ['测试预约', '客户侧设备安装与测试', '客户侧设备安装业务测试', '客户测业务调测',
            '客户侧设备安装业务测试(绿色)', '客户侧测试异常审核', '客户侧业务测试']
        },
        {
          nodeName: '告警验证',
          value: null,
          names: ['告警验证受理', '告警验证审核']
        },
        {
          nodeName: '照片上传',
          value: null,
          names: ['照片上传受理', '照片上传审核']
        },
        {
          nodeName: '省公司质检',
          value: null,
          names:
            ['验收申请', '省部竣工验收审核', '竣工省部确认', '竣工省部审核']
        }
      ],
      dataList: [],
      count: 0
    }
  },
  created () {
    this.initData()
  },
  methods: {
    initData () {
      orderNodeFlow(this.$route.query.type, this.$route.query.orderId).then(result => {
        const data = result.rows
        if (data.length > 0) {
          this.openImg.forEach(item => {
            data.forEach(item2 => {
              const count = item.names.indexOf(item2.taskDescription)
              if (count !== -1) {
                item.value = item2
              }
            })
          })
          if (this.orderStatus === '已完成') {
            this.openImg.forEach(list => {
              if (list.value !== null) {
                this.dataList.push(list)
              }
            })
          } else {
            this.dataList = this.openImg
            this.dataList.forEach((item, index) => {
              if (item.value !== null) {
                this.count = index
              }
            })
          }
        }
      })
    },
    click () {
      if (this.showPopover) {
        this.showPopover = false
      }
    },
    showP () {
      this.showPopover = true
    }
  }
}
</script>

<style scoped lang="less">
  .wrapper {
    padding: 10px 0;
  }

  .list-item {
    .line {
      width: 1px;
      height: 40px;
      background: #999;
      margin: 0 auto;
      position: relative;

      &:after {
        position: absolute;
        content: '';
        bottom: 0;
        left: -4px;
        border-color: #999 transparent transparent transparent;
        border-style: solid;
        border-width: 8px 4px 0 4px;
      }
    }
  }

  .btn {
    text-align: center;
    font-size: 13px;

    span {
      display: inline-block;
      border-radius: 12px;
      line-height: 16px;
      background: #ccc;
      color: #000;
      padding: 5px;
      border: 1px solid #999;

      &.green {
        background: #31b41b;
        color: #ffffff;
        border-color: #31b41b;
      }

      &.yellow {
        background: rgb(242, 156, 7);
        color: #ffffff;
        border-color: rgb(242, 156, 7);

      }
    }
  }

  .popover-demo-content {
    padding: 8px;

    .name {
      font-size: 12px;
    }
  }

  .lengend {
    padding: 5px;
    position: absolute;
    bottom: 0;
    left: 0;

    .item {
      font-size: 12px;
      margin-bottom: 10px;

      .cell {
        width: 24px;
        height: 10px;
        display: inline-block;

        &.green {
          background: rgb(49, 180, 27);
        }

        &.yellow {
          background: rgb(242, 156, 7);
        }

        &.gray {
          background: #898989;
        }
      }
    }
  }
</style>
