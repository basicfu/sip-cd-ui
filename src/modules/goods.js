import {getGoods} from 'api';

const modal = {
  effects: {
    * get({payload}, {call, put}) {
      const {success, data} = yield call(getGoods,payload);
      if (success) {
        yield put({type: 'updateState', payload: {data}});
      }
    },
  },
};
export default modal;
