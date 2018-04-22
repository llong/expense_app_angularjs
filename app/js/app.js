import { routes } from './routes'
import { blankComment, capitalize } from './filters'
import { expensesFactory } from './factories'
import { mainCtrl, expenseCtrl } from './controllers'

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

export default app;
