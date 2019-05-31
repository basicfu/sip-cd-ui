const config = {
  port: 6101,
  title: '初妆云',
  app: 'tb',
  appSecret: 'tb',
  redirectPath: {},
  customPath: {
    '/': '/index',
  },
  router: {
    '/login': {sidebar: false, navbar: false},
    '/buy': {sidebar: false, navbar: true},
    '/pay': {sidebar: false, navbar: true},
    '/done': {sidebar: false, navbar: true},
  },
};
module.exports = config;
