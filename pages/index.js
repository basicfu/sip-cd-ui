import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import {connect} from 'dva';
import Component from "components/Component";

const styles = {

};
const balanceNamespace = "balance";

class Index extends Component {

  render() {
    const {classes} = this.props;
    return (
      <div>
        hello
      </div>
    );
  }
}

export default connect(state => ({
  data: state.global,
  balanceData: state[balanceNamespace],
}))(withStyles(styles)(Index));
