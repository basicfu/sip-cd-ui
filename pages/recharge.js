import React from 'react';
import {withStyles} from '@material-ui/core/styles';
// import {withStyles} from '@material-ui/icons/ArrowDo';
import {connect} from 'dva';
import Component from "components/Component";
import Input from "@material-ui/core/Input";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import Grid from "@material-ui/core/Grid";
import {Button, Divider} from "@material-ui/core";
import InputAdornment from "@material-ui/core/InputAdornment";
import RadioIcon from "@material-ui/icons/Radio";
import * as config from "../src/config";
import {formatAmount, formatDateTime, isAmount} from "utils/index";
import notify from "utils/notify";
import dialog from "utils/dialog";
import ReactGrid from "components/ReactGrid";

const namespace = "recharge";
const balanceNamespace = "balance";
const styles = {
  tips:{
    margin: '1em 0',
    backgroundColor: '#f8ffff',
    color: '#276f86',
    padding: '1em 1.5em',
    lineHeight: '1.4285em',
    borderRadius: '.28571429rem',
    boxShadow: '0 0 0 1px rgba(34,36,38,.22) inset, 0 0 0 0 transparent',
  },
  header:{
    fontSize: '1.2em',
    fontWidth: 700,
  },
  message:{

  },
  balanceBox:{
    padding: '12px 20px',
    fontSize: 12,
  },
  amountFont:{
    fontFamily: '\\5FAE\\8F6F\\96C5\\9ED1,sans-serif'
  },
  balance:{
    padding: '16px 20px',
    border: '1px solid #e1e2e3',
    backgroundColor: '#fcfdfe',
    '& p':{
      margin: 0,
      padding: 0,
    }
  },
};
const status={
  UNPAID: '未支付',
  SUCCESS: '已完成',
  CLOSE: '已关闭',
};
class Recharge extends Component {
  state={
    amount: ''
  };

  componentDidMount() {
    this.dispatch({type: `${namespace}/list`});
    this.dispatch({type: `${balanceNamespace}/get`});
  }

  componentWillUnmount() {
    this.resetState(namespace);
    this.resetState(balanceNamespace);
  }

  handleChange(id,value){
    this.setState({[id]:value})
  }

  handleRecharge=()=>{
    const {amount}=this.state;
    if (!isAmount(amount)) {
      notify.warning("金额格式不正确");
      return;
    }
    this.setState({amount:''});
    this.dispatch({type: `${namespace}/insert`, payload: {amount,payway:'ALIPAY'}});
  };

  render() {
    const {classes,data,balanceData} = this.props;
    const {availableBalance,withdrawalBalance,giveBalance,frozenBalance}=balanceData.data;
    const {amount} = this.state;
    const tableProps = {
      data,
      columns: [
        {key: 'no', title: '流水号'},
        {key: 'tradeNo', title: '交易号'},
        {key: 'amount', title: '金额',width: 100, render:(value)=> formatAmount(value,'#009900')},
        {key: 'payway', title: '支付方式',width: 80,render: ()=>"支付宝"},
        {key: 'cdate', title: '创建时间', render: formatDateTime},
        {key: 'sdate', title: '完成时间', render: formatDateTime},
      ],
      showToolbar: false,
    };
    return (
      <div>
        {/* <div className={classes.tips}> */}
        {/*  <div className={classes.header}>充值注意事项</div> */}
        {/*  <div className={classes.message}> */}
        {/*    <div>平台暂只支持支付宝充值</div> */}
        {/*    <div>未付款订单将在2小时后自动关闭</div> */}
        {/*    <div>充值金额无法提现,支付宝会判定为套现行为,敬请谅解</div> */}
        {/*  </div> */}
        {/* </div> */}
        <div className={classes.balanceBox}>
          <Grid className={classes.balance} container justify="space-between" alignItems="flex-end" >
            <Grid item>
              <p className={classes.amountFont} style={{fontSize:18}}>可用金额</p>
              <p><label style={{fontSize:36,color:'#2196f3'}}>{formatAmount(availableBalance)}</label>元</p>
            </Grid>
            <Grid item>
              <p className={classes.amountFont}>提现金额</p>
              <p><label style={{fontSize:24,color:'#51d2b7'}}>{formatAmount(withdrawalBalance)}</label>元</p>
            </Grid>
            <Grid item>
              <p className={classes.amountFont}>赠送金额</p>
              <p><label style={{fontSize:24,color:'#e10050'}}>{formatAmount(giveBalance)}</label>元</p>
            </Grid>
            <Grid item>
              <p className={classes.amountFont}>冻结金额</p>
              <p><label style={{fontSize:24}}>{formatAmount(frozenBalance)}</label>元</p>
            </Grid>
          </Grid>
        </div>
        <Divider />
        <div className={classes.balanceBox}>
          <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="flex-end"
            spacing={24}
          >
            <Grid item>
              <FormControl style={{display: 'block'}}>
                <FormLabel component="label">充值金额</FormLabel>
                <Input
                  value={amount||''}
                  onChange={(e)=>this.handleChange("amount",e.target.value)}
                  style={{marginLeft: '20px'}}
                  endAdornment={<InputAdornment position="end">元</InputAdornment>}
                />
              </FormControl>
            </Grid>
            <Grid item>
              <RadioGroup
                // value={value}
                // onChange={handleChange}
                row
                style={{marginLeft: 20}}
              >
                <FormControlLabel
                  checked
                  control={<Radio style={{width:24,height:24,padding:'0 20px'}} color="primary" />}
                  label={<img width={70} src={config.alipay}/>}
                />
              </RadioGroup>
            </Grid>
            <Grid item>
              <Button onClick={()=>this.handleRecharge()} variant="contained" color='primary'>充&nbsp;&nbsp;值</Button>
            </Grid>
          </Grid>
        </div>
        <ReactGrid {...tableProps}/>
      </div>
    );
  }
}

export default connect(state => ({
  data: state[namespace],
  balanceData: state[balanceNamespace],
}))(withStyles(styles)(Recharge));
