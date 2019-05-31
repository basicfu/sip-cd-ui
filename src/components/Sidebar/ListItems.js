import React, {Fragment} from 'react';
import {withStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Collapse from '@material-ui/core/Collapse';
import ListItemText from '@material-ui/core/ListItemText';
import Router from 'next/router';
import styles from "styles/sidebar";
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

const Item = withStyles(styles)((props) => {
  const {classes,selected,depth, children,breadcrumb,handleOpen,item} = props;
  const {name,path,open}=item;
  const style = {paddingLeft: 8 * (2 + 2 * depth)};
  const onChange=()=>{
    if(!children){
      Router.push(path);
    }
    handleOpen(children,breadcrumb);
  };
  React.useEffect(()=>{

  })
  return (
    <Fragment>
      <ListItem
        selected={selected}
        className={selected ? classes.listSelected : undefined}
        onClick={() => onChange() }
        button
        style={style}
      >
        <span style={{ width: 24, height: 24 }} dangerouslySetInnerHTML={{ __html: item.icon }} />
        <ListItemText className={classes.listText} primary={name}/>
        {children&&(open ? <ExpandLess /> : <ExpandMore />)}
      </ListItem>
      {children &&
      <Collapse in={open} timeout="auto" unmountOnExit>
        {children}
      </Collapse>
      }
    </Fragment>
  );
});

export default function ListItems(props) {
  const {items,handleOpen,selectedBreadcrumb} = props;
  const depth = props.depth || 0;
  return (
    <List style={{padding: 0}}>
      {items.reduce((children, item) => {
          let breadcrumb = [...(props.breadcrumb||[])];
          if(depth===0){
            breadcrumb=[item.id];
          }else{
            breadcrumb.push(item.id);
          }
          const haveChildren = item.children && item.children.length > 0;
          const selected=breadcrumb.toString()===selectedBreadcrumb.toString();
          if (haveChildren) {
            children.push(
              <Item
                key={item.id}
                item={item}
                depth={depth}
                breadcrumb={breadcrumb}
                handleOpen={handleOpen}
                selected={selected}
              >
                {ListItems({
                  items: item.children,
                  depth: depth + 1,
                  handleOpen,
                  breadcrumb,
                  selectedBreadcrumb
                })}
              </Item>,
            );
          } else {
            children.push(
              <Item
                key={item.id}
                item={item}
                depth={depth}
                breadcrumb={breadcrumb}
                handleOpen={handleOpen}
                selected={selected}
              />,
            );
          }
          return children;
        },
        [],
      )}
    </List>
  );
}
