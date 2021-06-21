<template>
  <div class="article-post-box">
    <!-- 标题-->
    <div class="article-title-part margin-bottom-20">
      <el-input placeholder="文章标题（8~64个字符）" v-model="article.title" maxlength="64" min-length="8"
                show-word-limit></el-input>
    </div>
    <!-- 内容编辑-->
    <div class="article-post-part margin-bottom-20">
      <mavon-editor v-model="article.content" :boxShadow="false" @change="onContentChange" ref="mdEditor"
                    @onImageClick="onEditorImageClick"/>
    </div>
    <!-- 文章设置:分类、封面、标签-->
    <div class="article-post-settings-part">
      <el-form label-width="100px">
        <el-form-item label="文章分类" required>
          <el-select v-model="article.categoryId" placeholder="请选择分类" size="medium">
            <el-option
                v-for="item in categories"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="摘要" required>
          <el-input
              type="textarea"
              :rows="3"
              placeholder="文章摘要"
              v-model="article.summary">
          </el-input>
        </el-form-item>
        <el-form-item label="封面" required>
          <div class="article-cover-selector" @click="showImageSelector">
            <i class="el-icon-plus" v-if="article.cover === '' || article.cover === null"></i>
            <el-image v-else :src="article.cover" fit="cover"></el-image>
          </div>
        </el-form-item>
        <el-form-item label="标签" class="label-input-box" required>
          <el-tag
              :key="tag"
              v-for="tag in labels"
              closable
              :disable-transitions="false"
              @close="deleteLabel(tag)">
            {{ tag }}
          </el-tag>
          <el-input
              class="input-new-label"
              v-if="labelInputVisible"
              v-model="labelNewValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleLabelInputConfirm"
          >
          </el-input>
          <el-button v-if="!labelInputVisible && !isEnough" class="button-new-tag" size="small" @click="showLabelInput">
            + 添加标签
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 发布/草稿/预览的按钮-->
    <div class="article-post-action-bar clear-fix">
      <div class="action-btn-container ">
        <el-button plain size="medium" @click="preView">全屏预览</el-button>
        <el-button plain size="medium" @click="saveArticleDraft" v-if="!disabledDraftBtn">保存草稿</el-button>
        <el-button plain size="medium" @click="saveArticleDraft" v-else disabled>保存草稿</el-button>
        <el-button type="primary" size="medium" @click="commitArticle">{{ commitText }}</el-button>
      </div>
    </div>
    <div class="article-post-dialog-box clear-fix">
      <el-dialog class="image-picker-container"
                 title="图片选择"
                 :visible.sync="isImageSelectorShow"
                 width="600px">
        <div class="image-selector-box">
          <div class="image-action-bar">
            <el-upload
                class="image-selector-uploader"
                action="/admin/image/article"
                :show-file-list="false"
                :on-error="onUploadError"
                :on-success="uploadSuccess"
                accept="image/*">
              <el-button size="medium">上传图片</el-button>
            </el-upload>
          </div>
          <div class="image-selector-list">
            <el-radio-group v-model="selectedImageIndex">
              <el-radio-button v-for="(item,index) in images" :key="index" :label="index">
                <el-image fit="cover" :src="item.url"></el-image>
              </el-radio-button>
            </el-radio-group>
          </div>
          <div class="image-picker-navigation">
            <el-pagination
                class="user-list-page-navigation-bar"
                @current-change="onPageChange"
                :page-size="pageNavigation.pageSize"
                layout="prev, pager, next"
                :current-page="pageNavigation.currentPage"
                :total="pageNavigation.totalCount">
            </el-pagination>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
    <el-button @click="isImageSelectorShow = false" size="medium">取 消</el-button>
    <el-button type="primary" @click="onImageSelected" size="medium">确 定</el-button>
  </span>
      </el-dialog>
      <el-dialog
          title="确定要离开吗"
          :visible.sync="saveConfirmDialogShow"
          width="400px"
          center>
        <span>系统可能不会保存填写的稿件信息噢...┭┮﹏┭┮</span>
        <span slot="footer" class="dialog-footer">
          <el-button size="medium" @click="saveConfirmDialogShow = false">取 消</el-button>
          <el-button size="medium" type="primary" @click="toNextPage">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import * as api from '@/api/api';
import editor from '@/../lib/mavon-editor/mavon-editor';
import '@/../lib/mavon-editor/css/index.css';
import Vue from 'vue';

