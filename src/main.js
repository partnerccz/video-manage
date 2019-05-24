import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
//import './assets/theme/theme-green/index.css'
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
//import NProgress from 'nprogress'
//import 'nprogress/nprogress.css'
import routes from './routes'
// import Mock from './mock'
// Mock.bootstrap();
import 'font-awesome/css/font-awesome.min.css'
import {ajaxPrefix} from './api/api'

Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)

/*
上传地址
上传后返回fileName 文件名
*/
Vue.prototype._uploadFilePath = ajaxPrefix + '/fileUpload/upload_manage'
Vue.prototype._downloadFilePath = ajaxPrefix + '/fileUpload/upload_manage'

import axios from 'axios'

axios.defaults.baseURL = '/api';
Vue.prototype.$http = axios

// 添加响应拦截器
// axios.interceptors.response.use(function (response) {
//     // 对响应数据做点什么
//     console.log('/response')
//     console.log(response)
//     console.log(response.data.httpCode)
//     if (response.data.httpCode == 600) {
//         console.log('httpCOde')
//         // if (window.location.hash) {
//         //     this.$router.push({ path: '/login' });
//             window.location.href = '/login'
//         // } else {
//         //     this.$router.push({ path: '/login' });
//         //     // window.location.href = 'login'
//         // }
//     }
//     //缓存数据
//     if (response.config.headers.cache && response.config.headers.cache == "force-cache") {
//         store.commit('cache', {key: response.config.url, value: response.data});
//     }
//     return response.data;
// }, function (error) {
//     // 对响应错误做点什么
//     setAction('reset')
//     print(error)
//     return Promise.reject(error);
// });
// function setAction(action){
//     if(store.state.elHandler && $(store.state.elHandler)){
//         $(store.state.elHandler).button(action)
//         if(action === 'reset'){
//             store.commit('elHandler',null)
//         }
//     }
// }

//NProgress.configure({ showSpinner: false });

const router = new VueRouter({
    mode: 'history',
    routes
})

router.beforeEach((to, from, next) => {
    //NProgress.start();
    if (to.path == '/login') {
        sessionStorage.removeItem('user');
    }
    let user = JSON.parse(sessionStorage.getItem('user'));
    if (!user && to.path != '/login') {
        next({path: '/login'})
    } else {
        next()
    }
})

//router.afterEach(transition => {
//NProgress.done();
//});

new Vue({
    //el: '#app',
    //template: '<App/>',
    router,
    store,
    //components: { App }
    render: h => h(App)
}).$mount('#app')

