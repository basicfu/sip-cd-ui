import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Notifications from 'components/Notifications';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';
import Popper from '@material-ui/core/Popper/Popper';
import Grow from '@material-ui/core/Grow/Grow';
import Paper from '@material-ui/core/Paper/Paper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener/ClickAwayListener';
import MenuList from '@material-ui/core/MenuList/MenuList';
import Typography from "@material-ui/core/Typography";
import Router from "next/router";
import config from 'config';

const styles = theme => ({
  root: {
    display: 'flex',
    height: 64,
  },
  grow: {
    flex: '1 1 auto',
  },
  appBar: {
    transition: theme.transitions.create('width'),
    '@media print': {
      position: 'absolute',
    },
  },
  rightButton: {
    position: 'absolute',
    right: 10,
  },
  appSelect: {
    marginRight: 60,
    width: 100,
  },
  title:{
    fontSize: '1.4rem'
  }
});
class Index extends React.Component {
  state = {
    open: false,
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleLogout = () => {
    this.props.dispatch({ type: 'user/logout' });
  };

  handleHome=()=>{
    window.location="/"
  };

  render() {
    const { classes, data } = this.props;
    const { open } = this.state;
    return (
      <div className={classes.root}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={this.handleHome}
            >
              <MenuIcon/>
            </IconButton>
            <Typography className={classes.title} color="inherit">
              {config.title}
            </Typography>
            <div className={classes.grow} />
            {data.auth.username &&
            <IconButton
              aria-owns={open ? 'menu-appbar' : null}
              color="inherit"
              buttonRef={node => {
                this.anchorEl = node;
              }}
              onMouseOver={this.handleOpen}
              onMouseOut={this.handleClose}
              aria-labelledby="appbar-github"
              className={classes.rightButton}
            >
              <AccountCircle />
            </IconButton>
            }
            <Popper
              open={open}
              anchorEl={this.anchorEl}
              transition
              disablePortal
              onMouseOver={this.handleOpen}
              onMouseOut={this.handleClose}>
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  id="menu-list-grow"
                  style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                >
                  <Paper>
                    <ClickAwayListener onClickAway={this.handleClose}>
                      <MenuList>
                        {data.auth.username && <MenuItem disabled>{data.auth.username}</MenuItem>}
                        <MenuItem onClick={this.handleLogout}>退出</MenuItem>
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </Toolbar>
        </AppBar>
        <Notifications />
      </div>
    );
  }
}

export default connect(state => ({
  data: state.global,
}))(withStyles(styles)(Index));
