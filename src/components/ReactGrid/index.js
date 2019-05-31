/* eslint-disable */
import React, {Fragment} from 'react';
import {withStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import {CustomPaging, EditingState, PagingState,} from '@devexpress/dx-react-grid';
import {
  ColumnChooser,
  Grid,
  PagingPanel,
  Table,
  TableColumnVisibility,
  TableEditColumn,
  TableEditRow,
  TableHeaderRow,
  Toolbar,
} from '@devexpress/dx-react-grid-material-ui';
// import { Loading } from '../../../theme-sources/material-ui/components/loading';
// import { CurrencyTypeProvider } from '../../../theme-sources/material-ui/components/currency-type-provider';
import CircularProgress from "@material-ui/core/CircularProgress";
import Search from "@material-ui/icons/Search";
import {Getter} from "@devexpress/dx-react-core";
import PropTypes from "prop-types";
import {getOrCreateStore} from "utils/store";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import AddIcon from "@material-ui/icons/Add";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import CloseIcon from '@material-ui/icons/Close';
import TableCell from "@material-ui/core/TableCell";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import MuiToolbar from "@material-ui/core/Toolbar";
import notify from "utils/notify";

const styles = {
  loading: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(255, 255, 255, .3)'
  },
  loadingIcon: {
    position: 'absolute',
    fontSize: 20,
    top: 'calc(45% - 10px)',
    left: 'calc(50% - 10px)',
  },
  tableStriped: {
    '& tbody tr:nth-of-type(odd)': {
      backgroundColor: '#fafafa',
    },
  },
  spacer: {
    flex: '1 1 100%',
  },
  left: {
    flex: '0 0 auto',
  },
  right: {
    flex: '0 0 auto',
    display: 'inline-flex',
  },
  lookupEditCell: {
    // paddingTop: theme.spacing.unit * 0.875,
    // paddingRight: theme.spacing.unit,
    // paddingLeft: theme.spacing.unit,
  },
  dialog: {
    width: 'calc(100% - 16px)',
  },
  inputRoot: {
    width: '100%',
  },
};
const TableComponentBase = ({classes, ...restProps}) => (
  <Table.Table
    {...restProps}
    className={classes.tableStriped}
    style={{}}
  />
);

export const TableComponent = withStyles(styles, {name: 'TableComponent'})(TableComponentBase);
const TableRow = ({row, ...restProps}) => {
  return (
    <Table.Row
      {...restProps}
      // style={{
      //   cursor: 'pointer'
      // }}
    />
  )
};

const AddButton = ({onExecute}) => (
  <div style={{textAlign: 'center'}}>
    {/*<Button*/}
    {/*  color="primary"*/}
    {/*  onClick={onExecute}*/}
    {/*  title="Create new row"*/}
    {/*>*/}
    {/*  添加*/}
    {/*</Button>*/}
    <IconButton onClick={onExecute} title="添加" color="secondary">
      <AddIcon/>
    </IconButton>
  </div>
);

const EditButton = ({onExecute}) => (
  <IconButton onClick={onExecute} title="修改">
    <EditIcon/>
  </IconButton>
);

const DeleteButton = ({onExecute}) => (
  <IconButton
    onClick={() => {
      // eslint-disable-next-line
      if (window.confirm('Are you sure you want to delete this row?')) {
        onExecute();
      }
    }}
    title="删除"
  >
    <DeleteIcon/>
  </IconButton>
);

const CommitButton = ({onExecute}) => (
  <IconButton onClick={onExecute} title="保存">
    <SaveIcon/>
  </IconButton>
);

const CancelButton = ({onExecute}) => (
  <IconButton color="secondary" onClick={onExecute} title="取消">
    <CloseIcon/>
  </IconButton>
);

const commandComponents = {
  add: AddButton,
  edit: EditButton,
  delete: DeleteButton,
  commit: CommitButton,
  cancel: CancelButton,
};
const LookupEditCellBase = ({availableColumnValues, value, onValueChange, classes}) => (
  <TableCell
    className={classes.lookupEditCell}
  >
    <Select
      value={value}
      onChange={event => onValueChange(event.target.value)}
      input={(
        <Input
          classes={{root: classes.inputRoot}}
        />
      )}
    >
      {availableColumnValues.map(item => (
        <MenuItem key={item} value={item}>
          {item}
        </MenuItem>
      ))}
    </Select>
  </TableCell>
);
export const LookupEditCell = withStyles(styles, {name: 'ControlledModeDemo'})(LookupEditCellBase);

