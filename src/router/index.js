import VueRouter from "vue-router";
import Vue from 'vue'
Vue.use(VueRouter);


// 导入的内容
// 登录页面
const login = () => import("@/page/login/login");

// 内容部分
const postArticle = () => import("@/page/content/post-article");
const articleManage = () => import("@/page/content/manage-article");
const imageManage = () => import("@/page/content/manage-image");
const commentManage = () => import("@/page/content/manage-comment");
// 首页
const index = () => import("@/page/dashboard/index");
// 运营
const category = () => import("@/page/operation/manage-category");
const loop = () => import("@/page/operation/manage-loop");
// 设置
const friendLink = () => import("@/page/settings/friend-link");
const webSizeInfo = () => import("@/page/settings/websize-info");
const email = () => import("@/page/settings/email");
const info = () => import("@/page/settings/info");
// 用户
const list = () => import("@/page/user/list");
// 布局
const  baseView = () => import('@/layout/base-view');
const  rightView = () => import('@/layout/right-content');


// 路由器
export const routes =[
    {
        path:'',
        component:baseView,
        redirect:'/index',
        children:[
            {
                path:"/index",
                name:'首页',
                icon:'el-icon-s-home',
                hidden:false,
                component:index
            },
            {
                path:'/content',
                name:'内容',
                icon:'el-icon-folder',
                hidden:false,
                component:rightView,
                children:[
                    {
                        path:'post-article',
                        hidden:false,
                        name:'发表文章',
                        icon:'el-icon-edit-outline',
                        component:postArticle
                    },
                    {
                        path:'manage-article',
                        hidden:false,
                        name:'文章管理',
                        icon:'el-icon-document',
                        component:articleManage
                    },
                    {
                        path:'manage-comment',
                        hidden:false,
                        name:'评论管理',
                        icon: 'el-icon-chat-square',
                        component:commentManage
                    },
                    {
                        path:'manage-image',
                        hidden:false,
                        name:'图片管理',
                        icon: 'el-icon-picture-outline-round',
                        component:imageManage
                    }
                ]
            },
            {
                path:'/user',
                name:'用户',
                icon: 'el-icon-user',
                hidden:false,
                component:rightView,
                children:[
                    {
                        path:'list',
                        hidden:false,
                        name:'用户列表',
                        icon: 'el-icon-user',
                        component:list
                    }
                ]
            },
            {
                path:'/operation',
                name:'运营',
                hidden:false,
                icon: 'el-icon-coin',
                component:rightView,
                children:[
                    {
                        path:'category',
                        hidden:false,
                        name:'分类管理',
                        icon: 'el-icon-coffee',
                        component:category
                    },
                    {
                        path:'loop',
                        hidden:false,
                        name:'轮播图管理',
                        icon: 'el-icon-picture-outline',
                        component:loop
                    }
                ]
            },
            {
                path:'/settings',
                name:'设置',
                icon: 'el-icon-setting',
                hidden:false,
                component:rightView,
                children:[
                    {
                        path:'web-size-info',
                        hidden:false,
                        name:'网站信息',
                        icon: 'el-icon-info',
                        component:webSizeInfo
                    },
                    {
                        path:'friend-link',
                        hidden:false,
                        name:'友情链接',
                        icon: 'el-icon-bell',
                        component:friendLink
                    },
                    {
                        path:'email',
                        hidden:false,
                        name:'邮箱设置',
                        icon: 'el-icon-takeaway-box',
                        component:email
                    },
                    {
                        path:'info',
                        hidden:false,
                        name:'用户信息',
                        icon: 'el-icon-warning-outline',
                        component:info
                    }
                ]
            },

        ]
    },
    {
        path: '/login',
        component:login
    }
];

const router = new VueRouter({
    routes // (缩写) 相当于 routes:routes
})

export default router;
