const context = require.context('./', true, /\.js$/);
const keys = context.keys().filter(item => item !== './index.js');
// -和/转驼峰命名
function getName(str) {
  return str.replace('./', '').replace('.js', '').replace(/\/(\w)/g, ($0, $1) => {
    return $1.toUpperCase();
  }).replace(/-(\w)/g, ($0, $1) => {
    return $1.toUpperCase();
  });
}
const models = [];
const getTableName=(payload)=>{
  const tableName = (payload||{}).tableName || 'table';
  if(payload){
    delete payload.tableName;
  }
  return tableName;
};
for (let i = 0; i < keys.length; i += 1) {
  const value = context(keys[i]).default;
  value.namespace = getName(keys[i]);
  value.state = {
    ...value.state,
    namespace: value.namespace,
    data: { list: [], page: {} },
    all: [],
    table: {loading:false,search:{}},
  };
  value.effects = { ...value.effects };
  value.reducers = {
    updateState(state, { payload }) {
      return { ...state, ...payload };
    },
    tableState(state, { payload }) {
      const tableName=getTableName(payload);
      const table = state[tableName] || {};
      return { ...state, [tableName]: { ...table, ...payload } };
    },
    queryState(state, { payload }) {
      const tableName=getTableName(payload);
      const table = state[tableName] || {};
      return { ...state, [tableName]: { ...table, search: { ...table.search, ...payload } } };
    },
    startLoading(state, { payload }) {
      const tableName=getTableName(payload);
      const table=state[tableName] || {};
      return { ...state, [tableName]: { ...table, loading:true } };
    },
    stopLoading(state, { payload }) {
      const tableName=getTableName(payload);
      const table=state[tableName] || {};
      return { ...state, [tableName]: { ...table, loading:false } };
    },
    resetQuery(state, { payload }) {
      const tableName=getTableName(payload);
      return { ...state, [tableName]: { ...state[tableName], search: { } } };
    },
    resetState() {
      return { ...value.state };
    },
    ...value.reducers,
  };
  models.push(value);
}
export default models;
