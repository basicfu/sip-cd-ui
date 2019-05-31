import {listCharge,insertCharge} from 'api';
import dialog from "utils/dialog";
import {getOrCreateStore} from "utils/store";

const modal = {
  effects: {
    * list({_}, {call, put, select}) {
      const search = yield select(state => state.recharge.table.search);
      yield put({type: 'startLoading'});
      const {success, data} = yield call(listCharge,search);
      yield put({type: 'stopLoading'});
      if (success) {
        yield put({type: 'updateState', payload: {data}});
      }
    },
    * insert({payload}, {call, put}) {
      const {success,data} = yield call(insertCharge, payload);
      if (success) {
        const div = document.createElement("div");
        div.innerHTML = data;
        document.body.appendChild(div);
        const form=div.getElementsByTagName("form")[0];
        form.target='_blank';
        form.submit();
        div.parentNode.removeChild(div);
        const dispatch=getOrCreateStore().dispatch;
        dialog.confirm({
          disableBackClose: true,
          title: `已完成支付？`,
          onOk() {
            dispatch({type: 'balance/get'});
            dispatch({type: 'recharge/list'});
            dialog.close();
          },
          onClose(){
            dispatch({type: 'recharge/list'});
          }
        });
      }
    },
  },
};
export default modal;
