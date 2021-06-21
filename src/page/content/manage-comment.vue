<template>
  <div class="comment-box">
    <!-- 列表内容 -->
    <div class="comment-list-box margin-bottom-20">
      <el-table
          v-loading="loading"
          :data="comments"
          style="width: 100%">
        <el-table-column
            fixed
            prop="id"
            label="ID"
            width="150">
        </el-table-column>
        <el-table-column
            label="评论内容">
          <template slot-scope="scope">
            <a href="#">{{scope.row.content}}</a>
          </template>
        </el-table-column>
        <el-table-column
            label="用户"
            width="200">
          <template slot-scope="scope">
            <a href="#" class="comment-user-avatar clear-fix">
              <el-avatar :src="scope.row.userAvatar"></el-avatar>
              <span class="comment-user-name">{{scope.row.userName}}</span>
            </a>
          </template>
        </el-table-column>
        <el-table-column
            label="状态"
            width="80">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.state === '0'" size="mini">已删除</el-tag>
            <el-tag type="primary" v-if="scope.row.state === '1'" size="mini">正常</el-tag>
            <el-tag type="success" v-if="scope.row.state === '3'" size="mini">置顶</el-tag>
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
            width="250">
          <template slot-scope="scope">
            <el-button type="danger" round @click="deleteItem(scope.row)">删除</el-button>
            <el-button type="success" v-if="scope.row.state === '3'" round @click="top(scope.row)">取消置顶</el-button>
            <el-button type="success" v-else round @click="top(scope.row)">置顶</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="comment-page-navigation">
      <el-pagination
          class="comment-page-navigation-bar"
          @current-change="onPageChange"
          :page-size="pageNavigation.pageSize"
          layout="prev, pager, next"
          :current-page="pageNavigation.currentPage"
          :total="pageNavigation.totalCount">
      </el-pagination>
    </div>
    <!-- dialog-->
    <div class="comment-dialog-box">
      <el-dialog
          title="删除提示"
          :visible.sync="deleteDialogShow"
          width="500px">
        <span>你确定要删除: {{ deleteMessage }} 这条评论吗？</span>
        <span slot="footer" class="dialog-footer">
          <el-button round type="primary" @click="deleteDialogShow = false">取消</el-button>
          <el-button round type="danger" @click="doDeleteItem()">删 除</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import * as api from '@/api/api';
import * as dateUtils from "@/utils/date";
export default {
  data(){
    return{
      deleteMessage:'',
      loading:false,
      comments:[],
      pageNavigation: {
        currentPage: 1,
        totalCount: 0,
        pageSize: 10
      },
      deleteDialogShow:false,
      targetDeleteId:''
    }
  },
  methods:{
    top(item){
      api.topComment(item.id).then(result => {
        if(result.code === api.success_code){
          this.$message.success(result.message);
          this.listComments();
        }else{
          this.$message.error(result.message);
        }
      })
    },
    doDeleteItem(){
      api.deleteCommentById(this.targetDeleteId).then(result => {
        if(result.code === api.success_code){
          // 处理结果
          this.listComments();
          this.$message.success(result.message);
          this.deleteDialogShow = false;
        }else{
          this.$message.error(result.message);
        }
      })
    },
    deleteItem(item){
      this.deleteMessage = item.content;
      // 处理显示数据
      this.targetDeleteId = item.id;
      // 显示删除提示框
      this.deleteDialogShow = true;
    },
    onPageChange(page){
      this.pageNavigation.currentPage = page;
      this.listComments();
    },
    listComments(){
      this.loading = true;
      api.listComments(this.pageNavigation.currentPage,this.pageNavigation.pageSize).then(result => {
        if(result.code === api.success_code){
          this.comments = result.data.content;
          this.pageNavigation.currentPage = result.data.number + 1;
          this.pageNavigation.totalCount = result.data.totalElements;
          this.pageNavigation.pageSize = result.data.size;
        }
        this.loading = false;
      });

    },
    formatDate(dateStr) {
      let date = new Date(dateStr);
      return dateUtils.formatDate(date, 'yyyy-MM-dd hh:mm:ss');
    }
  },
  mounted() {
    this.listComments();
  }

}
</script>
<style>
.comment-user-name{
  margin-left: 10px;
  font-weight: 600;
  color: #222222;
}
.comment-user-avatar{
  display: block;
}
.comment-user-avatar img{
  vertical-align: middle;
}
.comment-user-avatar span{
  display: block;
  line-height: 40px;
  float: left;
}
.comment-box{
  padding:20px;
}
</style>
