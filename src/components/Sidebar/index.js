import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Component from "components/Component";
import styles from "styles/sidebar";
import ListItems from "components/Sidebar/ListItems";
import {breadcrumbOpen} from "utils";
import {connect} from "react-redux";

class Index extends Component {
  handleOpen = (children,bread, open) => {
    // const menus = this.props.menus[config.app]||[];
    const {items} = this.props.menus;
    if(children){
      breadcrumbOpen(items, bread,0, open);
      this.dispatch({type: `global/updateState`, payload: {menus:{items,selected:bread}}});
    }else{
      this.dispatch({type: `global/updateState`, payload: {menus:{items,selected:bread}}});
    }
  };

  render() {
    const {classes} = this.props;
    const {items,selected} = this.props.menus;
    return (
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        {ListItems({items, selectedBreadcrumb:selected, handleOpen: this.handleOpen})}
      </Drawer>
    );
  }
}

export default connect(state => ({
  menus: state.global.menus,
}))(withStyles(styles)(Index));