// const Cell = (props) => {
//   const { column } = props;
//   // if (column.name === 'discount') {
//   //   return <ProgressBarCell {...props} />;
//   // }
//   // if (column.name === 'amount') {
//   //   return <HighlightedCell {...props} />;
//   // }
//   return <Table.Cell {...props} />;
// };

const EditCell = (props) => {
  const {column, value, tableRow: {type}} = props;
  if (type.description === 'edit') {
    if (column.name === '' || column.disableEdit) {
      return <TableCell>{value}</TableCell>
    } else {
      return <TableEditRow.Cell {...props} />;
    }
  } else {
    if (column.name === '' || column.disableEdit) {
      return <TableCell/>
    } else {
      return <TableEditRow.Cell {...props} />;
    }
  }
};

const Root = props => <Grid.Root {...props} style={{minWidth: 600}}/>;
const TableRoot = props => <Table.Container {...props} style={{height: '100%'}}/>;

class ReactGrid extends React.PureComponent {
  constructor(props) {
    super(props);

    const defaultState = {
      rows: [],
      currencyColumns: ['SaleAmount'],
      columnExtensions: [],
      sorting: [],
      totalCount: 0,
      pageSize: 20,
      pageSizes: [20, 50, 100],
      currentPage: 0,
      loading: true,
      selection: [],
      editingRowIds: [],
      addedRows: [],
      rowChanges: {},
      columnOrder: ['OrderNumber', 'OrderDate', 'StoreCity', 'Employee', 'SaleAmount'],
      columnWidths: [
        {columnName: 'OrderNumber', width: 180},
        {columnName: 'OrderDate', width: 180},
        {columnName: 'StoreCity', width: 180},
        {columnName: 'Employee', width: 180},
        {columnName: 'SaleAmount', width: 180},
      ],
      hiddenColumnNames: [],
    };

    const {columns, tableName, disableEdit,required, data: {namespace}} = this.props;
    const render = (render, row, column) => {
      return render(row[column], row, column)
    };
    const newColumns = columns.map(it => {
      return {
        name: it.key,
        title: it.title,
        getCellValue: it.render ? (row, column) => render(it.render, row, column) : undefined,
        disableEdit: disableEdit.indexOf(it.key) !== -1,
        required: required.indexOf(it.key) !== -1,
      }
    });
    const columnExtensions = columns.filter(it => it.align || it.width || it.wordWrapEnabled)
      .map(it => {
        return {columnName: it.key, align: it.align, width: it.width, wordWrapEnabled: it.wordWrapEnabled}
      });
    const sorting = columns.filter(it => it.sorting)
      .map(it => {
        return {columnName: it.key, direction: it.sorting}
      });
    const state = {columns: newColumns, columnExtensions, sorting};
    this.state = {...defaultState, ...state};

    this.changeSorting = this.changeSorting.bind(this);
    this.changeCurrentPage = this.changeCurrentPage.bind(this);
    this.changePageSize = this.changePageSize.bind(this);
    this.changeAddedRows = this.changeAddedRows.bind(this);
    this.changeEditingRowIds = this.changeEditingRowIds.bind(this);
    this.changeRowChanges = this.changeRowChanges.bind(this);
    this.commitChanges = this.commitChanges.bind(this);
    this.changeColumnOrder = this.changeColumnOrder.bind(this);

  }

  componentDidMount() {
  }

  dispatch = (dispatch) => {
    getOrCreateStore().dispatch(dispatch);
  };

  handleSearch() {
    const {data: {namespace}, queryAction} = this.props;
    this.dispatch({type: `${namespace}/${queryAction}`});
  }

  changeCurrentPage(currentPage) {
    const {data: {namespace}, tableName, queryAction} = this.props;
    this.dispatch({type: `${namespace}/queryState`, payload: {tableName, pageNum: currentPage + 1}});
    this.dispatch({type: `${namespace}/${queryAction}`});
  }

  changePageSize(pageSize) {
    const {data: {namespace}, tableName, queryAction} = this.props;
    this.dispatch({type: `${namespace}/queryState`, payload: {tableName, pageSize}});
    this.dispatch({type: `${namespace}/${queryAction}`});
  }

  changeSearchValue(q) {
    const {data: {namespace}, tableName, queryAction} = this.props;
    this.dispatch({type: `${namespace}/queryState`, payload: {tableName, q}});
    this.dispatch({type: `${namespace}/${queryAction}`});
  }


