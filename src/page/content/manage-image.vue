<template>
  <div class="image-manager-box">
    <!-- 列表 -->
    <div class="image-list-box margin-bottom-20">
      <el-table
          v-loading="loading"
          :data="images"
          style="width: 100%">
        <el-table-column
            fixed
            prop="id"
            label="ID">
        </el-table-column>
        <el-table-column
            fixed
            prop="contentType"
            label="类型">
        </el-table-column>
        <el-table-column
            label="图片"
            width="200">
          <template slot-scope="scope">
            <el-image fit="cover" class="image-manager-item"
                      :src="scope.row.url"></el-image>
          </template>
        </el-table-column>
        <el-table-column
            label="状态"
            width="100">
          <template slot-scope="scope">
            <el-tag type="primary" v-if="scope.row.state === '1'" size="mini">正常</el-tag>
            <el-tag type="success" v-if="scope.row.state === '0'" size="mini">删除</el-tag>
          </template>
        </el-table-column>
        <el-table-column
            label="种类"
            width="80">
          <template slot-scope="scope">
            <el-tag type="primary" v-if="scope.row.original === 'loop'" size="mini">轮播图</el-tag>
            <el-tag type="success" v-if="scope.row.original === 'article'" size="mini">文章</el-tag>
            <el-tag type="default" v-if="scope.row.original === 'link'" size="mini">友情链接</el-tag>
            <el-tag type="info" v-if="scope.row.original === 'avatar'" size="mini">头像</el-tag>
          </template>
        </el-table-column>
        <el-table-column
            label="创建日期"
            width="160">
          <template slot-scope="scope">
            <span v-text="formatDate(scope.row.createTime)"></span>
          </template>
        </el-table-column>
        <el-table-column
            class="category-update-time"
            label="更新日期"
            width="160">
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
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="image-list-page-navigation margin-bottom-20">
      <el-pagination
          class="comment-page-navigation-bar"
          @current-change="onPageChange"
          :page-size="pageNavigation.pageSize"
          layout="prev, pager, next"
          :current-page="pageNavigation.currentPage"
          :total="pageNavigation.totalCount">
      </el-pagination>
    </div>
    <!-- dialog -->
    <div class="image-list-dialog">
      <el-dialog
          title="删除提示"
          :visible.sync="deleteDialogShow"
          width="500px">
        <span>你确定要删除这张图片吗？</span>
        <span slot="footer" class="dialog-footer">
          <el-button round type="primary" @click="deleteDialogShow = false">取消</el-button>
          <el-button round type="danger" @click="doDeleteItem()">删 除</el-button>
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
      images: [],
      loading: false,
      pageNavigation: {
        currentPage: 1,
        totalCount: 0,
        pageSize: 10
      },
      deleteDialogShow: false,
      targetDeleteId: ''
    }
  },
  methods: {
    listImages() {
      this.loading = true;
      api.listImages(this.pageNavigation.currentPage, this.pageNavigation.pageSize, '').then(result => {
        if (result.code === api.success_code) {
          this.images = result.data.content;
          this.pageNavigation.currentPage = result.data.number + 1;
          this.pageNavigation.totalCount = result.data.totalElements;
          this.pageNavigation.pageSize = result.data.size;
        }
        this.loading = false;
      })
    },
    doDeleteItem() {
      this.deleteDialogShow = false;
      api.deleteImageById(this.targetDeleteId).then(result => {
        if (result.code === api.success_code) {
          this.$message.success(result.message);
          this.listImages();
        } else {
          this.$message.error(result.message);
        }
      });
    },
    deleteItem(item) {
      this.targetDeleteId = item.id;
      this.deleteDialogShow = true;
    },
    onPageChange(page) {
      this.pageNavigation.currentPage = page;
      this.listImages();
    },
    formatDate(dateStr) {
      let date = new Date(dateStr);
      return dateUtils.formatDate(date, 'yyyy-MM-dd hh:mm:ss');
    }
  },
  mounted() {
    this.listImages();
  }
}
</script>
<style>
.image-manager-item img {
  width: 120px;
  height: 90px;
}
.image-manager-box{
  padding: 10px;
}
</style>
