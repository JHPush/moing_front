// lib/axiosConfig.js
import axios from 'axios';
import { loadingController } from './loadingController';

const instance = axios.create({
    baseURL: 'https://ardbyd7sf7.execute-api.ap-northeast-2.amazonaws.com/dev'
});

instance.interceptors.request.use(
    (config) => {
        loadingController.start(); // 로딩 시작
        return config;
    },
    (error) => {
        loadingController.stop(); // 에러
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    (response) => {
        loadingController.stop();
        return response;
    },
    (error) => {
        loadingController.stop();
        return Promise.reject(error);
    }
);

export default instance;
