import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import {connect} from 'dva';
import Component from "components/Component";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import {Button} from "@material-ui/core";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Router from 'next/router'
import notify from "utils/notify";
import Tooltip from "@material-ui/core/Tooltip";
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
};
const namespace = "goods";
const orderNamespace = "order";

class Buy extends Component {
  state = {
    activeStep: 0,
    skuId: 0,
    number: 1,
  };

  componentDidMount() {
    this.dispatch({type: `${namespace}/get`,payload:{code:'JD_SERVER'}});
  }
  componentWillUnmount() {
    this.resetState(namespace);
    this.resetState(orderNamespace);
  }
  handleChange=(id,value)=>{
    if(id==='skuId'){
      const {number}=this.state;
      const {data:{data:{skus=[]}}} = this.props;
      const totalPrice=skus.filter(it=>it.id===value)[0].price*number;
      this.setState({[id]:value,price:totalPrice})
    }else if(id==='number'){
      if(/^\+?[1-9][0-9]*$/.test(value)){
        const {data:{data:{skus=[]}}} = this.props;
        const options=skus.map(it=>{return {name:it.name,value:it.id,price:it.price}});
        const skuId=this.state.skuId||options.length>0&&options[0].value;
        const totalPrice=skus.filter(it=>it.id===skuId)[0].price*value;
        this.setState({[id]:value,price:totalPrice})
      }else if(value===""){
        this.setState({[id]:value})
      }
    }else{
      this.setState({[id]:value})
    }
  };

  handleNext=()=> {
    const {name,password,number}=this.state;
    const {data:{data:{skus=[]}}} = this.props;
    const options=skus.map(it=>{return {name:it.name,value:it.id,price:it.price}});
    const skuId=this.state.skuId||options.length>0&&options[0].value;
    if(!name||name.length<1||name.length>32){
      notify.warning("服务器名需要在1-32个字符之间");
      return
    }
    if(!password||password.length<8||password.length>30){
      notify.warning("密码需要在8-30位字符之间");
      return
    }
    if(number<1||number>100){
      notify.warning("购买数量需要在1-100之间");
      return
    }
    this.dispatch({type: `${orderNamespace}/insert`,payload:{goodsSkuId: skuId,serverName:name,password,number}});
  };

  render() {
    const {classes, data:{data:{name,skus=[]}}} = this.props;
    const {activeStep,skuId,price,number} = this.state;
    const steps = ['选择配置', '支付确认', '支付完成'];
    const options=skus.map(it=>{return {name:it.name,value:it.id,price:it.price}});
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
        <table className={classes.table}>
          <tbody>
          <tr>
            <td className={classes.title} style={{width:210}}>商品名</td>
            <td>{name}</td>
          </tr>
          <tr>
            <td className={classes.title}>名称</td>
            <td><Input className={classes.input} onChange={(e)=>this.handleChange('name',e.target.value)}/></td>
          </tr>
          <tr>
            <td className={classes.title}>系统</td>
            <td>Windows Server 2012</td>
          </tr>
          <tr>
            <td className={classes.title}>登录名</td>
            <td>Administrator</td>
          </tr>
          <tr>
            <td className={classes.title}>登录密码</td>
            <td>
              <Tooltip
                placement="bottom-start"
                title={
                <div>
                  <div>1.必须包含大写字母、小写字母、数字及特殊字符中三类，且不能少于8字符不能超过30字符</div>
                  <div>{"2.特殊字符如下()`~!@#$%^&*_-+=|{}[]:\";'<>,.?/"}</div>
                  <div>3.不能出现的字符或完整单词，如下：jd、JD、360、bug、BUG、com、COM、cloud、CLOUD、password、PASSWORD</div>
                  <div>4.不能出现连续数字，例：123、987</div>
                  <div>5.不能出现连续或键位连续字母，例：abc、CBA、bcde、qaz、tfc、zaq、qwer</div>
                  <div>6.密码中不能出现自己的用户名</div>
                </div>
              }>
                <Input type="password" className={classes.input} onChange={(e)=>this.handleChange('password',e.target.value)}/>
              </Tooltip>
            </td>
          </tr>
          <tr>
            <td className={classes.title}>购买时长</td>
            <td>
              <Select
                displayEmpty
                value={skuId||options.length>0&&options[0].value}
                style={{width: 120}}
                onChange={(e)=>this.handleChange('skuId',e.target.value)}
              >
                {options.map(it =>
                  <MenuItem key={it.value} value={it.value}>{it.name}</MenuItem>,
                )}
              </Select>
            </td>
          </tr>
          <tr>
            <td className={classes.title}>购买数量</td>
            <td><Input type="number" className={classes.input} style={{width: 120}} value={number} onChange={(e)=>this.handleChange('number',e.target.value)}/></td>
          </tr>
          <tr>
            <td className={classes.title}>费用</td>
            <td><label style={{color: '#ff9600', fontSize: 18}}>{price||options.length>0&&options[0].price}</label>元</td>
          </tr>
          <tr>
            <td/>
            <td><Button variant="contained" color="primary" onClick={() => this.handleNext()}>立即购买</Button></td>
          </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default connect(state => ({
  data: state[namespace],
}))(withStyles(styles)(Buy));