  changeSorting(sorting) {
    // this.setState({
    //   loading: true,
    //   sorting,
    // });
  }

  changeAddedRows(addedRows) {
    const initialized = addedRows.map(row => (Object.keys(row).length ? row : {city: 'Tokio'}));
    this.setState({addedRows: initialized});
  }

  changeEditingRowIds(editingRowIds) {
    this.setState({editingRowIds});
  }

  changeRowChanges(rowChanges) {
    this.setState({rowChanges});
  }

  commitChanges(d) {
    const {added, changed, deleted} = d;
    const {data: {namespace, data}} = this.props;
    const {columns}=this.state;
    if (added) {
      const item=added[0];
      for (const index in columns) {
        const column=columns[index];
        if(column.required===true&&(item[column.key]===undefined||item[name]==='')){
          notify.warning(`${column.title}不能为空`);
          return;
        }
      }
      this.dispatch({type: `${namespace}/insert`, payload: item});
    }
    if (changed) {
      const first=Object.keys(changed)[0];
      const item = data.list.filter(it => it.id.toString() === first.toString())[0];
      this.dispatch({
        type: `${namespace}/update`,
        payload: {...item, ...changed[first]}
      });
    }
    if (deleted) {
      this.dispatch({type: `${namespace}/delete`, payload: deleted});
    }
  }

  changeColumnOrder(newOrder) {
    this.setState({columnOrder: newOrder});
  }

  changeColumnWidths = (columnWidths) => {
    this.setState({columnWidths});
  };
  hiddenColumnNamesChange = (hiddenColumnNames) => {
    this.setState({hiddenColumnNames});
  };
  changeSelection = selection => this.setState({selection});

  changeFilters(filters) {
    console.log(filters);
  }

  renderToolbar = (items) => {
    return items.map(it => {
      if (it.name === 'search') {
        return <Input
          key={it.name}
          placeholder={it.placeholder || 'Search...'}
          // onChange={e => this.changeSearchValue(e.target.value)}
          type="text"
          onKeyDown={e => {
            if (e.keyCode === 13) {
              this.changeSearchValue(e.target.value)
            }
          }}
          startAdornment={
            <InputAdornment position="start">
              <Search onClick={() => this.handleSearch()} style={{cursor: 'pointer'}}/>
            </InputAdornment>
          }
        />
      }
      return <Fragment key={it.name}>{it.render}</Fragment>
    })
  };

