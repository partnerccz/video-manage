import axios from 'axios';
import qs from 'qs';

let base = '';
export const ajaxPrefix = '/api';

export const requestLogin = params => {
    return axios.post(`${base}/userInfo/login`, qs.stringify(params),{headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(res => res.data);
};

export const getUserList = params => {
    return axios.get(`${base}/user/list`, {params: params});
};

export const getUserListPage = params => {
    return axios.get(`${base}/userInfo/list`, {params: params});
};

export const removeUser = params => {
    return axios.get(`${base}/user/remove`, {params: params});
};

export const batchRemoveUser = params => {
    return axios.get(`${base}/user/batchremove`, {params: params});
};

export const editUser = params => {
    return axios.get(`${base}/user/edit`, {params: params});
};

export const addUser = params => {
    return axios.get(`${base}/user/add`, {params: params});
};

export const changeIsBlock = params => {
  return axios.post(`${base}/userInfo/change_is_block`,qs.stringify(params),{headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(res => res.data)
};


export const  getProductTypes = params => {
    return axios.get(`${base}/product_type/list`).then(res => res.data);
};

export const addProductType = params => {
    return axios.post(`${base}/product_type/insert`,qs.stringify(params),{headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(res => res.data);
};

export const editProductType = params => {
    return axios.post(`${base}/product_type/update`,qs.stringify(params),{headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(res => res.data);
};

export const removeProductType = params => {
    return axios.post(`${base}/product_type/del`,qs.stringify(params),{headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(res => res.data);
};