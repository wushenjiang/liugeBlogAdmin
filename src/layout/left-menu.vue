<template>
  <div>
    <!-- 显示内容-->
    <el-menu
        :default-active="$route.path"
        :unique-opened="true"
        class="el-menu-vertical"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b">
      <!-- 遍历菜单内容-->
      <!-- 有两种：第一种没有子菜单的，另一种有子菜单的-->
      <template v-for="(item,index) in menuList">
        <router-link :to="item.path" v-if="!item.children &&!item.hidden" :key="index">
          <el-menu-item :index="item.path" >
            <i :class="item.icon"></i>
            <span slot="title">{{item.name}}</span>
          </el-menu-item>
        </router-link>
        <el-submenu v-if="item.children && !item.hidden" :key="index" :index="item.path">
          <template slot="title">
            <i :class="item.icon"></i>
            <span>{{item.name}}</span>
          </template>
          <router-link :to="item.path + '/' + subItem.path" v-for="(subItem,subIndex) in item.children"  :key="subIndex" >
            <el-menu-item :index="item.path + '/' + subItem.path"  v-if="!subItem.hidden">
              <i :class="subItem.icon"></i>
              <span slot="title">{{subItem.name}}</span>
            </el-menu-item>
          </router-link>
        </el-submenu>
      </template>
    </el-menu>

  </div>
</template>
<script>
import {routes} from '@/router';

export default {
  data() {
    return {
      menuList: []
    }
  },
  mounted() {
    console.log(this.$route.path)
    let menuList = routes[0];
    this.menuList = menuList.children;
    // console.log(this.menuList);
  }
}
</script>
<style type="text/css">
.el-menu-vertical a{
  text-decoration: none;
}
</style>
