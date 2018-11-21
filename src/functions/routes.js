const routes = module.exports = require('next-routes')();

routes
  .add('/','/blogs')
  .add('logout', '/logout', '/logout')
  .add('login', '/login', '/ufehguorhgodfuvhu')
  .add('blogShow', '/blogs/show/:id', '/blogShow')
  .add('blogEdit', '/blogs/edit/:id', '/blogEdit');