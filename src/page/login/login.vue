<template>
  <div class="admin-login-box">
    <!-- 后台的登录入口，只有登录，没有注册，也没有找回密码-->
    <!-- 只有门户一个用户入口，如果是管理员则跳转到管理中心，否则，跳转到首页/重定向页面-->
    <!-- 如果是门户的登录，则有登录，注册，找回密码这些功能-->
    <!-- 顶部内容-->
    <div class="admin-login-header-box">
      <div class="admin-login-header-center center">
        <div class="admin-login-logo">
          博客系统 | 登录
        </div>
      </div>
    </div>
    <!-- 中间内容-->
    <div class="admin-login-center-box">
      <div class="center login-center-box">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form label-position="right" label-width="100px" :model="liugeUser">
              <el-form-item label="账号" required>
                <el-input v-model="liugeUser.userName" placeholder="用户名/邮箱地址"></el-input>
              </el-form-item>
              <el-form-item label="密码" required>
                <el-input type="password" v-model="liugeUser.password" placeholder="请输入密码"></el-input>
              </el-form-item>
              <el-form-item label="人类验证码" required>
                <el-input v-model="loginInfo.verifyCode" placeholder="请输入右侧的验证码" @keyup.enter.native="doLogin"></el-input>
                <img :src="captchaPath" @click="updateVerifyCode" class="captcha-code">
              </el-form-item>
              <el-form-item class="login-button">
                <el-button type="primary" @click="doLogin" size="small" >登录</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>

      </div>
    </div>
    <!-- 底部内容-->
  </div>
</template>
<script>
  import {doLogin,success_code} from '@/api/api'
export default {
  data() {
    return {
      liugeUser: {
        userName: '',
        password: ''
      },
      loginInfo: {
        verifyCode: '',
        captcha_key: ''
      },
      captchaPath: '',
    }
  },
  methods: {
    toastError(msg){
      this.$message({
        message:msg,
        center:true,
        type:'error'
      })
    },
    doLogin() {
      // 发起登录

      // 检查数据
      if (this.liugeUser.userName === '') {
        this.toastError("账号不可以为空")
        return;
      }
      if (this.liugeUser.password === '') {
        this.toastError("密码不可以为空")
        return;
      }
      if (this.loginInfo.verifyCode === '') {
        this.toastError("验证码不可以为空")
        return;
      }
      // 向服务器提交数据
      doLogin(this.loginInfo.verifyCode,this.loginInfo.captcha_key,this.liugeUser).then(response => {
        // 处理登录结果
        // 判断状态

        if(response.code === success_code){
          // 如果成功
          // 成功则跳转 --> 判断角色 普通用户到门户首页 管理员到管理中心
          this.$message({
            message:response.message,
            center:true,
            type:'success'
          })
          this.$router.push('/');
        }else{
          // 更新一下人类验证码
          this.updateVerifyCode();
          this.toastError(response.message)
        }

      });
    },
    updateVerifyCode() {
      this.captchaPath = "/user/captcha?captcha_key=" + this.loginInfo.captcha_key + "&random="
          + Date.parse(new Date());
    }
  },
  mounted() {
    //TODO:检查登录是否有效
    // 如果已经登录，跳转到对应页面
    this.loginInfo.captcha_key = Date.parse(new Date());
    this.updateVerifyCode();
  }
}
</script>
<style>

.captcha-code {
  cursor: pointer;
  width: 120px;
  margin-left: 10px;
  border: solid 1px #E6E6E6;
  vertical-align: middle;
  padding-left: 10px;
  padding-right: 10px;
  height: 42px;
}

.login-button {
  margin-bottom: 0;
}

.admin-login-header-box {
  width: 100%;
  height: 46px;
  margin-bottom: 20px;
  background: dodgerblue;
}

.center {
  margin: 0 auto;
  width: 1140px;
}

.admin-login-header-center {
  line-height: 46px;

}

.login-center-box .el-input {
  width: 200px;
}

.login-center-box {
  padding: 20px;
  border-radius: 4px;
  width: 1100px;
  background: #ffffff;
  box-shadow: 0 1px 10px #afafaf;
}

.admin-login-logo {
  color: #fff;
  font-size: 18px;
  font-weight: 600;
}

.login-center-box .el-input__inner {
  border: #E6E6E6 solid 1px;
  border-radius: 0;
  height: 42px;
}

.login-center-box .el-form-item__label {
  background: #FBFBFB;
  border-left: #E6E6E6 solid 1px;
  border-top: #E6E6E6 solid 1px;
  border-bottom: #E6E6E6 solid 1px;
  text-align: center;
}
</style>