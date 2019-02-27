const paths = [
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

let dict = {}

for (let i = 0; i < paths.length; i++) {
	dict[paths[i].name] = i;
}

const href = (name, params) => {
	let path = paths[dict[name]].pattern;

	if (params) {
		for (let query of Object.keys(params)) {
			path = path.replace(':' + query, params[query]);
		}
	}
	return path;
};

module.exports = { paths, href };