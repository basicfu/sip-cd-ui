import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import {connect} from 'dva';
import Component from "components/Component";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import DoneIcon from "@material-ui/icons/Done";
import Router from 'next/router'

const styles = {
  root: {
    width: 1000,
    margin: '0 auto',
    backgroundColor: '#f3f3f3',
  },
  message: {
    width: 600,
    margin: '0 auto',
    padding: '80px 0',
    textAlign: 'center',
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
class Done extends Component {
  state = {
    activeStep: 2,
  };

  handleAction=()=>{
    window.location='/server';
  };

  render() {
    const {classes} = this.props;
    const {activeStep} = this.state;
    const steps = ['选择配置', '支付确认', '支付完成'];
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
        <div className={classes.message}>
          <div>
            <DoneIcon style={{width:80,height:80,color:'#0c0'}}/>
            <div style={{fontSize:28}}>支付成功</div>
          </div>
          <div style={{color:'#2196f3',cursor:'pointer',marginTop: 20}} onClick={()=>this.handleAction()}>控制台</div>
        </div>
      </div>
    );
  }
}

export default connect(state => ({
  data: state.global,
}))(withStyles(styles)(Done));
