import Vue from 'vue'
import App from './App.vue'

import router from "./router";
// 饿了么UI
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import leftMenu from './layout/left-menu';
import topHeader from './layout/top-header';

import constants from '@/utils/constants';

Vue.config.productionTip = false;
Vue.prototype.blog_constant = constants;
Vue.component('leftMenu',leftMenu);
Vue.component('topHeader',topHeader);
Vue.use(ElementUI);
import {checkToken,success_code} from "./api/api";

router.beforeEach((to, from, next) => {
    // 如果是登录界面，则需要放行
    if (to.path === '/login') {
        // 如果用户要跳转到登录页面 当前已登录则没必要再到登录界面了，除非用户点击退出登录
        // 如果已经登录，根据角色判断页面跳转
        next();
    }else{
        // 否则检查用户角色
        checkToken().then(result =>{
            // console.log(result);
            if(result.code === success_code){
                // 成功，判断用户角色
                if(result.data.roles === 'role_admin'){
                    next();
                }else{
                    location.href = 'https://www.baidu.com';
                }
            }else{
                // 跳转到登录页面
                next({
                    path:'/login'
                });
            }
        })
        // 管理员，放行
        // 普通用户，跳转到门户首页
    }
})
new Vue({
    router,
    render: h => h(App),
}).$mount('#app');