Vue.use(editor);
export default {
  data() {
    return {
      saveConfirmDialogShow: false,
      imageSelectorFor: 'article',
      pageNavigation: {
        currentPage: 1,
        totalCount: 0,
        pageSize: 15
      },
      selectedImageIndex: '',
      isImageSelectorShow: false,
      labelInputVisible: false,
      labelNewValue: '',
      categories: [],
      labels: [],
      isEnough: false,
      article: {
        id: '',
        title: '',
        content: '',
        categoryId: '',
        summary: '',
        cover: '',
        label: '',
        state: '1',
        type: '1',
        createTime: null
      },
      images: [],
      commitText: '发表文章',
      disabledDraftBtn: false,
      isContentSave:false,
      nextPath:'',
      hasContentChange:false
    }
  },
  watch:{
    article:{
      handler(){
        this.hasContentChange = true;
      },
      deep:true
    }
  },
  methods: {
    toNextPage(){
      this.hasContentChange = true;
      this.saveConfirmDialogShow = true;
      this.isContentSave = true;
      this.$router.push({
        path:this.nextPath
      })
    },
    preView() {
      this.$refs.mdEditor.toolbar_right_click('read');
    },
    saveArticleDraft() {
      // 检查标题
      if (this.article.title === '') {
        this.$message.error('文章标题不能为空!');
        return;
      }
      // 修改状态
      this.article.state = '2';
      // 提交数据
      api.saveArticleDraft(this.article).then(result => {
        if (result.code === api.success_code) {
          window.onbeforeunload = null;
          this.isContentSave = true;
          this.$message.success(result.message);
          this.$router.push({
            path: '/content/manage-article'
          })
        } else {
          this.$message.error(result.message);
        }
      })
    },
    commitArticle() {
      // 检查内容：标题、内容、分类、摘要、封面、标签
      if (this.article.title === '') {
        this.$message.error('文章标题不能为空!');
        return;
      }
      if (this.article.content === '') {
        this.$message.error('文章内容不能为空！');
        return;
      }
      if (this.article.categoryId === '') {
        this.$message.error('分类没有选择！');
        return;
      }
      if (this.article.summary === '') {
        this.$message.error('摘要不能为空！');
        return;
      }
      if (this.article.cover === '') {
        this.$message.error('请设置文章封面！');
        return;
      }
      // 标签
      if (this.labels.length === 0) {
        this.$message.error('请设置标签，方便检索分类');
        return;
      }
      // 处理标签
      let tempLabels = '';
      this.labels.forEach((item, index) => {
        tempLabels += item;
        if (index !== this.labels.length - 1) {
          tempLabels += '-';
        }
      });
      this.article.label = tempLabels;
      console.log('label ==> ' + this.article.label);
      // 到底是更新还是发布文章
      // 判断article的ID是否存在，有即更新，无则发布
      if (this.article.id === '') {
        // 提交数据
        api.postArticle(this.article).then(result => {
          if (result.code === api.success_code) {
            window.onbeforeunload = null;
            this.isContentSave = true;
            this.$message.success(result.message);
            this.$router.push({
              path: '/content/manage-article'
            })
          } else {
            this.$message.error(result.message);
          }
        });
      } else {
        if (this.article.state === '0' || this.article.state === '2') {
          this.article.state = '1';
        }
        // 更新文章
        api.updateArticle(this.article.id, this.article).then(result => {
          if (result.code === api.success_code) {
            window.onbeforeunload = null;
            this.isContentSave = true;
            this.$message.success(result.message);
            this.$router.push({
              path: '/content/manage-article'
            })
          } else {
            this.$message.error(result.message);
          }
        })
      }
    },
    onEditorImageClick() {
      // this.$message.success('编辑器图片点击了...');
      this.imageSelectorFor = 'article';
      this.isImageSelectorShow = true;
    },
    onPageChange(page) {
      this.pageNavigation.currentPage = page;
      this.listImages();
    },
    onUploadError() {
      this.$message.error('图片上传失败');
    },
    uploadSuccess(response) {
      if (response.code === api.success_code) {
        this.$message.success(response.message);
        // 更新列表
        this.listImages();
      }
    },
    onImageSelected() {
      // 判断当前的操作是给谁选择图片
      // 如果是文章，则插入到文章
      // 如果是封面则作为封面
      let item = this.images[this.selectedImageIndex];
      if (this.imageSelectorFor === 'article') {
        this.$refs.mdEditor.toolbar_left_addlink('no-link', item.name, item.url)
      } else if (this.imageSelectorFor === 'cover') {
        // 从数组里拿到当前选中的对象
        this.article.cover = item.url;
      }
      this.isImageSelectorShow = false;

    },
    showImageSelector() {
      // 显示图片选择器
      this.imageSelectorFor = 'cover';
      this.isImageSelectorShow = true;
    },
    onContentChange() {
    },
    showLabelInput() {
      // 判断个数、限制5个
      // 控制输入框的显示
      this.labelInputVisible = this.labels.length < 5;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      })
    },
    handleLabelInputConfirm() {
      // 回车的时候
      if (this.labels.length < 5) {
        this.labels.push(this.labelNewValue);
        this.labelNewValue = '';
      }
      // 如果加完之后数量是5那就隐藏输入框
      if (this.labels.length >= 5) {
        this.labelInputVisible = false;
        this.isEnough = true;
      }
    },
    deleteLabel(label) {
      // 从数组里删除
      this.labels.splice(this.labels.indexOf(label), 1);
      if (this.labels.length < 5) {
        this.isEnough = false;
        this.labelInputVisible = true;
      }
    },
    listCategories() {
      api.listCategories().then(result => {
        if (result.code === api.success_code) {
          result.data.forEach(item => {
            if (item.status !== '0') {
              this.categories.push(item);
            }
          });
        }
      });
    },
    listImages() {
      api.listImages(this.pageNavigation.currentPage, this.pageNavigation.pageSize, 'article').then(result => {
        if (result.code === api.success_code) {
          this.images = result.data.content;
          this.pageNavigation.currentPage = result.data.number + 1;
          this.pageNavigation.totalCount = result.data.totalElements;
          this.pageNavigation.pageSize = result.data.size;
        } else {
          this.$message.error(result.message);
        }
      });
    },
    getArticleDetail(articleId) {
      api.getArticleDetail(articleId).then(result => {
        if (result.code === api.success_code) {
          let remoteArticle = result.data;
          this.article.title = remoteArticle.title;
          this.article.content = remoteArticle.content;
          this.article.categoryId = remoteArticle.categoryId;
          this.article.summary = remoteArticle.summary;
          this.article.cover = remoteArticle.cover;
          this.article.label = remoteArticle.label;
          this.article.state = remoteArticle.state;
          this.article.type = remoteArticle.type;
          this.labels = remoteArticle.labels;
          this.article.createTime = remoteArticle.createTime;
          // 如果当前文章的状态是草稿，按钮显示发表文章
          // 如果是已经发布的：发布、置顶、删除，按钮显示更新
          if (this.article.state === '2') {
            this.commitText = '发布文章';
            this.disabledDraftBtn = false;
          } else {
            this.commitText = '更新文章';
            // 草稿这个按钮就不能用了
            this.disabledDraftBtn = true;
          }
        }
      })
    }
  },
  beforeDestroy() {
    console.log('beforeDestroy ....');
    window.onbeforeunload = null;
  },
  mounted() {
    window.onbeforeunload = function () {
      return '系统可能不会保存您的稿件内容哦~';
    }
    // 是否要获取文章详情
    let articleId = this.$route.query.articleId;
    if (articleId) {
      this.article.id = articleId;
      // 去获取文章详情
      this.getArticleDetail(articleId);
    }
    // 获取文章分类
    this.listCategories();

    this.listImages();
  },
  beforeRouteLeave(to, from, next) {
    if(this.isContentSave || !this.hasContentChange){
      next();
    }else{
      this.nextPath = to.path;
      // 做一个弹窗
      // 如果确定才跳转
      this.saveConfirmDialogShow = true;
    }
  }
}
</script>
<style>
.image-picker-navigation {
  margin-top: 20px;
}

