<template>
  <div id="app">
    <!-- 显示我们的内容-->
    <el-container>
      <el-header height="46px" id="admin-header-box">
          <topHeader></topHeader>
      </el-header>
      <el-container>
        <el-aside id="left-menu-list-box" width="210px">
          <leftMenu></leftMenu>
        </el-aside>
        <el-container>
          <el-main>
            <div class="content">
              <router-view></router-view>
            </div>
          </el-main>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>
<script>
export default {
  mounted() {
    // 动态设置侧边菜单的高度
    let leftMenuBox = document.getElementById("left-menu-list-box");
    let adminHeaderBox = document.getElementById("admin-header-box");
    let dy = window.innerHeight - adminHeaderBox.offsetHeight;
    if (leftMenuBox) {
      leftMenuBox.style.height = dy + 'px';
    }
  }
}
</script>
<style>
#left-menu-list-box .el-menu{
  border-right: none;
}
.el-header{
  background-color:dodgerblue;
  line-height: 45px;
}

.el-aside {
  border-right: solid 1px #e6e6e6;
  line-height: 180px;
  background-color: #545c64;
}
.el-main{
  padding: 0;
}

</style>
