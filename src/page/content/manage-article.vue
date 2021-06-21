<template>
  <div class="article-list-box">
    <div class="article-action-bar">
      <!-- 发表文章、搜索-->
      <el-form :inline="true" size="medium">
        <el-form-item>
          <el-input v-model="search.keyword" placeholder="请输入关键字"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="search.state" placeholder="请选择状态">
            <el-option label="已删除" value="0"></el-option>
            <el-option label="已发布" value="1"></el-option>
            <el-option label="草稿" value="2"></el-option>
            <el-option label="置顶" value="3"></el-option>
            <el-option label="所有状态" value=""></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="search.categoryId" placeholder="请选择文章分类">
            <el-option
                v-for="item in categories"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="doArticleSearch">查询</el-button>
          <el-button type="danger" @click="cleanSearch">清除</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="article-list-part">
      <el-table
          v-loading="loading"
          :data="articles"
          style="width: 100%">
        <el-table-column
            fixed
            prop="id"
            label="ID"
            width="150">
        </el-table-column>
        <el-table-column
            prop="title"
            label="标题"
            width="210">
        </el-table-column>
        <el-table-column
            prop="viewCount"
            label="浏览量"
            width="70">
        </el-table-column>
        <el-table-column
            label="状态"
            width="80">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.state === '0'" size="mini">已删除</el-tag>
            <el-tag type="primary" v-if="scope.row.state === '1'" size="mini">已 发 布</el-tag>
            <el-tag type="info" v-if="scope.row.state === '2'" size="mini">草 稿</el-tag>
            <el-tag type="success" v-if="scope.row.state === '3'" size="mini">置 顶</el-tag>
          </template>
        </el-table-column>
        <el-table-column
            prop="summary"
            label="摘要">
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
            width="300">
          <template slot-scope="scope">
            <el-button type="primary" round @click="edit(scope.row)">编辑</el-button>
            <el-button type="danger" round  @click="deleteItem(scope.row)">删除</el-button>
            <el-button type="success" v-if="scope.row.state === '3'" round @click="top(scope.row)">取消置顶</el-button>
            <el-button type="success" v-else round @click="top(scope.row)">置顶</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="article-page-navigation margin-bottom-20">
      <el-pagination
          class="article-list-page-navigation-bar"
          @current-change="onPageChange"
          :page-size="pageNavigation.pageSize"
          layout="prev, pager, next"
          :current-page="pageNavigation.currentPage"
          :total="pageNavigation.totalCount">
      </el-pagination>
    </div>
    <div class="article-dialog-part">
      <el-dialog
          title="删除提示"
          :visible.sync="deleteDialogShow"
          width="500px">
        <span>你确定要删除: {{ deleteMessage }} 这篇文章吗？</span>
        <span slot="footer" class="dialog-footer">
          <el-button round type="primary" @click="doPretendDelete">假装删除</el-button>
          <el-button round type="danger" @click="doDeleteItem()">绝对删除</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import * as dateUtils from "@/utils/date";
import * as api from "@/api/api";

export default {
  data() {
    return {
      loading: false,
      deleteMessage:'',
      articles: [],
      deleteDialogShow:false,
      search: {
        keyword: '',
        state: '',
        categoryId: ''
      },
      categories: [],
      pageNavigation: {
        currentPage: 1,
        totalCount: 0,
        pageSize: 10
      },
      targetDeleteArticleId:''
    }
  },
  methods: {
    edit(item){
      let articleId = item.id;
      this.$router.push({
        path:'/content/post-article',
        query:{
          articleId
        }
      })
    },
    // 假装删除
    doPretendDelete(){
      api.deleteArticlePre(this.targetDeleteArticleId).then(result => {
        if(result.code === api.success_code){
          this.$message.success(result.message);
          this.deleteDialogShow = false;
          this.listArticles();
        }else{
          this.$message.error(result.message);
        }
      });
    },
    // 绝对删除
    doDeleteItem(){
      api.deleteArticleAbs(this.targetDeleteArticleId).then(result => {
        if(result.code === api.success_code){
          this.$message.success(result.message);
          this.deleteDialogShow = false;
          this.listArticles();
        }else{
          this.$message.error(result.message);
        }
      });
    },
    deleteItem(item){
      this.deleteMessage = item.title;
      this.deleteDialogShow = true;
      this.targetDeleteArticleId = item.id;
    },
    top(item){
      api.topArticle(item.id).then(result => {
        if(result.code === api.success_code){
          this.$message.success(result.message);
          this.listArticles();
        }else{
          this.$message.error(result.message);
        }
      });
    },
    onPageChange(page) {
      this.pageNavigation.currentPage = page;
      this.listArticles();
    },
    cleanSearch() {
      this.search.categoryId = '';
      this.search.state = '';
      this.search.keyword = '';
      this.listArticles();
    },
    doArticleSearch() {
      this.listArticles();
    },
    formatDate(dateStr) {
      let date = new Date(dateStr);
      return dateUtils.formatDate(date, 'yyyy-MM-dd hh:mm:ss');
    },
    listArticles() {
      this.loading = true;
      api.listArticles(this.pageNavigation.currentPage, this.pageNavigation.pageSize, this.search.state, this.search.keyword, this.search.categoryId).then(result => {
        if (result.code === api.success_code) {
          this.articles = result.data.contents;
          this.pageNavigation.currentPage = result.data.currentPage;
          this.pageNavigation.totalCount = result.data.totalCount;
          this.pageNavigation.pageSize = result.data.pageSize;
          this.loading = false;
        }
      });
    },
    listCategories() {
      api.listCategories().then(result => {
        if (result.code === api.success_code) {
          result.data.forEach(item => {
            if (item.status !== '0') {
              this.categories.push(item);
            }
          });
          this.categories.push({
            id: '',
            name: '所有分类'
          })
        }
      });
    },
  },
  mounted() {
    this.listArticles();
    this.listCategories();
  }
}
</script>
<style>
.article-list-box{
  padding:10px;
}
</style>
