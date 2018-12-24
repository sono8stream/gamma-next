const routings = [
  {
    name: 'home',
    pattern: '/',
    page: '/index'
  },
  {
    name: 'blogs',
    pattern: '/blogs',
    page: '/blogs'
  },
  {
    name: 'logout',
    pattern: '/logout',
    page: '/logout'
  },
  {
    name: 'login',
    pattern: '/login',
    page: '/login'
  },
  {
    name: 'blogShow',
    pattern: '/blogs/show/:id',
    page: '/blogShow'
  },
  {
    name: 'blogEdit',
    pattern: '/blogs/edit/:id',
    page: '/blogEdit'
  },
];

let routingDict = {};

const routes = require('next-routes')();

for (let i = 0; i < routings.length;i++) {
  routes.add(routings[i]);
  routingDict[routings[i].name] = i;
}

module.exports = routes;
module.exports.href = (name, params) => {
  let path = routings[routingDict[name]].pattern;

  if (params) {
    for (let query of Object.keys(params)) {
      path = path.replace(':' + query, params[query]);
    }
  }
  return path;
}