import {expenses} from './demoData';

export const expensesFactory = function($location,$routeParams) {
  return {
    getExpenses: () => {
      return expenses
    },
    addExpense: function(expense) {
      expense.id = (((1+Math.random())*0x10000)|0).toString(16).substring(1)
      expense.status = 'new'
      this.expenses.push(expense)
      $location.path('/')
    },
    expenseDetail: function(id) {
      $location.path(`/expense/${id}`)
    },
    editMode: function() {
      if(!this.editing) {
        this.editing = true
      } else {
        this.editing = false
      }
    },
    updateExpense: function(expense) {
      for(var i in this.expenses) {
        if(expenses[i].id === $routeParams.id) {
          expenses[i] = expense;
          this.editing = false;
        }
      }
    },
    removeExpense: function(expense) {
      for(var i in this.expenses) {
        if(expenses[i].id === $routeParams.id) {
          let merchant = expenses[i].merchant
          console.log(merchant, ' was removed')
          this.expenses.splice(i,1)
          $location.path('/')
        }
      }
    }
  }
}
