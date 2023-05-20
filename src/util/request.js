// 引入axios
import axios from 'axios';
import store from '@/store/vuex'

let baseUrl="https://mock.apifox.cn/m1/2735029-0-default";
// let baseUrl="http://127.0.0.1:4523/m1/2735029-0-default/";
// 创建axios实例
const httpService = axios.create({
    baseURL:baseUrl,
    // 请求超时时间
    timeout: 3000 
});

// 添加请求拦截器
httpService.interceptors.request.use(function (config) {
    config.headers.token=store.getters.GET_TOKEN
    return config;
}, function (error) {
    return Promise.reject(error);
});

// 添加响应拦截器
httpService.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    return Promise.reject(error);
});

/*网络请求部分*/

/*
 *  get请求
 *  url:请求地址
 *  params:参数
 * */
export function get(url, params = {}) {
    return new Promise((resolve, reject) => {
        httpService({
            url: url,
            method: 'get',
            params: params
        }).then(response => {
            resolve(response);
        }).catch(error => {
            reject(error);
        });
    });
}

/*
 *  post请求
 *  url:请求地址
 *  params:参数
 * */
export function post(url, params = {}) {
    return new Promise((resolve, reject) => {
        httpService({
            url: url,
            method: 'post',
            data: params
        }).then(response => {
            console.log(response)
            resolve(response);
        }).catch(error => {
            console.log(error)
            reject(error);
        });
    });
}

/*
 *  文件上传
 *  url:请求地址
 *  params:参数
 * */
export function fileUpload(url, params = {}) {
    return new Promise((resolve, reject) => {
        httpService({
            url: url,
            method: 'post',
            data: params,
            headers: { 'Content-Type': 'multipart/form-data' }
        }).then(response => {
            resolve(response);
        }).catch(error => {
            reject(error);
        });
    });
}

export function getServerUrl(){
    return baseUrl;
}

export default {
    get,
    post,
    fileUpload,
    getServerUrl
}
