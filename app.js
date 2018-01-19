var budgetController = (function(){

})();

var UIController = (function(){

})();

var controller = (function(budgetCtrl, UICtrl){
  var ctrlAddItem = function(){
    //1. Get the field input data

    //2. Add the item to the budget Controller

    //3. Add the item to the UI

    //4. Caluclate the budgetCtrl

    //5. Display the budget on the UI
  }

  document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);

  document.addEventListener('keyPress', function(event){
    if(event.keyCode === 13 ) // event.which === 13
    {
      ctrlAddItem();
    }
  });

})(budgetController, UIController);