  render() {
    const {
      columns,
      columnExtensions,
      pageSizes,
      editingRowIds,
      addedRows,
      rowChanges,
      hiddenColumnNames
    } = this.state;
    const {classes, data, tableName, enableLoading, showHeader, showPage, toolbar, search, edit} = this.props;
    const {list, page: {total, pageNum, pageSize}} = data.data;
    const {showAdd = true, showEdit = true, showDelete = true} = edit;
    const enableEdit = edit.enable === undefined || edit.enable;
    const {loading} = data[tableName];

    const Command = ({id,onExecute}) => {
      const CommandButton = commandComponents[id];
      const execute=()=>{

        onExecute()
      };
      return (
        <CommandButton
          onExecute={execute}
        />
      );
    };

    return (
      <Paper style={{position: 'relative', overflow: 'auto', minWidth: 800}}>
        {/*style={{borderBottom: '1px solid rgba(224, 224, 224, 1)'}}*/}
        {toolbar.length > 0 &&
        <MuiToolbar>
          <div className={classes.left}>
            {this.renderToolbar(toolbar.filter(it => it.align === undefined || it.align === 'left'))}
          </div>
          <div className={classes.spacer}/>
          <div className={classes.right}>
            {this.renderToolbar(toolbar.filter(it => it.align === 'right'))}
          </div>
        </MuiToolbar>
        }
        <Grid
          rows={list}
          columns={columns}
          // rootComponent={Root}
          getRowId={row => row.id}
        >
          {/*<SortingState*/}
          {/*  sorting={sorting}*/}
          {/*  onSortingChange={this.changeSorting}*/}
          {/*  // columnExtensions={sortingStateColumnExtensions}*/}
          {/*  // defaultSorting={[{ columnName: 'StoreCity', direction: 'asc' }]}*/}
          {/*/>*/}


          {/*<SearchState*/}
          {/*  onValueChange={this.changeSearchValue}*/}
          {/*/>*/}

          {/*<SearchPanel />*/}

          {/*<SelectionState*/}
          {/*  selection={selection}*/}
          {/*  onSelectionChange={this.changeSelection}*/}
          {/*/>*/}
          {/*<IntegratedSelection />*/}


          {enableEdit &&
          <EditingState
            editingRowIds={editingRowIds}
            onEditingRowIdsChange={this.changeEditingRowIds}
            rowChanges={rowChanges}
            onRowChangesChange={this.changeRowChanges}
            addedRows={addedRows}
            onAddedRowsChange={this.changeAddedRows}
            onCommitChanges={this.commitChanges}
          />
          }
          {/*<DragDropProvider />*/}
          {showPage &&
          <PagingState
            currentPage={pageNum - 1}
            onCurrentPageChange={this.changeCurrentPage}
            pageSize={pageSize}
            onPageSizeChange={this.changePageSize}
          />
          }
          {showPage &&
          <CustomPaging
            totalCount={total}
          />
          }
          {/*<FilteringState*/}
          {/*  onFiltersChange={this.changeFilters}*/}
          {/*/>*/}
          <Table
            // height="auto"
            // containerComponent={TableRoot}
            columnExtensions={columnExtensions}
            tableComponent={TableComponent}
            rowComponent={TableRow}
            noDataRowComponent={() => <Fragment/>}
            // cellComponent={Cell}
          />
          {/*<Toolbar rootComponent={(props)=><Toolbar.Root {...props}/>}/>*/}
          {/*<div>*/}

          {/*</div>*/}

          {/*<TableColumnVisibility*/}
          {/*  hiddenColumnNames={hiddenColumnNames}*/}
          {/*  onHiddenColumnNamesChange={this.hiddenColumnNamesChange}*/}
          {/*/>*/}
          {/*<ColumnChooser/>*/}

          {showHeader && <TableHeaderRow/>}
          {showPage && <PagingPanel
            containerComponent={
              (props) => <PagingPanel.Container {...props} style={{padding: '1px 12px'}}/>
            }
            pageSizes={pageSizes}
          />}
          {/*<TableFilterRow />*/}
          {/*<TableColumnReordering*/}
          {/*  order={columnOrder}*/}
          {/*  onOrderChange={this.changeColumnOrder}*/}
          {/*/>*/}
          {/*<TableColumnResizing*/}
          {/*  columnWidths={columnWidths}*/}
          {/*  onColumnWidthsChange={this.changeColumnWidths}*/}
          {/*/>*/}

          {/*<TableHeaderRow showSortingControls/>*/}
          {enableEdit &&
          <TableEditRow
            cellComponent={EditCell}
          />
          }
          {enableEdit &&
          <TableEditColumn
            showAddCommand={showAdd && !addedRows.length}
            showEditCommand={showEdit}
            showDeleteCommand={showDelete}
            commandComponent={Command}
          />
          }
          {/*<TableSelection showSelectAll />*/}
          {enableEdit &&
          <Getter
            name="tableColumns"
            computed={({tableColumns}) => [
              ...tableColumns.filter(c => c.type !== TableEditColumn.COLUMN_TYPE),
              {key: 'editCommand', type: TableEditColumn.COLUMN_TYPE}
            ]
            }
          />
          }
        </Grid>
        {enableLoading && loading && <div className={classes.loading}>
          <CircularProgress className={classes.loadingIcon}/>
        </div>}
      </Paper>
    );
  }
}

//columns
// { name: 'OrderNumber', title: '订单',align:'left',width:10,wordWrapEnabled: true,sorting:'desc' },
ReactGrid.propTypes = {
  queryAction: PropTypes.string.isRequired,
  columns: PropTypes.array.isRequired,
  // mode: PropTypes.oneOf(['all', 'row', 'modal', 'false']),
  search: PropTypes.object.isRequired,
  tableName: PropTypes.string.isRequired,
};
ReactGrid.defaultProps = {
  queryAction: 'list',
  search: {},
  // mode: 'all',
  // keyName: 'id',
  tableName: 'table',
  // showCheck: true,
  showHeader: true,
  showPage: true,
  toolbar: [],
  edit: {
    showAdd: true,
    showEdit: true,
    showDelete: true,
  },
  disableEdit: [],
  // userPaper: true,
  // listAction: 'list',
  enableLoading: true,
};
export default withStyles(styles)(ReactGrid);
