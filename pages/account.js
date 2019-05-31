import React from 'react';
import {withStyles} from '@material-ui/core/styles';
// import {withStyles} from '@material-ui/icons/ArrowDo';
import {connect} from 'dva';
import ReactGrid from 'components/ReactGrid';
import Component from "components/Component";
import {formatDateTime} from "utils/index";
import {FieldType} from "utils/enum";

const namespace = "account";
const styles = {};

const status = {
  NO_AUTH: {label: "未授权", color: '#51d2b7'},
  ONLINE: {label: "在线", color: '#ad65bb'},
  OFFLINE: {label: "离线", color: '#fed74c'},
};

class Index extends Component {
  componentDidMount() {
    this.dispatch({type: `${namespace}/list`});
  }

  componentWillUnmount() {
    this.resetState(namespace);
  }

  formatStatus = (value) => {
    const item = status[value] || {label: '未知'};
    return <label style={{color: item.color}}>{item.label}</label>;
  };

  formatOperation = (value,row) => {
    const url = `https://login.taobao.com/member/login.jhtml?style=mini&username=${row.username}&password=${row.password}`;
    return <label onClick={() => window.open(url)} style={{cursor:'pointer',color:'#2196f3'}}>授权</label>;
  };

  render() {
    const {data} = this.props;
    const tableProps = {
      data,
      columns: [
        {key: 'username', title: '账号', type: FieldType.TEXT},
        {key: 'password', title: '密码'},
        {key: 'createTime', title: '创建时间', render: formatDateTime},
        {key: 'updateTime', title: '更新时间', render: formatDateTime},
        {key: 'status', title: '状态', render: this.formatStatus},
        {key: '', title: '操作', render: this.formatOperation},
      ],
      edit:{showDelete: false},
      required: ['username', 'password'],
      disableEdit:['createTime','updateTime','status'],
      addDefaultValue: {
        username: 'a'
      },
      toolbar: [
        {name: 'search', placeholder: '账号'},
        // {name: 'create', align: 'right', render: <Button variant="contained" color="primary" onClick={()=>window.open("/buy")}>创&nbsp;建</Button> }
      ]
    };
    return (
      <ReactGrid {...tableProps}/>
    );
  }
}

export default connect(state => ({
  data: state[namespace],
}))(withStyles(styles)(Index));
