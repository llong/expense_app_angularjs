import { routes } from './routes'
import { blankComment, capitalize } from './filters'
import { expensesFactory } from './factories'
import { mainCtrl, expenseCtrl, loginCtrl } from './controllers'

const app = angular.module('app', ['ngRoute'])

// Setup Routing
app.config(routes)

// Setup Filters
app.filter('blankComment', blankComment)
app.filter('capitalize', capitalize)

// Setup Factories
app.factory('expensesFactory', expensesFactory)

// Main Controller for expenses
app.controller('mainCtrl', mainCtrl)
app.controller('expenseCtrl', expenseCtrl)
app.controller('loginCtrl', loginCtrl)

export default app;
