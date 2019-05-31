import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import {connect} from 'dva';
import ReactGrid from 'components/ReactGrid';
import Component from "components/Component";
import {formatAmount, formatDateTime} from "utils/index";

const namespace = "bill";
const styles = {};

const type = {
  EXPENSE: {label: "支出", color: '#51d2b7'},
  INCOME: {label: "收入", color: '#ad65bb'},
  RECHARGE: {label: "充值", color: '#009900'},
  GIVE: {label: "赠送", color: '#ad65bb'},
  WITHDRAW: {label: "提现", color: '#ad65bb'},
  SERVICE: {label: "服务费", color: '#ad65bb'},
  REFUND: {label: "退款", color: '#ad65bb'}
};

class Index extends Component {
  componentDidMount() {
    this.dispatch({type: `${namespace}/list`});
  }

  componentWillUnmount() {
    this.resetState(namespace)
  }

  formatType = (value) => {
    const item = type[value];
    return item.label;
  };

  formatAmount = (_, row) => {
    const item = type[row.type];
    return <label style={{color: item.color}}>{formatAmount(row.amount)}</label>;
  };


  render() {
    const {data} = this.props;
    const tableProps = {
      data,
      columns: [
        {key: 'no', title: '流水号'},
        {key: 'type', title: '类型', render: this.formatType},
        {key: 'amount', title: '金额', render: this.formatAmount},
        {key: 'balance', title: '余额'},
        // {key: 'payway', title: '支付方式'},
        {key: 'cdate', title: '创建时间', render: formatDateTime},
      ],
      showToolbar: false
    };
    return (
      <ReactGrid {...tableProps}/>
    );
  }
}

export default connect(state => ({
  data: state[namespace],
}))(withStyles(styles)(Index));
