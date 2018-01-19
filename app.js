var budgetController = (function(){

})();

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

var controller = (function(budgetCtrl, UICtrl){
  var DOM = UICtrl.getDOMStrings();
  var ctrlAddItem = function(){
    //1. Get the field input data
    console.log(UICtrl.getInput());

    //2. Add the item to the budget Controller

    //3. Add the item to the UI

    //4. Caluclate the budgetCtrl

    //5. Display the budget on the UI
  }

  document.querySelector(DOM.inputAddBtn).addEventListener('click', ctrlAddItem);

  document.addEventListener('keyPress', function(event){
    if(event.keyCode === 13 ) // event.which === 13
    {
      ctrlAddItem();
    }
  });

})(budgetController, UIController);
