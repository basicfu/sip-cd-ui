/* eslint-disable max-len */
import request from './utils/request';

const prefix = '/api';
const base = '/base';
const tb = '/tb';

export async function allDict(params) { return request(`${prefix}${base}/dict/all`, { method: 'GET', body: params }); }

// 用户管理
export async function user() { return request(`${prefix}${base}/user`, { method: 'GET' }); }
export async function login(params) { return request(`${prefix}${base}/user/login`, { method: 'POST', body: params }); }
export async function logout() { return request(`${prefix}${base}/user/logout`, { method: 'GET' }); }

// 账号管理
export async function listAccount(params) { return request(`${prefix}${tb}/account/list`, { method: 'GET', body: params }); }
export async function insertAccount(params) { return request(`${prefix}${tb}/account/insert`, { method: 'POST', body: params }); }
export async function updateAccount(params) { return request(`${prefix}${tb}/account/update`, { method: 'POST', body: params }); }

// 充值
export async function listCharge(params) { return request(`${prefix}${tb}/recharge/list`, { method: 'GET', body: params }); }
export async function insertCharge(params) { return request(`${prefix}${tb}/recharge/pay`, { method: 'POST', body: params }); }
// export async function restPasswordServer(params) { return request(`${prefix}${tb}/server/rest-password`, { method: 'POST', body: params }); }
// export async function vncServer(params) { return request(`${prefix}${tb}/server/vnc`, { method: 'GET', body: params }); }

// 余额
export async function getBalance(params) { return request(`${prefix}${tb}/balance`, { method: 'GET', body: params }); }

// 资金明细
export async function listBill(params) { return request(`${prefix}${tb}/bill/list`, { method: 'GET', body: params }); }

// 商品
export async function getGoods(params) { return request(`${prefix}${tb}/goods/get`, { method: 'GET', body: params }); }

// 订单
export async function getOrder(params) { return request(`${prefix}${tb}/order/get`, { method: 'GET', body: params }); }
export async function listOrder(params) { return request(`${prefix}${tb}/order/list`, { method: 'GET', body: params }); }
export async function insertOder(params) { return request(`${prefix}${tb}/order/insert`, { method: 'POST', body: params }); }
export async function payOder(params) { return request(`${prefix}${tb}/order/pay`, { method: 'POST', body: params }); }
