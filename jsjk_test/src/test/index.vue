<template>
  <div class="box">
    <div class="pieWrapper" ref="pieWrapper">
      <div class="pie" ref="pie">
        <div class="item" ref="item" v-for="(item,index) in count" :key="index">{{item}}</div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      // 屏幕宽高
      screenW: '',
      screenH: '',
      wrapperX: '', // 容器中心坐标
      wrapperY: '',
      wrpperW: '', // 容器宽高
      wrpperH: '',
      preX: '', // 鼠标点击位置
      preY: '',
      remW: '', // 除去转盘宽度，剩余宽度
      remH: '', // 除去转盘宽度，剩余宽度
      itemW: '', // 选项宽度
      r: 60, // 半径
      angle: 0, // 旋转角度
      defaultAngel: '', // 根据选项格式计算默认角度
      preAngle: '', // 上一次鼠标点与圆心(100,100)的X轴形成的角度(弧度单位)
      transferAngle: ''// 当前(滑动结束)鼠标点与上一次preAngle之间变化的角度
    }
  },
  props: {
    count: {
      type: Number,
      default: 6
    }
  },
  mounted () {
    this.adapt()
    this.Addouch()
    this.$nextTick(() => {
      this.initPositon()
    })
  },
  methods: {
    adapt () {
      const bodyW = document.body.clientWidth
      const item = this.$refs.item
      if (bodyW <= 700) {
        this.r = 60
      } else {
        this.r = 120
        for (let i = 0; i < item.length; i++) {
          item[i].style.width = `100px`
          item[i].style.height = `100px`
          item[i].style.lineHeight = `100px`
        }
      }
    },
    // 计算位置
    initPositon () {
      // 容器
      const wrapper = document.getElementsByClassName('pieWrapper')[0]
      const length = this.$refs.item.length
      this.itemW = this.$refs.item[0].offsetWidth
      console.log(this.itemW)
      this.wrpperW = wrapper.offsetWidth // 容器高宽
      this.wrpperH = wrapper.offsetHeight
      this.wrapperX = this.wrpperW / 2 // 容器圆心坐标
      this.wrapperY = this.wrpperH / 2
      this.defaultAngel = 360 / length
      // 计算位置
      for (let i = 0; i < length; i++) {
        const X = Math.round(Math.cos(this.defaultAngel * i * (Math.PI / 180)) * this.r) // 算出临边的长度 相对于圆心坐标(100,100) x轴的位置（100+x，100）
        const Y = Math.round(Math.sin(this.defaultAngel * i * (Math.PI / 180)) * this.r) // 对边的长度
        // 26是每个小圆的一半宽高，减去26是为了使小圆的圆心正好在大圆的半径上
        this.$refs.item[i].style.top = this.wrapperY - Y - this.itemW / 2 + 'px' // 算出距顶部距离，盒子一半的高度-对边高度-小盒子的1/2高度
        this.$refs.item[i].style.left = this.wrapperX + X - this.itemW / 2 + 'px'
      }
      // 屏幕宽高
      this.screenW = document.body.clientWidth
      this.screenH = document.body.clientHeight
      this.remW = this.screenW - this.wrpperW
      this.remH = this.screenH - this.wrpperH
    },
    // 绑定触摸事件
    Addouch () {
      this.$refs.pie.addEventListener('touchmove', this.touchMove, false)
      this.$refs.pie.addEventListener('touchstart', this.touchStart, false)
      // this.$refs.pie.addEventListener('touchend', this.touchEnd, false)
    },
    touchStart (e) {
      // 获取点击的位置
      this.preX = e.touches[0].clientX - this.remW
      this.preY = e.touches[0].clientY - this.remH
      // 计算与圆心的夹角正切值
      this.preAngle = Math.atan2(this.preY - this.wrapperY, this.preX - this.wrapperX)
    },
    touchMove (e) {
      const x = e.changedTouches[0].clientX - this.remW
      const y = e.changedTouches[0].clientY - this.remH
      // 当前滑动的正切值
      const curAngle = Math.atan2(y - this.wrapperY, x - this.wrapperX)
      // 计算当前与上次鼠标点击位置的正切值
      this.transferAngle = curAngle - this.preAngle
      this.angle += (this.transferAngle * 180 / Math.PI)
      this.$refs.pie.style.transform = `rotate(${this.angle}deg)`
      for (let i = 0; i < this.$refs.item.length; i++) {
        this.$refs.item[i].style.transform = `rotate(${-this.angle}deg)`
      }
      this.preX = ''
      this.preY = ''
      this.preAngle = curAngle
    },
    touchEnd (e) {
      this.$refs.pie.removeEventListener('touchstart', this.touchStart, false)
      this.$refs.pie.removeEventListener('touchmove', this.touchMove, false)
    }
  }
}
</script>

<style scoped>
  .box {
    position: absolute;
    right: 0;
    bottom: 0;
    z-index: 999;
    overflow: hidden;
  }

  @media (max-width: 700px) {
    .pieWrapper {
      width: 200px;
      height: 200px;
    }
  }

  @media (min-width: 700px) and (max-width: 1024px) {
    .pieWrapper {
      width: 400px;
      height: 400px;
    }
  }

  .pieWrapper {
    background: #66CCFF;
    transform-origin: 50% 50%;
    overflow: hidden;
  }

  .item {
    width: 50px;
    height: 50px;
    border: 1px solid;
    position: absolute;
    top: 0;
    left: 0;
    text-align: center;
    line-height: 50px;
    border-radius: 50%;
  }

  .pie {
    width: 100%;
    height: 100%;
    background: #ff6300;
    border-radius: 50%;
    overflow: hidden;
    transform-origin: 50% 50%;
  }
</style>
