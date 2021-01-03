<template>
  <div id="app">
    <!-- 显示我们的内容-->
    <div class="content-title-box margin-bottom-10" v-text="$route.name">右边内容</div>
    <div class="content-container-box">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
export default {
  mounted() {
    // console.log(this.);
  }
}
</script>
<style>
.content-container-box {
  padding: 10px;
}

.content-title-box {
  padding: 10px;
  font-weight: 600;
}
</style>
