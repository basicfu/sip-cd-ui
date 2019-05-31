import React, {Fragment} from 'react';
import {connect} from 'react-redux';
import {withStyles} from '@material-ui/core/styles';
import CircularProgress from "@material-ui/core/CircularProgress";

const styles = theme => ({
  loading: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.2)',
    zIndex: 9999,
  },
  loadingIcon: {
    position: 'absolute',
    fontSize: 20,
    top: 'calc(25% - 10px)',
    left: 'calc(50% - 10px)',
  },
});

class Loading extends React.Component {

  render() {
    const {classes, loading} = this.props;
    return (
      <Fragment>
        {loading&&
        <div className={classes.loading}>
          <CircularProgress className={classes.loadingIcon}/>
        </div>
        }
      </Fragment>
    );
  }
}

export default connect(state => ({
  loading: state.global.loading,
}))(withStyles(styles)(Loading));
