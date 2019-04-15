<template>
  <div class="wrapper">
    <div class="reset-wrapper">
      <div class="item">
        <span class="left">用户名</span>
        <span class="name">{{customerName}}</span>
      </div>
      <div class="item">
        <span class="left">旧密码</span>
        <input type="password" placeholder="请输入旧密码" class="oldPwd" v-model="oldPwd">
      </div>
      <div class="item">
        <span class="left">新密码</span>
        <input type="password" placeholder="请输入新密码" class="newPwd" v-model="newPwd">
      </div>
      <div class="item">
        <span class="left">确认新密码</span>
        <input type="password" placeholder="请确认新密码" class="confirmPwd" v-model="confirmPwd">
      </div>
      <div class="btn" @click="confirm">确认修改</div>
    </div>
  </div>
</template>

<script>
import { encryptBySHA1 } from '@/until/index'
import { psw } from '@/api/service'
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      oldPwd: '',
      newPwd: '',
      confirmPwd: ''
    }
  },
  computed: {
    ...mapGetters([
      'customerName'
    ])
  },
  methods: {
    confirm () {
      if (!this.oldPwd.trim()) {
        this.$vux.alert.show({ content: '旧密码不能为空' })
        return
      }
      if (!this.newPwd.trim()) {
        this.$vux.alert.show({ content: '新密码不能为空' })
        return
      }
      const passwordCheckCallBack = this.passwordCheckHandler(this.newPwd)
      if (passwordCheckCallBack !== '' && passwordCheckCallBack !== undefined) {
        this.$vux.alert.show({ content: passwordCheckCallBack })
        return
      }
      if (!this.confirmPwd.trim()) {
        this.$vux.alert.show({ content: '确认密码不能为空' })
        return
      }
      if (this.newPwd !== this.confirmPwd) {
        this.$vux.alert.show({ content: '两次密码输入不一致' })
      }
    },
    passwordCheckHandler (pwd) {
      if (!this.passwordCheck1(pwd)) {
        return '密码请包含大小写字母、数字和特殊符号，至少8位，特殊符号包含：-!@#$%^&*()+?<>'
      }
      if (!this.passwordCheck2(pwd, 'Test')) {
        return '口令不能为账号名相关的正序、反序'
      }
      if (this.isKeyBoardContinuousChar(pwd)) {
        return '口令不能含3位以上（含3位）键盘排序密码'
      }
      const rel = /(\w)*(\w)\2{2}(\w)*/g
      if (rel.test(pwd)) {
        return '口令中不能出现3位以上（含3位）连续字母、数字'
      }
      if (!this.lxStr(pwd)) {
        return '口令中不能出现3位以上（含3位）连续字母、数字'
      }
      this.restPassword()
    },
    passwordCheck1 (pwd) {
      const regex = new RegExp('(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,30}')
      return regex.test(pwd)
    },
    passwordCheck2 (str1, str2) {
      return !(str1 === str2 || str1.split('').reverse().join('') === str2)
    },
    lxStr (str) {
      const arr = str.split('')
      let flag = true
      for (let i = 1; i < arr.length - 1; i += 1) {
        const firstIndex = arr[i - 1].charCodeAt(0)
        const secondIndex = arr[i].charCodeAt(0)
        const thirdIndex = arr[i + 1].charCodeAt(0)
        if ((thirdIndex - secondIndex === 1) && (secondIndex - firstIndex === 1)) {
          flag = false
        }
      }
      return flag
    },
    /**
     * 键盘连续字符统计3个
     * @param str
     * @return
     */
    isKeyBoardContinuousChar (str) {
      var c1 = [
        ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+'],
        ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '{', '}', '|'],
        ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ':', '"'],
        ['z', 'x', 'c', 'v', 'b', 'n', 'm', '<', '>', '?']
      ]
      var c2 = [
        ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
        ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
        ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\''],
        ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/']
      ]
      str = str.split('')
      // 获取坐标位置
      const y = []
      const x = []
      for (let c = 0; c < str.length; c++) {
        y[c] = 0// 当做~`键处理
        x[c] = -1
        for (let i = 0; i < c1.length; i++) {
          for (let j = 0; j < c1[i].length; j++) {
            if (str[c] === c1[i][j]) {
              y[c] = i
              x[c] = j
            }
          }
        }
        if (x[c] !== -1) continue
        for (let i = 0; i < c2.length; i++) {
          for (let j = 0; j < c2[i].length; j++) {
            if (str[c] === c2[i][j]) {
              y[c] = i
              x[c] = j
            }
          }
        }
      }
      // 匹配坐标连线
      for (let c = 1; c < str.length - 1; c++) {
        if (y[c - 1] === y[c] && y[c] === y[c + 1]) {
          if ((x[c - 1] + 1 === x[c] && x[c] + 1 === x[c + 1]) || (x[c + 1] + 1 === x[c] && x[c] + 1 === x[c - 1])) {
            return true
          }
        } else if (x[c - 1] === x[c] && x[c] === x[c + 1]) {
          if ((y[c - 1] + 1 === y[c] && y[c] + 1 === y[c + 1]) || (y[c + 1] + 1 === y[c] && y[c] + 1 === y[c - 1])) {
            return true
          }
        }
      }
      return false
    },
    restPassword () {
      const params = {
        userPwd: encryptBySHA1(this.newPwd)
      }
      console.log(params)
      psw(params).then(result => {
        if (result.message === 'success') {
          this.$vux.alert.show({
            content: '修改成功'
          })
          this.$router.push({
            name: 'login'
          })
        } else {
          this.$vux.alert.show({
            content: result.message
          })
        }
      }).catch(error => {
        console.log(error)
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
    width: 100%;
    overflow-y: auto;
    padding: 10px;
  }

  .reset-wrapper {
    background: #ffffff;
    border-radius: 5px;
    padding: 15px;

    .item {
      position: relative;
      padding: 6px 0;
      display: flex;
      align-items: center;

      &:after {
        position: absolute;
        content: "";
        width: 100%;
        height: 1px;
        transform: scaleY(0.5);
        background: #f0f0f0;
        bottom: 0;
        left: 0;
      }

      .left {
        font-size: 14px;
        display: inline-block;
        min-width: 80px;
      }

      .name, input {
        flex: 1;
        line-height: 28px;
      }
    }

    .btn {
      background: @theme-color;
      text-align: center;
      line-height: 40px;
      color: #ffffff;
      border-radius: 5px;
      cursor: pointer;
      margin-top: 10px;
    }
  }
</style>
