/*ajax请求*/
import axios from 'axios'

axios.defaults.withCredentials = true//每次请求，无论是否跨域，都带上cookie信息
//axios.defaults.baseURL = 'https://api.douban.com/v2/movie'
//base是服务器地址
//let base = 'http://localhost:8888';
let base = 'http://192.168.31.239:8888';
/*export const queryMovieByClass1 = params => { 
	return axios.post(`${base}/user/login`, params).
	then(res => res.data); 
};*/

/**
	由于豆瓣有请求次数，所以读取一次后要缓存到本地
*/

export const queryMovieByClass = params => {
	return axios.get(`${base}/movie/queryMovieByClass`, { params: params }); 
};

export const queryMovieById = params => {
	return axios.get(`${base}/movie/queryMovieById`, { params: params }); 
};

export const queryMovieBySearchKey = params => {
	return axios.get(`${base}/movie/queryMovieBySearchKey`, { params: params }); 
};


export const login = params => {
	return axios.post(`${base}/user/login`, params).then(res => res.data); 
};