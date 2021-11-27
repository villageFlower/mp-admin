import axios from 'axios';

const service = axios.create({
    // process.env.NODE_ENV === 'development' 来判断是否开发环境
    // easy-mock服务挂了，暂时不使用了
    // baseURL: 'http://localhost:8888',
    baseURL: 'https://mp-api.simonyc.tech',
    timeout: 5000
});

service.interceptors.request.use(
    config => {
        return config;
    },
    error => {
        return error;
    }
);

service.interceptors.response.use(
    response => {
        return response
        if (response.status === 200) {
            return response.data;
        } else {
            Promise.reject();
        }
    },
    error => {
        return error.response
        return Promise.reject(error);
    }
);

export default service;