.image-action-bar {
  padding-left: 5px;
  margin-bottom: 10px;
}

.image-selector-list img {
  width: 96px;
  height: 100px;
  float: left;
}

.image-picker-container .el-dialog__header {
  display: none;
}

.input-new-label {
  width: 120px;
}

.article-title-part input {
  border: none;
  padding-left: 20px;
  font-size: 20px;
}

.label-input-box .el-tag {
  margin-right: 20px;
}

.article-cover-selector i {
  line-height: 140px;
  color: #C0C4CC;
  font-size: 20px;
}

.article-cover-selector img {
  width: 200px;
  height: 140px;
}

.article-cover-selector {
  cursor: pointer;
  width: 200px;
  height: 140px;
  border-radius: 4px;
  text-align: center;
  border: #C0C4CC dashed 1px;
}

.article-post-settings-part .el-textarea {
  width: 400px;
}

.article-post-part .markdown-body {
  height: 800px;
}

.article-post-part {
  background: #8c939d;
}

.article-post-settings-part {
  margin-bottom: 120px;
}

.action-btn-container {
  float: right;
  margin-right: 50px;
  padding: 10px;
}

.article-post-action-bar {
  background: #fff;
  border-top: #E5E5E5 solid 1px;
  position: fixed;
  bottom: 0;
  width: 100%;
  margin-left: -200px;
}

.article-post-part .v-note-op {
  position: sticky;
  top: 0;
}

.image-selector-list .el-radio-button__inner,
.el-radio-button:first-child .el-radio-button__inner,
.el-radio-button:last-child .el-radio-button__inner {
  border: none;
  border-radius: 4px;
  margin: 5px;
  padding: 3px;
}
</style>
