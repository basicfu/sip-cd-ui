import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import {connect} from 'dva';
import ReactGrid from 'components/ReactGrid';
import Component from "components/Component";
import {formatAmount, formatDateTime} from "utils/index";
import Button from "@material-ui/core/Button";

const namespace = "order";
const styles = {};

const orderStatus = {
  UNPAID: "未支付",
  SUCCESS: "完成",
  CLOSE: "已关闭",
  REFUNDING: "退款中",
  REFUND: "已退款",
};

class Order extends Component {
  componentDidMount() {
    this.dispatch({type: `${namespace}/list`});
  }

  componentWillUnmount() {
    this.resetState(namespace);
  }

  formatName = (value) => {
    return value.name;
  };

  formatSkuName = (_, row) => {
    return row.goods.skus[0].name;
  };

  formatStatus = (value,row) => {
    return <div>
      {orderStatus[value]}&nbsp;
      {value==='UNPAID'&&<label style={{color:'#f96',cursor:'pointer'}} onClick={()=>window.open(`/pay?no=${row.no}`)}>支付</label>}
    </div>;
  };


  render() {
    const {data} = this.props;
    const tableProps = {
      data,
      columns: [
        {key: 'no', title: '订单号', width: 180},
        {key: 'goods', title: '商品名', render: this.formatName},
        {key: 'goods.sku', title: '规格', render: this.formatSkuName},
        {key: 'number', title: '数量'},
        {key: 'amount', title: '总金额',render: formatAmount},
        {key: 'cdate', title: '创建时间', render: formatDateTime},
        // {key: 'pdate', title: '支付时间', render: formatDateTime},
        {key: 'sdate', title: '完成时间', render: formatDateTime},
        {key: 'status', title: '状态', render: this.formatStatus},
      ],
      toolbar: [
        {name: 'search', placeholder: '订单号'},
      ]
    };
    return (
      <ReactGrid {...tableProps}/>
    );
  }
}

export default connect(state => ({
  data: state[namespace],
}))(withStyles(styles)(Order));
