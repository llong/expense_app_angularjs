export const routes = ($routeProvider,$locationProvider) => {
  $routeProvider
    .when('/', {
      templateUrl: '../partials/home.html',
      controller: 'mainCtrl'
    })
    .when('/expense/:id', {
      templateUrl: '../partials/expense.html',
      controller: 'mainCtrl'
    })
    .when('/new-expense', {
      templateUrl: '../partials/new-expense.html',
      controller: 'mainCtrl'
    })
    .otherwise({redirectTo:'/'})

    // Pretty URLs
    $locationProvider.html5Mode({enabled:true})
}
