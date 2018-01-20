//BUDGET CONTROLLER
var budgetController = (function(){
  var Expense = function(id, description, value){
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };
  Expense.prototype.calcPercentage = function(totalIncome){
    if(totalIncome > 0){
      this.percentage = Math.round((this.value/totalIncome) * 100);
    }else{
      this.percentage = -1;
    }
  };

  Expense.prototype.getPercentage = function(){
    return this.percentage;
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

    deleteItem: function(type, id){
      var ids, index;
      //id = 6
      //data.allItems[type][id];
      // ids = [1 2 4 6 8]
      // index =3

      ids = data.allItems[type].map(function(current){
        return current.id;
      });

      index = ids.indexOf(id);

      if(index !== -1){
        data.allItems[type].splice(index, 1);
      }

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

  calculatePercentages : function(){
    /*
    a = 20
    b = 10
    c = 40
    income  =100
    a =20%, b= 10%, c= 40%
    */

    data.allItems.exp.forEach(function(cur){
      cur.calcPercentage(data.total.inc);
    });
  },

  getPercentages: function(){
    var allPerc = data.allItems.exp.map(function(cur){
      return cur.getPercentage();
    });
    return allPerc;
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
    percentageLabel: '.budget__expenses--percentage',
    container: '.container',
    expensesPercLabel: '.item__percentage',
    dateLabel: '.budget__title--month'
  };

  var formatNumber = function(num, type){
    var numSplit, int, dec;
    /*
    + or - before number
    exactly 2 decimal points
    comma separating the thousands

    2310.4567 -> + 2,310.45
    2000 -> + 2,000.00
    */

    num = Math.abs(num);
    num = num.toFixed(2);

    numSplit = num.split(".");
    int = numSplit[0];
    if(int.length > 3){
      int = int.substr(0,int.length - 3)+","+int.substr(int.length-3, 3);
    }

    dec = numSplit[1];

    return (type === 'exp' ? '-' :  '+') + ' ' + int + '.' + dec;
  };

  var nodeListForEach = function(list, callback) {
    for(var i = 0; i < list.length; i++){
      callback(list[i], i);
    }
  };

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

    changedType : function(){
      var fields = document.querySelectorAll(
        DOMStrings.inputType + ',' +
        DOMStrings.inputDescr + ',' +
        DOMStrings.inputValue
      );

      nodeListForEach(fields, function(cur){
        cur.classList.toggle('red-focus');
      });
      document.querySelector(DOMStrings.inputAddBtn).classList.toggle('red');
    },

    displayMonth: function(){
      var now, year, months, month;
      now = new Date();
      months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      month = now.getMonth();
      year = now.getFullYear();
      document.querySelector(DOMStrings.dateLabel).textContent = months[month] + ' '+year;

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
        html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }else if(type === 'exp'){
        element = DOMStrings.expenseContainer;
        html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      // Replace the placeholder text with some actual data
      newHtml = html.replace('%id%',obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

      //Insert the HTML into the DOMStrings
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },

    deleteListItem: function(selectorId){
      var el = document.getElementById(selectorId);
      el.parentNode.removeChild(el);
    },

    displayBudget: function(obj){
      var type;
      obj.budget > 0 ? type = 'inc' : type = 'exp';
        document.querySelector(DOMStrings.budgetLabel).textContent = formatNumber(obj.budget, type);
        document.querySelector(DOMStrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
        document.querySelector(DOMStrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');

        if(obj.percentage > 0){
          document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage+ '%';
        }else{
          document.querySelector(DOMStrings.percentageLabel).textContent = '---';
        }
    },

    displayPercentages : function(percentages){
      var fields = document.querySelectorAll(DOMStrings.expensesPercLabel);

      nodeListForEach(fields, function(current, index){
        if(percentages[index] > 0){
          current.textContent = percentages[index] + '%';
        }else{
          current.textContent = '---';
        }
      });
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
    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);

  }

  var updateBudget = function(){

    //1. Caluclate the budget
    budgetCtrl.calculateBudget();
    //2. Return the budget
    var budget = budgetCtrl.getBudget();

    //3. Display the budget on the UI
    UICtrl.displayBudget(budget);
  }

  var updatePercentages = function(){
    //1. Calculate percentages
    budgetCtrl.calculatePercentages();

    //2. Read % from the budget controller
    var percentages = budgetCtrl.getPercentages();
    //3. Update the UI with new %
    UICtrl.displayPercentages(percentages);
  };

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

       //6.Calculate and update percentages
       updatePercentages();
     }

  }

  var ctrlDeleteItem = function(event){
    var itemID, splitID, type, ID;
    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
    if(itemID){
      //inc-1 or exp-1
      splitID = itemID.split('-');
      type = splitID[0];
      ID = parseInt(splitID[1]);

      //1. delete item from datastructure
      budgetCtrl.deleteItem(type, ID);

      //2. delete item from UI
      UICtrl.deleteListItem(itemID);

      //3. Update and show the new budget
      updateBudget();

      //4.Calculate and update percentages
      updatePercentages();
    }
  }

  return{
    init: function(){
      console.log('Application Started !!');
      UICtrl.displayMonth();
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
