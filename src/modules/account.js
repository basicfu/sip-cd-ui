import {insertAccount, listAccount, updateAccount} from 'api';

const modal = {
  effects: {
    * list({_}, {call, put, select}) {
      const search = yield select(state => state.account.table.search);
      yield put({type: 'startLoading'});
      const {success, data} = yield call(listAccount, search);
      yield put({type: 'stopLoading'});
      if (success) {
        yield put({type: 'updateState', payload: {data}});
      }
    },
    * insert({payload}, {call, put}) {
      yield put({type: 'global/startLoading'});
      const {success} = yield call(insertAccount, payload);
      yield put({type: 'global/stopLoading'});
      if (success) {
        yield put({type: 'list'});
      }
    },
    * update({payload}, {call, put}) {
      yield put({type: 'global/startLoading'});
      const {success} = yield call(updateAccount, payload);
      yield put({type: 'global/stopLoading'});
      if (success) {
        yield put({type: 'list'});
      }
    },
  },
};
export default modal;
