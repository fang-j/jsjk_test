<template>
  <div class="wrapper">
    <div class="date-wrapper">
      <span class="name">查询时间：</span>
      <div class="input" @click="isShowPopup=true">{{dateStr}}</div>
    </div>
    <x-table class="table" v-if="dataList.length>0">
      <thead>
      <tr>
        <th>地市</th>
        <th>安装次数</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item,index) in dataList" :key="index">
        <td>{{item.region}}</td>
        <td>{{item.num}}</td>
      </tr>
      </tbody>
    </x-table>
    <group gutter="0">
      <popup-picker :show-cell="false" :show.sync="isShowPopup" :data="weekList" v-model="week" :columns="3"
                    @on-change="changeDate"></popup-picker>
    </group>
  </div>
</template>

<script>
import { Group, PopupPicker, XTable } from 'vux'
import moment from 'moment'
import { getInstallationTimes } from '@/api/service'

export default {
  components: {
    Group,
    PopupPicker,
    XTable
  },
  data () {
    return {
      isShowPopup: false,
      dataList: [],
      weekList: [],
      currentDate: '',
      week: [],
      start_time: '',
      end_time: ''
    }
  },
  computed: {
    dateStr () {
      // 获取当前时间周一周日的日期
      const year = this.week[0]
      const week = this.week[1]
      const date = moment(year, 'YYYY').week(week)
      const mon = this.getMon(date)
      const sun = this.getSun(date)
      return `${year}年 第${week}周 ${moment(mon).format('MM-DD')}/${moment(sun).format('MM-DD')}`
    }
  },
  created () {
    this.initData()
  },
  methods: {
    initData () {
      // 计算开始年份到结束年份的日期
      const startYear = 2017
      const currentYear = new Date().getFullYear()
      const endYear = currentYear + 1
      for (let i = 0; i <= endYear - startYear; i++) {
        const currentYear = startYear + i
        // 将年份传过去计算年份中有几周
        const arr = this.initWeek(startYear + i)
        this.weekList.push({ name: `${currentYear}`, value: `${currentYear}` })
        this.weekList = this.weekList.concat(arr)
      }
      // 获取当前时间周一的日期
      // 获取1天前的日期
      this.currentDate = moment().subtract(1, 'days')
      this.week = [`${currentYear}`, moment(this.getMon(this.currentDate)).format('WW')]
      this.start_time = `${currentYear}-${moment(this.getMon(this.currentDate)).format('MM-DD')}`
      this.end_time = `${currentYear}-${moment(this.getSun(this.currentDate)).format('MM-DD')}`
      this.getInstallInfo()
    },
    // 获取周一的日期
    getMon (date) {
      // 获取传来的日期为周几
      const weekOfDay = moment(date).format('E')
      return moment(date).subtract(weekOfDay - 1, 'day')
    },
    // 获取周日的日期
    getSun (date) {
      const weekOfDay = moment(date).format('E')
      return moment(date).add(7 - weekOfDay, 'day')
    },
    // 计算当前年份的总共有几周
    initWeek (year) {
      const arr = []
      for (let i = 1; i <= 53; i++) {
        // 获取第几周的日期
        const date = moment(year, 'YYYY').week(i)
        const mon = this.getMon(date)
        const sun = this.getSun(date)
        const sundayYear = new Date(sun).getFullYear()
        const week = i < 10 ? `0${i}` : i
        if (sundayYear === year) {
          arr.push({
            name: `第${week}周 ${moment(mon).format('MM-DD')}/${moment(sun).format('MM-DD')}`,
            value: `${week}`,
            parent: `${year}`
          })
        }
      }
      return arr
    },
    changeDate (val) {
      const year = val[0] // 年份
      const week = val[1] // 第几周
      const currentDate = moment(year, 'YYYY').week(week) // 改变日期
      const monday = this.getMon(currentDate)
      const sunday = this.getSun(currentDate)
      this.start_time = moment(monday).format('YYYY-MM-DD')
      this.end_time = moment(sunday).format('YYYY-MM-DD')
      this.getInstallInfo()
    },
    getInstallInfo () {
      getInstallationTimes(this.start_time, this.end_time).then(result => {
        if (result.length > 0) {
          this.dataList = result
        } else {
          this.dataList = []
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
  .wrapper {
    position: absolute;
    top: 0;
    bottom: 0;
    overflow-y: auto;
    width: 100%;
  }

  .date-wrapper {
    background: #fff;
    padding: 20px;
    display: flex;
    align-items: center;

    .name {
      font-size: 14px;
    }

    .input {
      line-height: 40px;
      height: 40px;
      font-size: 14px;
      color: @theme-color;
      background: #f5f5f5;
      flex: 1;
      text-align: center;
      border-radius: 3px;
      border: 1px solid #ddd;
    }
  }
  .table{
    background: #fff;
  }
</style>
