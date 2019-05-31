import React, {Fragment} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {connect} from 'dva';
import Component from "components/Component";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import {Button} from "@material-ui/core";
import Router from 'next/router'
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import * as config from "../src/config";
import {formatAmount, getQueryString} from "utils/index";
import notify from "utils/notify";
import CloseIcon from "@material-ui/icons/Close";

const styles = {
  root: {
    width: 1000,
    margin: '0 auto',
    backgroundColor: '#f3f3f3',
  },
  table: {
    width: 600,
    margin: '0 auto',
    padding: '50px 0',
    // padding: '50px 0px 50px 120px',
    '& tr': {
      lineHeight: 3,
    }
  },
  title: {
    textAlign: 'right',
    fontSize: 16,
    color: '#666',
    paddingRight: 30,
  },
  input: {
    width: '100%'
  },
  message: {
    width: 600,
    margin: '0 auto',
    padding: '80px 0',
    textAlign: 'center',
  },
};
const orderNamespace = "order";
const balanceNamespace = "balance";

class Pay extends Component {
  state = {
    activeStep: 1,
    payway: 'BALANCE',
    no: '',
  };

  componentDidMount() {
    const no = getQueryString("no");
    if(!no){
      notify.warning("非法请求");
      return
    }
    this.setState({no});
    this.dispatch({type: `${orderNamespace}/get`,payload: {no}});
    this.dispatch({type: `${balanceNamespace}/get`});
  }

  componentWillUnmount() {
    this.resetState(orderNamespace);
    this.resetState(balanceNamespace);
  }

  handleChange=(id,value)=>{
    this.setState({[id]:value})
  }

  handlePay() {
    const {payway,no}=this.state;
    const {orderData:{data:{amount}},balanceData:{data:{availableBalance}}} = this.props;
    if(payway==='BALANCE'){
      if(availableBalance<amount){
        notify.warning("可用余额不足");
        return
      }
      this.dispatch({type: `${orderNamespace}/pay`,payload:{no,payway}});
    }else if(payway==='ALIPAY'){
      this.dispatch({type: `${orderNamespace}/pay`,payload:{no,payway}});
    }
  }
  handleAction=()=>{
    window.location='/server';
  };
  render() {
    const {classes, orderData:{data},balanceData:{data:{availableBalance}}} = this.props;
    const {activeStep,payway} = this.state;
    const {number,amount,goods,status}=data;
    const {name,skus}=goods||{};
    const steps = ['选择配置', '支付确认', '支付完成'];
    console.log(status);
    return (
      <div className={classes.root}>
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => {
            return (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        {(status===undefined||status==='UNPAID')?
        <Fragment>
          <table className={classes.table}>
            <tbody>
            <tr>
              <td className={classes.title} style={{width:210}}>商品名</td>
              <td>{name}</td>
            </tr>
            <tr>
              <td className={classes.title}>时长</td>
              <td>{skus&&skus.length>0&&skus[0].name}</td>
            </tr>
            <tr>
              <td className={classes.title}>数量</td>
              <td>{number}</td>
            </tr>
            <tr>
              <td className={classes.title}>价格</td>
              <td>{amount}</td>
            </tr>
            <tr>
              <td className={classes.title} style={{verticalAlign:'top'}}>支付方式</td>
              <td>
                <RadioGroup
                  value={payway}
                  onChange={(e)=>this.handleChange('payway',e.target.value)}
                >
                  <FormControlLabel
                    value="BALANCE"
                    control={<Radio color="primary" />}
                    label={<div style={{fontSize: 18}}>余额
                      <label style={{marginLeft:10}}></label>
                      <label style={{fontSize: 12}}>(可用</label>
                      <label style={{color:'#ff9600'}}>{formatAmount(availableBalance)}</label>
                      <label style={{fontSize: 12}}>元)</label>
                    </div>}
                  />
                  <FormControlLabel
                    value="ALIPAY"
                    control={<Radio  color="primary" />}
                    label={<img width={80} src={config.alipay}/>}
                  />
                </RadioGroup>
              </td>
            </tr>
            <tr>
              <td/>
              <td><Button variant="contained" color="primary" onClick={() => this.handlePay()}>立即支付</Button></td>
            </tr>
            </tbody>
          </table>
        </Fragment>
          :
          <div className={classes.message}>
            <div>
              <CloseIcon style={{width:80,height:80,color:'#f00'}}/>
              <div style={{fontSize:28}}>该笔订单不需要支付</div>
            </div>
            <div style={{color:'#2196f3',cursor:'pointer',marginTop: 20}} onClick={()=>this.handleAction()}>控制台</div>
          </div>
        }
      </div>
    );
  }
}

export default connect(state => ({
  orderData: state[orderNamespace],
  balanceData: state[balanceNamespace],
}))(withStyles(styles)(Pay));
