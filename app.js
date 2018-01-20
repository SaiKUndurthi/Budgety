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
  var data = {
    allItems:{
      exp: [],
      inc: []
    },
    total:{
      exp: 0,
      inc: 0
    }
  };

  return{
    addItem: function(type, des, val){
      var newItem, ID;
      //[1,2,3,4,5] nextID =6
      //[1,2,4,6,8] nextID =9
      //ID = lastID + 1;
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
    inputAddBtn: '.add__btn'
  }
  return {
    getInput: function(){
      return{
        type : document.querySelector(DOMStrings.inputType).value, // will be either inc or exp.
        description : document.querySelector(DOMStrings.inputDescr).value,
        value : document.querySelector(DOMStrings.inputValue).value
      }
    },
    getDOMStrings : function(){
      return DOMStrings;
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
  var ctrlAddItem = function(){
    var input, newItem;
    //1. Get the field input data
     input = UICtrl.getInput();

    //2. Add the item to the budget Controller
     newItem = budgetCtrl.addItem(input.type, input.description, input.value);

    //3. Add the item to the UI


    //4. Caluclate the budgetCtrl

    //5. Display the budget on the UI
  }

  return{
    init: function(){
      console.log('Application Started !!')
      setUpEventListeners();
    }
  }


})(budgetController, UIController);

controller.init();
