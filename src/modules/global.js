import { allDict, user } from 'api';
import Router from 'next/router';
import config from "config";
import {depthOpen, getBreadcrumb} from "utils/index";

const model = {
  state: {
    notify: {
      key: 1,
      visible: false,
      message: '',
      type: 'success',
      duration: 2000,
    },
    loading: false,
    user: {},
    menus: {
      items:[],
      selected:[]
    },
    dict: {},
    otherDict: {},
    auth: {},
  },
  subscriptions: {
    setup({ dispatch }) {
      if (typeof window !== 'undefined') {
        const auth = window.localStorage.getItem('auth');
        if (auth) {
          // 异步防止客户端和服务端渲染不一致
          new Promise((resolve) => {
            resolve();
          }).then(() => {
            dispatch({ type: 'updateState', payload: { auth: JSON.parse(auth) || {} } });
          });
          dispatch({ type: 'user' });
          // dispatch({ type: 'dict' });
        } else if (Router.pathname !== '/login') {
          Router.push('/login');
        }
      }
    },
  },
  effects: {
    * user({ _ }, { call, put }) {
      const response = yield call(user);
      if (response.success) {
        // const roles = response.data.roles[config.app];
        // if (roles === null || roles === undefined || (roles.indexOf('GUEST') !== -1 && roles.length === 1)) {
        //   Router.push('/login');
        // } else {
          yield put({ type: 'updateState', payload: { user: { ...response.data } } });
          yield put({ type: 'updateMenus', payload: response.data.menus });
        // }
      }
    },
    * dict({ payload }, { call, put }) {
      const response = yield call(allDict, {...payload});
      if (response.success) {
        const dicts = response.data.children;
        const dict = {};
        dicts.forEach(it => {
          dict[it.value] = it;
        });
        // 有可能会用到其他应用字典，所以此处区分
        if (payload && payload.app && payload.app !== 'sip') {
          yield put({ type: 'updateState', payload: { otherDict: dict } });
        } else {
          yield put({ type: 'updateState', payload: { dict } });
        }
      }
    },
  },
  reducers: {
    updateMenus(state,{payload}){
      const items=payload[config.app]||[];
      const selected=getBreadcrumb(items, window.location.pathname);
      depthOpen(items,selected);
      return { ...state, menus:{items,selected} };
    },
    startLoading(state) {
      return { ...state, loading: true };
    },
    stopLoading(state) {
      return { ...state, loading: false };
    },
    closeNotify(state) {
      return { ...state, notify: { ...state.notify, visible: false } };
    },
    openNotify(state, { payload }) {
      const key = state.notify.key + 1;
      return { ...state, notify: { ...state.notify, visible: true, key, ...payload } };
    },
  },

};

export default model;
