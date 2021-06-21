<template>
  <div class="loop-box">
    <div class="loop-action-bar">
      <el-button type="primary" round size="medium" @click="showAddLoop">添加轮播图</el-button>
    </div>
    <div class="loop-list-box">
      <el-table
          v-loading="loading"
          :data="loops"
          style="width: 100%">
        <el-table-column
            fixed
            prop="id"
            label="ID"
            width="180">
        </el-table-column>
        <el-table-column
            label="标题">
          <template slot-scope="scope">
            <a class="loop-title" :href="scope.row.targetUrl" target="_blank">{{ scope.row.title }}</a>
          </template>
        </el-table-column>
        <el-table-column
            label="轮播图"
            width="200">
          <template slot-scope="scope">
            <el-image fit="scale-down" class="loop-image" :src="scope.row.imageUrl"
                      width="180px"
                      height="80px"></el-image>
          </template>
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
    <div class="loop-dialog-box">
      <el-dialog
          title="删除提示"
          :visible.sync="deleteDialogShow"
          width="400px">
        <span>你确定要删除: {{ deleteMessage }} 这个轮播图吗？</span>
        <span slot="footer" class="dialog-footer">
          <el-button round type="primary" @click="deleteDialogShow = false">取 消</el-button>
          <el-button round type="danger" @click="doDeleteItem()">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
          :title="loopEditTitle"
          :visible.sync="loopDialogShow"
          :close-on-press-escape="false" :close-on-click-modal="false"
          width="600px">
        <div>
          <el-form label-width="100px" size="medium">
            <el-form-item label="轮播图标题">
              <el-input v-model="loop.title"></el-input>
            </el-form-item>
            <el-form-item label="跳转链接">
              <el-input v-model="loop.targetUrl"></el-input>
            </el-form-item>
            <el-form-item label="顺序">
              <el-input-number v-model="loop.order" :min="1" :max="100"></el-input-number>
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="loop.state" placeholder="请选择状态">
                <el-option label="正常" value="1"></el-option>
                <el-option label="不可用" value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="封面">
              <el-upload
                  class="avatar-uploader"
                  action="/admin/image/loop"
                  :show-file-list="false"
                  :on-success="uploadSuccess"
                  :before-upload="beforeUpload">
                <el-image fit="scale-down" v-if="loop.imageUrl !== ''" :src="loop.imageUrl"
                          class="avatar"></el-image>
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>

          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editClose()" type="danger" size="medium">取 消</el-button>
          <el-button type="primary" @click="handleLoopEditCommit"
                     size="medium">{{ loopEditDialogCommitText }}</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import * as api from "@/api/api";
import * as dateUtils from "@/utils/date";

export default {
  data() {
    return {
      deleteMessage: '',
      deleteDialogShow: false,
      loopEditDialogCommitText: '添 加',
      loopDialogShow: false,
      loopEditTitle: '添加轮播图',
      loops: [],
      loading: false,
      loop: {
        id: '',
        order: 1,
        state: '1',
        title: '',
        targetUrl: '',
        imageUrl: ''
      },
      deleteLoopId: ''
    }
  },
  methods: {
    editClose() {
      this.loopDialogShow = false;
      this.resetLoop();
    },
    doDeleteItem() {
      // 通过ID来删除图片
      api.deleteLoop(this.deleteLoopId).then(result => {
        if (result.code === api.success_code) {
          this.deleteDialogShow = false;
          this.$message.success(result.message);
          this.listLoop();
        }
      })
    },
    handleLoopEditCommit() {
      // 添加记录
      // 检查数据
      if (this.loop.title === '') {
        this.$message.error("轮播图标题不能为空！");
        return;
      }
      if (this.loop.targetUrl === '') {
        this.$message.error("跳转链接不可以为空！");
        return;
      }
      if (!this.loop.targetUrl.startsWith("http://") && !this.loop.targetUrl.startsWith('https://')) {
        this.$message.error("目标链接格式错误！");
        return;
      }
      if (this.loop.imageUrl === '') {
        this.$message.error("轮播图不可以为空！");
        return;
      }
      // 判断是更新还是添加
      // 如果有id就是更新
      // 否则就是添加
      if (this.loop.id === '') {
        // 添加数据
        api.postLoop(this.loop).then(result => {
          this.loopDialogShow = false;
          if (result.code === api.success_code) {
            this.$message.success(result.message);
            // 清空表格
            this.resetLoop();
            // 更新列表
            this.listLoop();
          } else {
            this.$message.error(result.message);
          }
        })
      } else {
        //发起更新
        api.updateLoop(this.loop.id, this.loop).then(result => {
          if (result.code === api.success_code) {
            // 更新成功
            this.$message.success(result.message);
            this.loopDialogShow = false;
            this.listLoop();
            this.resetLoop();
          } else {
            this.$message.error(result.message);
          }
        })
      }

    },
    resetLoop() {
      this.loop.id = '';
      this.loop.title = '';
      this.loop.imageUrl = '';
      this.loop.targetUrl = '';
      this.loop.order = 1;
      this.loop.state = '1';
    },
    beforeUpload() {
      console.log("before upload ...");
    },
    uploadSuccess(response) {
      if (response.code === api.success_code) {
        // 上传成功
        // 回显图片
        //http://localhost:2020/portal/image/1602689715177_766081720289067008.png
        this.loop.imageUrl = response.data.path;
        this.$message.success(response.message);
      } else {
        this.$message.error(response.message);
      }
    },
    edit(item) {
      // 数据回显
      this.loopEditDialogCommitText = "修 改";
      this.loopEditTitle = '修改轮播图';
      this.loopDialogShow = true;
      this.loop = item;
    },
    deleteItem(item) {
      this.deleteDialogShow = true;
      this.deleteMessage = item.title;
      this.deleteLoopId = item.id;
    },
    showAddLoop() {
      this.loopDialogShow = true;
    },
    formatDate(dateStr) {
      let date = new Date(dateStr);
      return dateUtils.formatDate(date, 'yyyy-MM-dd hh:mm:ss');
    },
    listLoop() {
      this.loading = true;
      api.listLoop().then(result => {
        console.log(result);
        this.loading = false;
        if (result.code === api.success_code) {
          this.loops = result.data;
        }
      });
    }
  },
  mounted() {
    this.listLoop();
  }
}
</script>
<style>
.loop-box {
  padding: 20px;
}

.loop-title {
  text-decoration: none;
}

.loop-image {
  width: 180px;
  height: 80px;
  padding: 4px;
  border-radius: 4px;
  border: #EDEDED solid 1px;
}

.loop-dialog-box .avatar-uploader .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.loop-dialog-box .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.loop-dialog-box .avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.loop-dialog-box .el-upload img {
  width: 178px;
  height: 178px;
  border-radius: 4px;
}
</style>
