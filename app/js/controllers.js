/***
 mainCtrl is used to keep the state of the expenses and used as a parent controller
 for expenseCtrl
***/
export const mainCtrl = function($scope,expensesFactory) {
  $scope.expenses = expensesFactory.getExpenses();
  $scope.addExpense = expensesFactory.addExpense;
  $scope.expenseDetail = expensesFactory.expenseDetail;

  // Table Sorting
  $scope.sortType = 'merchant';
  $scope.sortReverse = false;
  $scope.searchExpense = '';


}

/***
 expenseCtrl is used to find a single expense account and edit it.
***/
export const expenseCtrl = function($scope,$routeParams,expensesFactory) {
  const expenses = expensesFactory.getExpenses();
  const expense = expenses.filter(expense => expense.id === $routeParams.id);

  // Controller State
  $scope.updateExpense = expensesFactory.updateExpense;
  $scope.editing = false;
  $scope.expense = expense[0];
  $scope.editMode = expensesFactory.editMode;
  $scope.editText = 'Edit expense';
  $scope.removeExpense = expensesFactory.removeExpense;
}
