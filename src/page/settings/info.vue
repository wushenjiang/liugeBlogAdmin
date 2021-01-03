<template>
  <div class="settings-user-info-box">
    <div class="user-info-list-part">
      <el-form label-width="100px" v-if="userInfo !== null" size="medium">
        <el-form-item label="用户ID">
          <el-input type="text" v-model="userInfo.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱地址">
          <el-input type="email" v-model="userInfo.email" disabled></el-input>
          <el-button type="primary" class="update-email-btn" @click="toUpdateEmailPage">修改邮箱</el-button>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input type="text" v-model="userInfo.userName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="签名">
          <el-input type="text" v-model="userInfo.sign" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="头像" class="user-info-avatar">
          <div class="user-avatar-container" @click="showAvatarDialog">
            <el-avatar :src="userInfo.avatar"></el-avatar>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="updateUserInfo">修改用户信息</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="user-info-dialog">
      <avatar-upload field="file"
                     @crop-upload-success="cropUploadSuccess"
                     @crop-upload-fail="cropUploadFail"
                     v-model="showAvatarCutter"
                     :width="300"
                     :height="300"
                     url="/admin/image/avatar"
                     img-format="png"></avatar-upload>
    </div>
  </div>
</template>
<script>
import * as api from '@/api/api';
import avatarUpload from 'vue-image-crop-upload';

export default {
  components: {
    'avatar-upload': avatarUpload
  },

  data() {
    return {
      lastUserName: '',
      userInfo: null,
      showAvatarCutter: false
    }
  },
  methods: {
    showAvatarDialog() {
      this.showAvatarCutter = true;
    },
    cropUploadSuccess(response) {
      // this.showAvatarCutter = false;
      if (response.code === api.success_code) {
        this.$message.success(response.message);
        this.userInfo.avatar = this.blog_constant.baseUrl + '/portal/image/' + response.data.path;
      } else {
        this.$message.error(response.message);
      }
    },
    cropUploadFail() {
      this.$message.error('头像上传失败!');
    },
    toUpdateEmailPage() {
      this.$router.push({
        path: '/settings/email'
      })
    },
    updateUserInfo() {
      if (this.userInfo.userName === '') {
        this.$message.error('用户名不能为空.');
        return;
      }
      // 检查数据
      // 检查用户名是否重复
      if (this.lastUserName === this.userInfo.userName) {
        this.doUpdateInfo();
      } else {
        api.checkUserName(this.userInfo.userName).then(result => {
          if (result.code === api.fail_code) {
            this.doUpdateInfo();
          } else {
            this.$message.error(result.message);
          }
        });
      }
    },
    doUpdateInfo() {
      // 头像不可以为空
      if (this.userInfo.avatar === '') {
        this.$message.error('头像不可以为空');
        return;
      }
      api.updateUserInfo(this.userInfo, this.userInfo.id).then(result => {
        if (result.code === api.success_code) {
          this.getUserInfo();
          this.$message.success(result.message);
        } else {
          this.$message.error(result.message);
        }
      })
    },
    getUserInfo() {
      api.checkToken().then(result => {
        if (result.code === api.success_code) {
          this.userInfo = result.data;
          this.lastUserName = this.userInfo.userName;
        } else {
          this.$message.error(result.message);
        }
      })
    }
  },
  mounted() {
    this.getUserInfo();
  }
}
</script>
<style>
.user-avatar-container {
  width: 100px;
  cursor: pointer;
}

.user-info-avatar {
  display: inline-block;
}

.update-email-btn {
  margin-left: 20px;
}

.settings-user-info-box .el-input {
  width: 250px;
}
</style>
