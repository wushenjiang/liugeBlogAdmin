<template>
  <div id="app">
    <!-- 显示我们的内容-->
    <el-container>
      <el-header height="46px" id="admin-header-box">
        <topHeader></topHeader>
      </el-header>
      <el-container class="main-container">
        <el-aside id="left-menu-list-box" width="210px">
          <leftMenu></leftMenu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
export default {
  mounted() {
  }
}
</script>
<style>
#left-menu-list-box{
  z-index: 2000;
}
.main-container{
  position: absolute;
  top: 46px;
  width: 100%;
  bottom: 0;
}
#left-menu-list-box .el-menu {
  border-right: none;
}

.el-header {
  background-color: dodgerblue;
  line-height: 45px;
}

.el-aside {
  border-right: solid 1px #e6e6e6;
  line-height: 180px;
  background-color: #545c64;
}

.el-main {
  padding: 0;
}

</style>
