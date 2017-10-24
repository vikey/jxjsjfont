import axios from 'axios';
var qs = require('qs');

// let base = process.env.NODE_ENV === 'development' ? 'http://localhost:8082': "http://api.mysays.com";
let base = "http://api.mysays.com";

export const getCaseListPage = params => { return axios.post(`${base}/Case/listByPage`, qs.stringify(params)); };

export const getCaseList = params => { return axios.post(`${base}/Case/list`, qs.stringify(params)); };

export function loadCase(id, params) {
    var url = `${base}/Case/load/${id}`;
    return axios.get(url,{params:params});
}

export function deleteCase(id, params) {
    var url = `${base}/Case/delete/${id}`;
    return axios.post(url,{params:params});
}

export const deleteBatchCase = params => { return axios.post(`${base}/Case/deleteBatch`, qs.stringify(params)); };

export const addCase = params => { return axios.post(`${base}/Case/new`, qs.stringify(params)); };

export const editCase = params => { return axios.post(`${base}/Case/updateName`, qs.stringify(params)); };