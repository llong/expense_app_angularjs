/******************************************************************************************
 mainCtrl is used to keep the state of the expenses and used as a parent controller
 for expenseCtrl
******************************************************************************************/
export const mainCtrl = function($scope,expensesFactory) {
  expensesFactory.auth();
  //Comment out $scope.expenses on line 8 to remove demoData
  $scope.expenses = expensesFactory.getExpenses();
  $scope.addExpense = expensesFactory.addExpense;
  $scope.expenseDetail = expensesFactory.expenseDetail;
  $scope.logout = expensesFactory.logout;

  // Table Sorting
  $scope.sortType = 'merchant';
  $scope.sortReverse = false;
}

/******************************************************************************************
 expenseCtrl is used to find a single expense account and edit it.
*******************************************************************************************/
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


/******************************************************************************************
 LoginCtrl is used for simple clientside authentication
******************************************************************************************/
export const loginCtrl = function($scope,$location) {
  $scope.loginfail = null;

  $scope.login = function(user) {
    console.log($scope.user)
    localStorage.setItem("user", JSON.stringify($scope.user))
    console.log(JSON.parse(localStorage.getItem("user")))
    let loginCred = JSON.parse(localStorage.getItem("user"))

    if(loginCred.password === "demo" && loginCred.username === "demo") {
      console.log('sucesss')
      $location.path('/')
    } else {
      console.log('wrong')
      $scope.loginFail = true;
    }
  }
}
