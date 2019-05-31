/* eslint-disable */
import {login, logout,} from 'api';
import Router from 'next/router';
import notify from "utils/notify";
import config from 'config';
const modal = {
  effects: {
    * login({ payload }, { call, put }) {
      const { success, data } = yield call(login, payload);
      if (success) {
        const roles = data.roles[config.app];
        // if (roles === null || roles === undefined || (roles.indexOf('GUEST') !== -1 && roles.length === 1)) {
        //   notify.warning("暂无权限")
        // } else {
          window.localStorage.setItem('auth', JSON.stringify(data));
          yield put({ type: 'global/user' });
          yield put({ type: 'global/updateState', payload: { auth: data } });
          Router.push('/');
        // }
      }
    },
    * logout(_, { call, put }) {
      const { success } = yield call(logout);
      if (success) {
        window.localStorage.removeItem('auth');
        Router.push('/login');
      }
    },
  },
};
export default modal;
