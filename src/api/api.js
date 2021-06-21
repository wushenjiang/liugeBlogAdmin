import http from './http';


export const success_code = 20000;
export const fail_code = 40000;
// 解析token
export const checkToken = () => {
    return http.requestGet('/user/check_token');
};

// 登录
export const doLogin = (verifyCode,liugeUser) => {
    return http.requestPost('/user/login/' + verifyCode + '?from=p_', liugeUser);
};

// 获取分类列表
export const listCategories = () => {
    return http.requestGet('/admin/category/list/');
}

// 删除分类
export const deleteCategoryById = (categoryId) => {
    return http.requestDelete('/admin/category/' + categoryId);
}

// 添加分类
export const postCategory = (category) => {
    return http.requestPost('/admin/category', category);
}

// 修改分类
export const updateCategory = (categoryId, category) => {
    return http.requestPut('/admin/category/' + categoryId, category);
}

// 获取轮播图列表
export const listLoop = () => {
    return http.requestGet('/admin/loop/list/');
}

// 添加轮播图
export const postLoop = (loop) => {
    return http.requestPost('/admin/loop', loop);
}

// 删除轮播图
export const deleteLoop = (loopId) => {
    return http.requestDelete('/admin/loop/' + loopId);
}

// 更新轮播图
export const updateLoop = (loopId, loop) => {
    return http.requestPut('/admin/loop/' + loopId, loop);
}
// 获取用户列表
export const listUsers = (page, size) => {
    return http.requestGet('/user/list?page=' + page + '&size=' + size);
}
// 查询用户
export const doUserSearch = (userName, email) => {
    return http.requestGet('/user/list?page=1&size=10&userName=' + userName + '&email=' + email);
}
// 删除用户
export const deleteUserById = (userId) => {
    return http.requestDelete('/user/' + userId);
}
// 重置密码
export const resetPassword = (userId, newPassword) => {
    return http.requestPut('/user/reset-password/' + userId + "?password=" + newPassword);
}
// 获取邮箱验证码
export const getVerifyCode = (emailAddress, type) => {
    return http.requestGet('/user/verify_code?email=' + emailAddress + '&type=' + type);
}
// 更新邮箱
export const updateEmailAddress = (emailAddress, verifyCode) => {
    return http.requestPut('/user/email?email=' + emailAddress + '&verify_code=' + verifyCode);
}
// 检查用户名是否重复
export const checkUserName = (userName) => {
    return http.requestGet('/user/user_name?userName=' + userName);
}
// 更新用户信息
export const updateUserInfo = (userInfo, userId) => {
    return http.requestPut('/user/user_info/' + userId, userInfo);
}
// 获取网站信息
export const getSeoInfo = () => {
    return http.requestGet('/admin/web_size_info/seo');
}
export const getWebSizeTitle = () => {
    return http.requestGet('/admin/web_size_info/title');
}
// 更新网站标题
export const updateWebSizeTitle = (title) => {
    return http.requestPut('/admin/web_size_info/title?title=' + title);
}
// 更新网站SEO
export const updateSeoInfo = (description, keywords) => {
    return http.requestPut('/admin/web_size_info/seo?description=' + description + "&keywords=" + keywords);
}
// 获取友情链接信息
export const listFriendLinks = () => {
    return http.requestGet('/admin/friend_link/list');
}
// 添加友情链接
export const postFriendLink = (link) => {
    return http.requestPost('/admin/friend_link', link);
}
// 更新友情链接
export const updateFriendLink = (link, linkId) => {
    return http.requestPut('/admin/friend_link/' + linkId, link);
}
// 删除友情链接
export const deleteFriendLink = (linkId) => {
    return http.requestDelete('/admin/friend_link/' + linkId);
}
// 获取图片列表
export const listImages = (page, size, original) => {
    return http.requestGet('/admin/image/list/' + page + "/" + size + "?original=" + original);
}
// 发表文章
export const postArticle = (article) => {
    return http.requestPost('/admin/article', article);
}
// 保存草稿
export const saveArticleDraft = (article) => {
    return http.requestPost('/admin/article', article);
}
// 查询文章列表
export const listArticles = (page, size, state, keyword, categoryId) => {
    let url = '/admin/article/list/' + page + "/" + size
        + "?state=" + state + '&categoryId=' + categoryId + '&keyword=' + keyword;
    console.log(url);
    return http.requestGet(url);
}
// 置顶文章
export const topArticle = (articleId) => {
    return http.requestPut('/admin/article/top/' + articleId);
}
// 绝对删除文章
export const deleteArticleAbs = (articleId) => {
    return http.requestDelete('/admin/article/' + articleId);
}
// 假装删除文章
export const deleteArticlePre = (articleId) => {
    return http.requestDelete('/admin/article/state/' + articleId);
}
// 获取文章详情
export const getArticleDetail = (articleId) => {
    return http.requestGet('/admin/article/' + articleId);
}
// 更新文章
export const updateArticle = (articleId,article) => {
    return http.requestPut('/admin/article/' + articleId,article);
}
// 获取评论列表
export const listComments = (page,size) => {
    return http.requestGet('/admin/comment/list/' + page + "/" + size);
}
// 删除评论
export const deleteCommentById = (commentId) => {
    return http.requestDelete('/admin/comment/' + commentId);
}
// 置顶评论
export const topComment = (commentId) => {
    return http.requestPut('/admin/comment/top/' + commentId);
}

// 删除图片
export const deleteImageById = (imageId) => {
    return http.requestDelete('/admin/image/' + imageId);
}

// 获取文章总数
export const getArticleCount = () => {
    return http.requestGet('/admin/article/count');
}
// 获取用户总数
export const getUserCount = () => {
    return http.requestGet('/user/register_count');
}
// 获取评论总数
export const getCommentCount = () => {
    return http.requestGet('/admin/comment/count');
}
// 获取浏览量
export const getViewCount = () => {
    return http.requestGet('/admin/web_size_info/view_count');
}

// 登出
export const doLogout = () => {
    return http.requestGet('/user/logout');
}



















