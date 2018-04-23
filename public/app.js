(function() {
  'use strict';

  var globals = typeof global === 'undefined' ? self : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = {}.hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    return aliases[name] ? expandAlias(aliases[name]) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (bundle && typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = typeof window === 'undefined' ? this : window;
var process;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};
require.register("initialize.js", function(exports, require, module) {
'use strict';

var _angular = require('angular/angular');

var _angular2 = _interopRequireDefault(_angular);

var _angularRoute = require('angular-route');

var _angularRoute2 = _interopRequireDefault(_angularRoute);

var _app = require('./js/app');

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

document.addEventListener('DOMContentLoaded', function () {
  // do your setup here
  console.log('Initialized app');
});
});

require.register("js/app.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _routes = require('./routes');

var _filters = require('./filters');

var _factories = require('./factories');

var _controllers = require('./controllers');

var app = angular.module('app', ['ngRoute']);

// Setup Routing
app.config(_routes.routes);

// Setup Filters
app.filter('blankComment', _filters.blankComment);
app.filter('capitalize', _filters.capitalize);

// Setup Factories
app.factory('expensesFactory', _factories.expensesFactory);

// Main Controller for expenses
app.controller('mainCtrl', _controllers.mainCtrl);
app.controller('expenseCtrl', _controllers.expenseCtrl);
app.controller('loginCtrl', _controllers.loginCtrl);

exports.default = app;
});

require.register("js/controllers.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/******************************************************************************************
 mainCtrl is used to keep the state of the expenses and used as a parent controller
 for expenseCtrl
******************************************************************************************/
var mainCtrl = exports.mainCtrl = function mainCtrl($scope, expensesFactory) {
  expensesFactory.auth();
  //Comment out $scope.expenses on line 8 to remove demoData
  $scope.expenses = expensesFactory.getExpenses();
  $scope.addExpense = expensesFactory.addExpense;
  $scope.expenseDetail = expensesFactory.expenseDetail;
  $scope.logout = expensesFactory.logout;

  // Table Sorting
  $scope.sortType = 'merchant';
  $scope.sortReverse = false;
};

/******************************************************************************************
 expenseCtrl is used to find a single expense account and edit it.
*******************************************************************************************/
var expenseCtrl = exports.expenseCtrl = function expenseCtrl($scope, $routeParams, expensesFactory) {
  var expenses = expensesFactory.getExpenses();
  var expense = expenses.filter(function (expense) {
    return expense.id === $routeParams.id;
  });

  // Controller State
  $scope.updateExpense = expensesFactory.updateExpense;
  $scope.editing = false;
  $scope.expense = expense[0];
  $scope.editMode = expensesFactory.editMode;
  $scope.editText = 'Edit expense';
  $scope.removeExpense = expensesFactory.removeExpense;
};

/******************************************************************************************
 LoginCtrl is used for simple clientside authentication
******************************************************************************************/
var loginCtrl = exports.loginCtrl = function loginCtrl($scope, $location) {
  $scope.loginfail = null;

  $scope.login = function (user) {
    console.log($scope.user);
    localStorage.setItem("user", JSON.stringify($scope.user));
    console.log(JSON.parse(localStorage.getItem("user")));
    var loginCred = JSON.parse(localStorage.getItem("user"));

    if (loginCred.password === "demo" && loginCred.username === "demo") {
      console.log('sucesss');
      $location.path('/');
    } else {
      console.log('wrong');
      $scope.loginFail = true;
    }
  };
};
});

;require.register("js/demoData.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var expenses = exports.expenses = [{
  id: 'dkjfldkfj349dk',
  merchant: 'Google',
  amount: 5000,
  date: new Date(),
  comments: '',
  status: 'new'
}, {
  id: 'rirkdo3di3d',
  merchant: 'Microsoft',
  amount: 2000,
  date: new Date(),
  comments: '',
  status: 'new'
}, {
  id: 'dmeidk39dk3',
  merchant: 'Amazon',
  amount: 1500,
  date: new Date(),
  comments: '',
  status: 'reimbursed'
}, {
  id: 'cmeod04dk2ws',
  merchant: 'Apptricity',
  amount: 9000,
  date: new Date(),
  comments: 'cool studlfjdlkfjdlksfjlkdsjflkdsjfdslkfjdlskfff',
  status: 'reimbursed'
}];
});

;require.register("js/factories.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.expensesFactory = undefined;

var _demoData = require('./demoData');

var expensesFactory = exports.expensesFactory = function expensesFactory($location, $routeParams) {
  return {
    getExpenses: function getExpenses() {
      return _demoData.expenses;
    },
    addExpense: function addExpense(expense) {
      expense.id = ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
      expense.status = 'new';
      this.expenses.push(expense);
      $location.path('/');
    },
    expenseDetail: function expenseDetail(id) {
      $location.path('/expense/' + id);
    },
    editMode: function editMode() {
      if (!this.editing) {
        this.editing = true;
      } else {
        this.editing = false;
      }
    },
    updateExpense: function updateExpense(expense) {
      for (var i in this.expenses) {
        if (_demoData.expenses[i].id === $routeParams.id) {
          _demoData.expenses[i] = expense;
          this.editing = false;
        }
      }
    },
    removeExpense: function removeExpense(expense) {
      for (var i in this.expenses) {
        if (_demoData.expenses[i].id === $routeParams.id) {
          var merchant = _demoData.expenses[i].merchant;
          console.log(merchant, ' was removed');
          this.expenses.splice(i, 1);
          $location.path('/');
        }
      }
    },
    auth: function auth() {
      var userCred = JSON.parse(localStorage.getItem("user")) || {};
      if (userCred.username === "demo" && userCred.password === "demo") {
        console.log('sucessfully logged in');
      } else {
        $location.path('/login');
      }
    },
    logout: function logout() {
      localStorage.removeItem("user");
      $location.path('/login');
    }
  };
};
});

;require.register("js/filters.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var blankComment = exports.blankComment = function blankComment() {
  return function (value) {
    return value === '' ? 'No comments' : value;
  };
};

var capitalize = exports.capitalize = function capitalize() {
  return function (input, all) {
    var reg = all ? /([^\W_]+[^\s-]*) */g : /([^\W_]+[^\s-]*)/;
    return !!input ? input.replace(reg, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }) : '';
  };
};
});

;require.register("js/routes.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var routes = exports.routes = function routes($routeProvider, $locationProvider) {
  $routeProvider.when('/', {
    templateUrl: '../partials/home.html',
    controller: 'mainCtrl'
  }).when('/login', {
    templateUrl: '../partials/login.html',
    controller: 'loginCtrl'
  }).when('/expense/:id', {
    templateUrl: '../partials/expense.html',
    controller: 'mainCtrl'
  }).when('/new-expense', {
    templateUrl: '../partials/new-expense.html',
    controller: 'mainCtrl'
  }).otherwise({ redirectTo: '/' });

  // Pretty URLs
  //$locationProvider.html5Mode({enabled:true})
};
});

;require.alias("process/browser.js", "process");process = require('process');require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');


//# sourceMappingURL=app.js.map