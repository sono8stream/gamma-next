const { paths } =require('./paths');

const routes = require('next-routes')();

for (let i = 0; i < paths.length;i++) {
  routes.add(paths[i]);
}

module.exports = routes;