<template>
  <div class="wrapper">
    <!--<test :count="count"></test>-->
    <div class="logo"></div>
    <div class="title">集客一站式响应支撑系统</div>
    <div class="login-wrapper">
      <form autocomplete="off" @submit.prevent="login">
        <div class="item">
          <label>
            <span class="icon person"></span>
            <input type="text" placeholder="请输入用户名" v-model="userName">
          </label>
        </div>
        <div class="item">
          <label>
            <span class="icon lock"></span>
            <input type="password" placeholder="请输入密码" v-model="password">
          </label>
        </div>
        <div class="item">
          <label>
            <span class="icon code"></span>
            <input type="text" placeholder="请输入验证码" v-model="code">
          </label>
          <img class="code" :src="imgSrc" @click="getCode">
        </div>
        <div class="item">
          <label>
            <input class="check" type="checkbox" v-model="remberMe">
            <img class="checkbox-img" src="./remember_2.png" v-if="remberMe">
            <img class="checkbox-img" src="./remember_1.png" v-else>
            <span class="rember-pwd">记住密码</span>
          </label>
        </div>
        <button class="btn" type="submit">登录</button>
      </form>
    </div>
  </div>
</template>

<script>
import { login, getVerificationCode } from '@/api/service'
import { encryptByBase64, encryptBySHA1, decryptByBase64 } from '@/until/index'
import { XInput } from 'vux'
import test from '../../test/index'
export default {
  components: {
    XInput,
    test
  },
  data () {
    return {
      remberMe: false,
      imgSrc: '',
      imgId: '',
      userName: '',
      password: '',
      code: ''
    }
  },
  created () {
    // 进入页面判断本地存储是否有账号密码，进行解密
    const str = JSON.parse(localStorage.getItem('t'))
    if (str) {
      this.userName = decryptByBase64(str.name)
      this.password = decryptByBase64(str.pwd)
      this.remberMe = true
    } else {
      // console.log(str)
    }
    this.init()
  },
  methods: {
    init () {
      this.getCode()
    },
    getCode () {
      getVerificationCode().then(result => {
        if (result.status === '200') {
          this.imgSrc = `data:image/png;base64,${result.image}`
          this.imgId = result.imageid
        }
      })
    },
    login () {
      if (!this.userName.trim()) {
        this.$vux.alert.show({ content: '手机号不能为空' })
      } else if (!this.password.trim()) {
        this.$vux.alert.show({ content: '密码不能为空' })
      } else if (!this.code.trim()) {
        this.$vux.alert.show({ content: '验证码不能为空' })
      }
      // console.log(encryptBySHA1(this.userName))
      if (this.remberMe) {
        // 密码账号加密，存储到本地数据
        const obj = { name: encryptByBase64(this.userName), pwd: encryptByBase64(this.password) }
        localStorage.setItem('t', JSON.stringify(obj))
      } else {
        localStorage.removeItem('t')
      }
      const payload = {
        accountType: 'system_manager',
        userName: this.userName,
        userPwd: encryptBySHA1(this.password),
        sessionId: this.imgId,
        authCode: this.code
      }
      login(payload).then(result => {
        if (result.statusCode === 1) {
          this.$store.dispatch('setUserInfo', result.entity).then(() => {
            this.$router.replace({
              name: 'home',
              query: {
                timestamp: new Date().getTime()
              }
            })
          })
        } else {
          this.$vux.alert.show({ content: result.message })
          this.getCode()
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
  .wrapper {
    height: 100%;
    position: relative;
    padding-top: 50px;
    background: #fff;

    &:before {
      content: '';
      position: absolute;
      background-image: url("./bg.png");
      background-position: center;
      background-size: cover;
      width: 100%;
      height: 240px;
      top: 0;
      left: 0;
    }
  }

  .logo {
    position: relative;
    z-index: 1;
    background-image: url("./logo.png");
    background-size: contain;
    background-repeat: no-repeat;
    width: 64px;
    height: 64px;
    margin: 0 auto 10px;
  }

  .title {
    font-size: 16px;
    text-align: center;
    color: #fff;
    position: relative;
    z-index: 1;
    line-height: 24px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .login-wrapper {
    position: relative;
    padding: 0 20px;
    margin: 0 auto;
    max-width: 320px;

    form {
      background: #fff;
      border-radius: 3px;
      padding: 20px 20px 40px 20px;
      box-shadow: 0 4px 4px rgba(86, 86, 254, 0.2);
      overflow: hidden;
      position: relative;

      .item {
        display: flex;
        height: 36px;
        margin-bottom: 10px;
        overflow: hidden;
        position: relative;
        font-size: 13px;

        label {
          flex: 1;
          width: 100%;
          position: relative;
          height: 100%;
          line-height: 36px;
          display: flex;
          align-items: center;

          .icon {
            display: inline-block;
            width: 20px;
            height: 20px;
            position: absolute;
            top: 8px;
            left: 10px;
            background-repeat: no-repeat;
            background-size: contain;
            background-position: center;

            &.person {
              background-image: url("./person.png");
            }

            &.lock {
              background-image: url("./lock.png");
            }

            &.code {
              background-image: url("./code.png");
            }
          }

          .check {
            display: none;
          }

          .checkbox-img {
            width: 14px;
            height: 14px;
          }

          .rember-pwd {
            color: #ddd;
            margin-left: 10px;
          }

          input {
            height: 100%;
            width: 100%;
            padding-left: 40px;
            border: none;
            outline: none;
            background: #f4f6f8;
          }
        }

        img.code {
          height: 36px;
          width: 86px;
          background: #cccccc;
        }
      }

      .btn {
        position: absolute;
        bottom: 0;
        left: 0;
        line-height: 40px;
        height: 40px;
        background: #6977ff;
        border: none;
        width: 100%;
        color: #fff;
        font-size: 16px;
        outline: none;
      }
    }
  }
</style>
