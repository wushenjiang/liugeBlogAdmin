<template>
  <div class="user-list-box">
    <!-- 搜索部分 -->
    <div class="user-search-box">
      <el-form :inline="true" size="medium">
        <el-form-item label="用户名">
          <el-input v-model="search.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="邮箱地址">
          <el-input v-model="search.email" placeholder="请输入邮箱地址"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="doSearch">查 询</el-button>
          <el-button type="danger" @click="cleanSearch">清 空</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 显示内容-->
    <div class="list-box margin-bottom-20">
      <el-table
          v-loading="loading"
          :data="userList"
          style="width: 100%">
        <el-table-column
            fixed
            prop="id"
            label="ID"
            width="100">
        </el-table-column>
        <el-table-column
            prop="userName"
            label="用户名"
            width="120">
        </el-table-column>
        <el-table-column
            prop="email"
            label="用户邮箱"
            width="100">
        </el-table-column>
        <el-table-column
            label="头像"
            width="80">
          <template slot-scope="scope">
            <el-avatar size="medium" :src="scope.row.avatar"></el-avatar>
          </template>
        </el-table-column>
        <el-table-column
            label="签名"
            width="200">
          <template slot-scope="scope">
            <div v-if="scope.row.sign === null">
              <span>这个人很懒，什么也没有说</span>
            </div>
            <div>
              <span v-text="scope.row.sign"></span>
            </div>
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
            label="状态"
            width="70">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.state === '0'" size="mini">已删除</el-tag>
            <el-tag type="success" v-if="scope.row.state === '1'" size="mini">正 常</el-tag>
          </template>
        </el-table-column>
        <el-table-column
            fixed="right"
            label="操作"
            width="200">
          <template slot-scope="scope">
            <el-button type="primary" round size="mini" @click="resetPassword(scope.row)">重置密码</el-button>
            <el-button type="danger" round size="mini" @click="deleteItem(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-navigation-box clear-fix">
      <el-pagination
          class="user-list-page-navigation-bar"
          @current-change="onPageChange"
          :page-size="pageNavigation.pageSize"
          layout="prev, pager, next"
          :current-page="pageNavigation.currentPage"
          :total="pageNavigation.totalCount">
      </el-pagination>
    </div>
    <div class="user-list-dialog-box">
      <el-dialog
          title="删除提示"
          :visible.sync="deleteDialogShow"
          width="400px">
        <span>你确定要删除: {{ deleteUserName }} 这个用户吗？</span>
        <span slot="footer" class="dialog-footer">
          <el-button round type="primary" @click="deleteDialogShow = false">取 消</el-button>
          <el-button round type="danger" @click="doDeleteItem()">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
          title="密码重置"
          :visible.sync="resetPasswordDialogShow"
          width="400px">
        <div class="reset-password-box">
          <div class="reset-tips-text">修改{{'"' + targetResetUsername + '"'}}密码</div>
          <el-form label-width="70px" size="medium">
            <el-form-item label="新密码" prop="pass">
              <el-input type="password" v-model="resetPasswordValue" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button round type="primary" @click="resetPasswordDialogShow = false">取 消</el-button>
          <el-button round type="danger" @click="doResetPassword()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import * as api from '@/api/api'
import * as dateUtils from "@/utils/date";
import {hex_md5} from "@/utils/md5";
export default {
  data() {
    return {
      search: {
        username: '',
        email: ''
      },
      userList: [],
      loading: false,
      pageNavigation: {
        currentPage: 1,
        totalCount: 0,
        pageSize: 10
      },
      deleteDialogShow: false,
      deleteUserName: '',
      targetDeleteUserId: '',
      resetPasswordDialogShow: false,
      resetPasswordValue:'',
      targetResetUsername:'',
      targetResetUserId:''
    }
  },
  methods: {
    doResetPassword() {
      // 检查密码不为空
      if(this.resetPasswordValue === ''){
        return;
      }
      api.resetPassword(this.targetResetUserId,hex_md5(this.resetPasswordValue)).then(result => {
        if(result.code === api.success_code){
         this.$message.success(result.message);
         this.resetPasswordDialogShow = true;
        }else{
          this.$message.error(result.message);
        }
      });
    },
    doDeleteItem() {
      // 去删除用户
      api.deleteUserById(this.targetDeleteUserId).then(result => {
        if (result.code === api.success_code) {
          this.deleteDialogShow = false;
          this.$message.success(result.message);
          this.listUsers();
        } else {
          this.$message.error(result.message);
        }
      });
    },
    onPageChange(page) {
      this.pageNavigation.currentPage = page;
      this.listUsers();
    },
    doSearch() {
      api.doUserSearch(this.search.username, this.search.email).then(result => {
        this.handleUserListResult(result);
      });
    },
    cleanSearch() {
      this.search.username = '';
      this.search.email = '';
      this.listUsers();
    },
    deleteItem(item) {
      this.targetDeleteUserId = item.id;
      this.deleteUserName = item.userName;
      this.deleteDialogShow = true;
      // 处理结果
    },
    resetPassword(item) {
      this.resetPasswordDialogShow = true;
      this.targetResetUsername = item.userName;
      this.targetResetUserId = item.id;
    },
    listUsers() {
      api.listUsers(this.pageNavigation.currentPage, this.pageNavigation.pageSize).then(result => {
        this.handleUserListResult(result);
      });
      this.loading = true;

    },
    handleUserListResult(result) {
      if (result.code === api.success_code) {
        this.userList = result.data.content;
        this.pageNavigation.currentPage = result.data.number + 1;
        this.pageNavigation.totalCount = result.data.totalElements;
        this.pageNavigation.pageSize = result.data.size;
      } else {
        this.$message.error(result.message);
      }
      this.loading = false;
    },
    formatDate(dateStr) {
      let date = new Date(dateStr);
      return dateUtils.formatDate(date, 'yyyy-MM-dd hh:mm:ss');
    }
  },
  mounted() {
    this.listUsers();
  }
}
</script>
<style>
.user-list-box{
  padding: 20px;
}
.reset-tips-text{
  margin-left: 15px;
  margin-bottom: 20px;
  font-size: 16px;
  font-weight: 600;
}
.user-list-page-navigation-bar {
  margin-right: 50px;
  float: right;
}
</style>
