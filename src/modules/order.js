import {insertOder, getOrder,listOrder,payOder} from 'api';
import Router from "next/dist/client/router";
import {getOrCreateStore} from "utils/store";
import dialog from "utils/dialog";
import notify from "utils/notify";

const modal = {
  effects: {
    * get({payload}, {call, put}) {
      const {success, data} = yield call(getOrder,payload);
      if (success) {
        yield put({type: 'updateState', payload: {data}});
      }
    },
    * list({_}, {call, put, select}) {
      const search = yield select(state => state.order.table.search);
      yield put({type: 'startLoading'});
      const {success, data} = yield call(listOrder,search);
      yield put({type: 'stopLoading'});
      if (success) {
        yield put({type: 'updateState', payload: {data}});
      }
    },
    * insert({payload}, {call, put}) {
      yield put({type: 'global/startLoading'});
      const {success, data} = yield call(insertOder,payload);
      yield put({type: 'global/stopLoading'});
      if (success) {
        Router.push(`/pay?no=${data}`)
      }
    },
    * confirmPay({payload}, {call, put}) {
      const {success, data} = yield call(getOrder,payload);
      if (success) {
        if(data.status==="SUCCESS"){
          Router.push(`/done`)
        }else{
          notify.warning("没有支付成功")
        }
      }
    },
    * pay({payload}, {call, put}) {
      yield put({type: 'global/startLoading'});
      const {success, data} = yield call(payOder,payload);
      yield put({type: 'global/stopLoading'});
      if (success) {
        if(data.payway==='BALANCE'){
          Router.push(`/done`)
        }else if(data.payway==='ALIPAY'){
          const div = document.createElement("div");
          div.innerHTML = data.form;
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
              dispatch({type: 'order/confirmPay',payload:{no:payload.no}});
              dialog.close();
            },
          });
        }
      }
    },
  },
};
export default modal;
