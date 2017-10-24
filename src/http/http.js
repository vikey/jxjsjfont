/**
 * Created by vikey on 2017/5/26.
 */
 /**
  * http配置
  * * */
// 引入axios
import axios from 'axios'

// axios 配置
axios.defaults.timeout = 5000;

//添加请求拦截器

// http request 拦截器
axios.interceptors.request.use(
    config => {

        config.headers.vAuthToken = sessionStorage.getItem("user");
        config.headers.client = `web`;
        return config;
    },
    err => {
        return Promise.reject(err);
    });

// http response 拦截器
axios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    // 401 清除token信息并跳转到登录页面
                   // store.commit(types.LOGOUT);
                    router.replace({
                        path: 'login',
                        query: {redirect: router.currentRoute.fullPath}
                    })
            }
        }
        // console.log(JSON.stringify(error));//console : Error: Request failed with status code 402
        return Promise.reject(error)
    });

export default axios;
