<template>
  <div class="settings-web-info-box">
    <el-form  label-width="100px" size="medium">
      <el-form-item label="网站名称">
        <el-input v-model="websizeTitle"></el-input>
      </el-form-item>
      <el-form-item label="网站关键字">
        <el-input v-model="keywords" placeholder="关键字请用','隔开"></el-input>
      </el-form-item>
      <el-form-item label="网站描述">
        <el-input type="textarea" :rows="3" v-model="description"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="updateSeoInfo">更 新</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import * as api from '@/api/api';
export default {
  data(){
    return{
      websizeTitle:'',
      keywords:'',
      description:'',
      oldInfo:{
        websizeTitle:'',
        keywords:'',
        description:'',
      }
    }
  },
  methods:{
    updateSeoInfo(){
      // 检查数据
      if(this.websizeTitle === ''){
        this.$message.error('网站标题不可以为空');
        return;
      }
      if(this.keywords === ''){
        this.$message.error('关键字不可以为空');
        return;
      }
      if(this.description === ''){
        this.$message.error('描述不可以为空');
        return;
      }
      let isSeoInfoUpdate = false;
      if(this.description !== this.oldInfo.description || this.keywords !== this.oldInfo.keywords){
        // seo关键字和描述不一样的时候
        isSeoInfoUpdate = true;
        api.updateSeoInfo(this.description,this.keywords).then(result => {
          if(result.code === api.success_code){
            this.$message.success(result.message);
            this.getWebSizeInfo();
          }
        });
      }
      // 如果是更新SEO信息，就不做更新标题的信息
      // 提交数据
      if(this.websizeTitle !== this.oldInfo.websizeTitle){
        // 更新一下标题
        api.updateWebSizeTitle(this.websizeTitle).then(result => {
          if(result.code === api.success_code){
            if(!isSeoInfoUpdate){
              this.$message.success(result.message);
            }
            this.getWebSizeTitle();
          }
        });
      }
    },
    getWebSizeInfo(){
      api.getSeoInfo().then(result => {
        if(result.code === api.success_code){
          this.keywords = result.data['web_size_keywords'];
          this.description = result.data['web_size_description']
          this.oldInfo.keywords = this.keywords;
          this.oldInfo.description = this.description;

        }
      })
    },
    getWebSizeTitle(){
      api.getWebSizeTitle().then(result => {
          if(result.code === api.success_code){
            this.websizeTitle = result.data.value;
            this.oldInfo.websizeTitle = this.websizeTitle;
          }
      });
    }
  },
  mounted() {
    this.getWebSizeInfo();
    this.getWebSizeTitle();
  }
}
</script>
<style>
.settings-web-info-box .el-input,.settings-web-info-box .el-textarea{
  width: 300px;
}
</style>
