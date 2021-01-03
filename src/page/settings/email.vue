<template>
  <div class="settings-email-box">
    <el-form label-width="100px" size="medium">
      <el-form-item required
          label="新邮箱地址">
        <el-input v-model="newEmail"></el-input>
        <el-button type="primary" v-if="!isCountDown" @click="getVerifyCode" class="email-get-verify-code">获取验证码</el-button>
        <el-button type="primary" v-else @click="getVerifyCode" class="email-get-verify-code" disabled>
          {{ countDownText }}
        </el-button>
      </el-form-item>
      <el-form-item required
          label="验证码">
        <el-input v-model="verifyCode"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="updateEmailAddress">修改邮箱</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import * as api from "@/api/api";

export default {
  data() {
    return {
      isCountDown: false,
      newEmail: '',
      verifyCode: '',
      countDownText: ''
    }
  },
  methods: {
    getVerifyCode() {
      // 校验邮箱格式是否正确
      let reg = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/
      if (!reg.test(this.newEmail)) {
        this.$message.error('邮箱格式错误.');
        return;
      }
      // this.$message.success('邮箱地址正确.');
      // 发起请求，获取验证码
      api.getVerifyCode(this.newEmail, 'update').then(result => {
        if (result.code === api.success_code) {
          this.startCountDown();
          this.$message.success(result.message);
        } else {
          this.$message.error(result.message);
        }
      })

    },
    startCountDown(){
      // 禁止按钮可以使用，并且开始倒计时
      let time = 60;
      let interval = setInterval( () => {
        // 执行倒计时
        time--;
        this.isCountDown = true;
        if (time <= 0) {
          this.isCountDown = false;
          clearInterval(interval);
        }
        // console.log('倒计时 ==>' + time);
        this.countDownText = '重新发送(' + time + ')';
      }, 1000);
    },
    updateEmailAddress() {
      // 内容校验
      if(this.newEmail === ''){
        this.$message.error('邮箱地址不能为空哦~');
        return;
      }
      if(this.verifyCode === ''){
        this.$message.error('验证码不能为空哦~');
        return;
      }
      api.updateEmailAddress(this.newEmail,this.verifyCode).then(result => {
        if(result.code === api.success_code){
          // 更新成功
          // 给出toast
          this.$message.success(result.message);
          // 重置表单
          this.verifyCode = '';
          this.newEmail = '';

        }else{
          // 提示出错信息
          this.verifyCode = '';
          this.$message.error(result.message);
          // 重置倒计时
        }
      });
    }
  }
}
</script>
<style>
.email-get-verify-code {
  margin-left: 20px;
}

.settings-email-box .el-input {
  max-width: 250px;
}
</style>
