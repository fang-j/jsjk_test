<template>
  <div class="header-bar">
    <div class="portrait">
      <img :src="avatar">
    </div>
    <span class="line"></span>
    <div class="info">
      <div class="name">{{customerName}}</div>
      <div class="identity">
        <span>{{province}} - </span>
        <span v-if="roleId === 3">管理员</span>
        <span v-if="roleId === 5">维护人员</span>
      </div>
    </div>
    <i class="iconfont iconshezhi" @click="openSetting"></i>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import defaultImg from './defaultAvatar.png'

export default {
  name: 'HeaderBar',
  data () {
    return {
      province: '',
      avatar: ''
    }
  },
  computed: {
    ...mapGetters([
      'customerName',
      'roleId',
      'domainId',
      'areaList'
    ])
  },
  created () {
    this.avatar = defaultImg
    this.areaList.forEach((item, index) => {
      if (item.name === this.domainId) {
        this.province = item.value
      }
    })
  },
  methods: {
    openSetting () {
      this.$router.push({
        name: 'setting'
      })
    }
  }
}
</script>

<style scoped lang="less">
  .header-bar {
    height: 80px;
    width: 100%;
    padding: 10px;
    display: flex;
    align-items: center;
    position: relative;
    background-image: url("./header-bg.png");
    background-repeat: no-repeat;
    background-position: 0 80%;
    background-size: cover;
  }

  .portrait {
    img {
      width: 60px;
      height: 60px;
      border-radius: 50%;
    }
  }

  .line {
    height: 100%;
    background: linear-gradient(to bottom, transparent 10%, rgba(255, 255, 255, 0.7) 50%, transparent 90%);
    width: 1px;
    margin: 0 10px;
  }

  .info {
    color: #fff;
    flex: 1;

    .name {
      font-size: 16px;
      line-height: 16px;
      height: 16px;
      margin-bottom: 10px;
    }

    .identity {
      font-size: 13px;
      line-height: 14px;
      height: 14px;
    }
  }

  i {
    color: #fff;
    font-size: 32px;
    position: absolute;
    top: 10px;
    right: 5px;
  }
</style>
