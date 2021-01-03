<template>
  <div class="settings-friend-link-box">
    <div class="friend-link-action-bar">
      <el-button type="primary" size="medium" @click="showFriendLinkDialog">添加友情链接</el-button>
    </div>
    <div class="friend-link-list-box">
      <el-table
          v-loading="loading"
          :data="links"
          style="width: 100%">
        <el-table-column
            prop="id"
            label="ID"
            width="150">
        </el-table-column>
        <el-table-column
            width="150"
            label="对方网站名称">
          <template slot-scope="scope">
            <a class="friend-link-title" :href="scope.row.url" target="_blank">{{ scope.row.name }}</a>
          </template>
        </el-table-column>
        <el-table-column
            label="logo"
            width="80">
          <template slot-scope="scope">
            <el-image fit="scale-down" class="loop-image" :src="scope.row.logo" width="80px" height="80px"></el-image>
          </template>
        </el-table-column>
        <el-table-column
            prop="order"
            label="顺序"
            width="50">
        </el-table-column>
        <el-table-column
            label="状态"
            width="100">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.state === '0'" size="mini">不可用</el-tag>
            <el-tag type="success" v-if="scope.row.state === '1'" size="mini">正 常</el-tag>
          </template>
        </el-table-column>
        <el-table-column
            label="创建日期"
            width="200">
          <template slot-scope="scope">
            <span v-text="formatDate(scope.row.createTime)"></span>
          </template>
        </el-table-column>
        <el-table-column
            class="category-update-time"
            label="更新日期"
            width="200">
          <template slot-scope="scope">
            <span v-text="formatDate(scope.row.updateTime)"></span>
          </template>
        </el-table-column>
        <el-table-column
            fixed="right"
            label="操作"
            width="200">
          <template slot-scope="scope">
            <el-button type="primary" round @click="edit(scope.row)">编辑</el-button>
            <el-button type="danger" round @click="deleteItem(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="friend-link-dialog-box">
      <el-dialog
          :title="friendLinkEditTitle"
          :visible.sync="friendLinkDialogShow"
          :close-on-press-escape="false"
          :close-on-click-modal="false"
          width="600px">
        <div>
          <el-form label-width="110px" size="medium">
            <el-form-item label="对方网站名称">
              <el-input v-model="link.name"></el-input>
            </el-form-item>
            <el-form-item label="跳转链接">
              <el-input v-model="link.url"></el-input>
            </el-form-item>
            <el-form-item label="顺序">
              <el-input-number v-model="link.order" :min="1" :max="100"></el-input-number>
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="link.state" placeholder="请选择状态">
                <el-option label="正常" value="1"></el-option>
                <el-option label="不可用" value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="logo">
              <div class="friend-link-image-upload" @click="showLinkLogoDialog">
                <i class="el-icon-plus" v-if="link.logo === ''"></i>
                <el-image v-else :src=" link.logo"></el-image>
              </div>
            </el-form-item>

          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editClose()" type="danger" size="medium">取 消</el-button>
          <el-button type="primary" @click="handleFriendLinkEditCommit"
                     size="medium">{{ friendLinkEditDialogCommitText }}</el-button>
        </span>
      </el-dialog>
      <avatar-upload field="file"
                     @crop-upload-success="cropUploadSuccess"
                     @crop-upload-fail="cropUploadFail"
                     v-model="showLinkCutter"
                     :width="100"
                     :height="100"
                     url="/admin/image/link"
                     img-format="png"></avatar-upload>
    </div>
  </div>
</template>
<script>
import * as api from '@/api/api';
import * as dateUtils from "@/utils/date";
import avatarUpload from 'vue-image-crop-upload';

export default {
  components: {
    'avatar-upload': avatarUpload
  },
  data() {
    return {
      showLinkCutter: false,
      friendLinkEditDialogCommitText: '添加',
      friendLinkEditTitle: '添加友情链接',
      friendLinkDialogShow: false,
      links: [],
      link: {
        id:'',
        name: '',
        logo: '',
        order: 0,
        state: '1',
        url: ''
      },
      loading: false,
    }
  },
  methods: {
    edit(item){
      this.friendLinkEditDialogCommitText = '更 新';
      this.friendLinkEditTitle = '更新友情链接';
      // 回显数据
      this.link.id = item.id;
      this.link.name = item.name;
      this.link.logo = item.logo;
      this.link.order = item.order;
      this.link.state = item.state;
      this.link.url = item.url;
      // 弹窗
      this.friendLinkDialogShow = true;

    },
    showLinkLogoDialog() {
      this.showLinkCutter = true;
    },
    cropUploadFail() {
      this.$message.error('logo上传失败!');
    },
    cropUploadSuccess(response) {
      if (response.code === api.success_code) {
        this.$message.success(response.message);
        this.link.logo = this.blog_constant.baseUrl + '/portal/image/' + response.data.path;
      } else {
        this.$message.error(response.message);
      }
    },
    handleFriendLinkEditCommit() {
      // 添加
      // 检查内容
      if (this.link.name === '') {
        this.$message.error('友情链接名称不能为空');
        return;
      }
      if (this.link.url === '') {
        this.$message.error('跳转链接不能为空');
        return;
      }
      if (this.link.logo === '') {
        this.$message.error('logo不能为空');
        return;
      }
      // 判断是更新还是添加
      // 如果有ID的是更新
      if(this.link.id !== ''){
        // 更新
        api.updateFriendLink(this.link,this.link.id).then(result => {
          if (result.code === api.success_code) {
            this.friendLinkDialogShow = false;
            this.$message.success(result.message);
            this.listLinks();
            // 重置内容
            this.resetLink();
          } else {
            this.$message.error(result.message);
          }
        });
      }else{
        api.postFriendLink(this.link).then(result => {
          if (result.code === api.success_code) {
            this.friendLinkDialogShow = false;
            this.$message.success(result.message);
            this.listLinks();
            // 重置内容
            this.resetLink();
          } else {
            this.$message.error(result.message);
          }
        });
      }
      // 提交数据

    },
    resetLink() {
      this.link.id = '';
      this.link.name = '';
      this.link.url = '';
      this.link.logo = '';
      this.link.order = 1;
      this.link.state = '1';
    },
    editClose() {
      this.friendLinkDialogShow = false;
    },
    showFriendLinkDialog() {
      this.resetLink();
      this.friendLinkEditDialogCommitText = '添 加';
      this.friendLinkEditTitle = '添加友情链接';
      this.friendLinkDialogShow = true;
    },
    listLinks() {
      api.listFriendLinks().then(result => {
        // console.log(result);
        if (result.code === api.success_code) {
          this.links = result.data;
        }
      });
    },
    formatDate(dateStr) {
      let date = new Date(dateStr);
      return dateUtils.formatDate(date, 'yyyy-MM-dd hh:mm:ss');
    }
  },
  mounted() {
    this.listLinks();
  }
}
</script>
<style>
.friend-link-image-upload {
  width: 100px;
  height: 37px;
  border: #dfdfdf solid 1px;
  text-align: center;
  cursor: pointer;
}

.friend-link-title {
  text-decoration: none;
}
</style>
