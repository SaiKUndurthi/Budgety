//BUDGET CONTROLLER
var budgetController = (function(){
  var Expense = function(id, description, value){
    this.id = id;
    this.description = description;
    this.value = value;
  }
  var Income = function(id, description, value){
    this.id = id;
    this.description = description;
    this.value = value;
  }

  var calculateTotal = function(type){
    var sum = 0;
    data.allItems[type].forEach(function(cur){
      sum += cur.value;
    });
    data.total[type] = sum;
  }

  var data = {
    allItems:{
      exp: [],
      inc: []
    },
    total:{
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: -1
  };


  return{
    addItem: function(type, des, val){
      var newItem, ID;
      //[1,2,3,4,5] nextID =6   //[1,2,4,6,8] nextID =9     //ID = lastID + 1;
      // Create new ID
      if(data.allItems[type].length > 0){
        ID = data.allItems[type][data.allItems[type].length -1].id + 1;
      }else{
        ID = 0;
      }

      // Create new items based on the type
      if(type === 'exp'){
        newItem = new Expense(ID, des, val);
      }else if (type === 'inc') {
        newItem = new Expense(ID, des, val);
      }

      // Add(Push) the items to the datastructure
      data.allItems[type].push(newItem);

      //Return the new element
      return newItem;
    },

  calculateBudget : function(){
    // calculate total income and expense
    calculateTotal('exp');
    calculateTotal('inc');
    // total budget = total income - total expense
    data.budget = data.total.inc - data.total.exp;
    // calculate the percentage of income that we spent
    if(data.total.inc > 0){
      data.percentage = Math.round((data.total.exp/data.total.inc) * 100);
    }else{
      data.percentage = -1;
    }
  },

  getBudget: function(){
    return {
      budget: data.budget,
      percentage: data.percentage,
      totalInc: data.total.inc,
      totalExp: data.total.exp
    }
  },

  testing : function(){
    console.log(data);
  }
  };

})();

//UI CONTROLLER
var UIController = (function(){

  var DOMStrings = {
    inputType: '.add__type',
    inputDescr: '.add__description',
    inputValue: '.add__value',
    inputAddBtn: '.add__btn',
    incomeContainer: '.income__list',
    expenseContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expensesLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage'
  }
  return {
    getInput: function(){
      return{
        type : document.querySelector(DOMStrings.inputType).value, // will be either inc or exp.
        description : document.querySelector(DOMStrings.inputDescr).value,
        value : parseFloat(document.querySelector(DOMStrings.inputValue).value)
      }
    },

    getDOMStrings : function(){
      return DOMStrings;
    },

    clearFields: function(){
      var fields, fieldsArr;
      fields = document.querySelectorAll(DOMStrings.inputDescr + ', ' + DOMStrings.inputValue );
      fieldsArr = Array.prototype.slice.call(fields);
      fieldsArr.forEach( function(currentVal, currentIndex, array){
        currentVal.value = ""; //Clearing the values in description and value fields.
      });
      fieldsArr[0].focus(); // Putting focus back on to the description field.
    },

    addListItem: function(obj, type){
      var html, newHtml, element;
      // Create HTML string with placeholder text

      if(type === 'inc'){
        element = DOMStrings.incomeContainer;
        html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }else if(type === 'exp'){
        element = DOMStrings.expenseContainer;
        html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      // Replace the placeholder text with some actual data
      newHtml = html.replace('%id%',obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', obj.value);

      //Insert the HTML into the DOMStrings
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },

    displayBudget: function(obj){
        document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
        document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalInc;
        document.querySelector(DOMStrings.expensesLabel).textContent = obj.totalExp;

        if(obj.percentage > 0){
          document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage+ '%';
        }else{
          document.querySelector(DOMStrings.percentageLabel).textContent = '---';
        }
    }
  }
})();

//GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl){

  var setUpEventListeners = function(){
    var DOM = UICtrl.getDOMStrings();
    document.querySelector(DOM.inputAddBtn).addEventListener('click', ctrlAddItem);
    document.addEventListener('keyPress', function(event){
      if(event.keyCode === 13 ) // event.which === 13
      {
        ctrlAddItem();
      }
    });

  }

  var updateBudget = function(){

    //1. Caluclate the budget
    budgetCtrl.calculateBudget();
    //2. Return the budget
    var budget = budgetCtrl.getBudget();

    //3. Display the budget on the UI
    UICtrl.displayBudget(budget);
  }

  var ctrlAddItem = function(){
    var input, newItem;
    //1. Get the field input data
     input = UICtrl.getInput();

     if(input.description !== "" && !isNaN(input.value) && input.value > 0){
       //2. Add the item to the budget Controller
       newItem = budgetCtrl.addItem(input.type, input.description, input.value);

       //3. Add the item to the UI
       UICtrl.addListItem(newItem, input.type);

       //4. Clear the fields after adding an expense or income
       UICtrl.clearFields();

       //5. Calculate and Update the budget
       updateBudget();
     }

  }

  return{
    init: function(){
      console.log('Application Started !!');
      UICtrl.displayBudget({
        budget: 0,
        percentage: 0,
        totalInc: 0,
        totalExp: 0
      });
      setUpEventListeners();
    }
  }


})(budgetController, UIController);

controller.init();
