import {getBalance} from 'api';

const modal = {
  effects: {
    * get({_}, {call, put}) {
      const {success, data} = yield call(getBalance);
      if (success) {
        yield put({type: 'updateState', payload: {data}});
      }
    },
  },
};
export default modal;
