import {listBill} from 'api';

const modal = {
  effects: {
    * list({_}, {call, put, select}) {
      const search = yield select(state => state.bill.table.search);
      yield put({type: 'startLoading'});
      const {success, data} = yield call(listBill, search);
      yield put({type: 'stopLoading'});
      if (success) {
        yield put({type: 'updateState', payload: {data}});
      }
    },
  },
};
export default modal;
