game.things = (function(){
  var items = {
    truthfruit: {
      name: 'truthfruit',
      effects: {
        'player_inventory': { 
          message: "<p>你拿到了贡品!</p>",
          object: "addItem",
          subject: "deleteItem"
        },
        'god_of_lies': { 
          message: "<p>糟糕！你给错了贡品!</p><p>现在神生气了，一切都要从头再来!</p>",
          subject: 'deleteItem'
        },
        'god_of_change': { 
          message: "<p>糟糕！你给错了贡品!</p><p>现在神生气了，一切都要从头再来!</p>",
          subject: 'deleteItem'
        },
        'god_of_truth': { 
          message: "<p>太好了！真理之神在微笑！</p>",
          subject: 'deleteItem'        
        },
      }
    },
    
    fakefruit: {
      name: 'fakefruit',
      effects: {
        'player_inventory': { 
          message: "<p>你拿到了贡品!</p>",
          object: "addItem",
          subject: "deleteItem"
        },
        'god_of_truth': { 
          message: "<p>糟糕！你给错了贡品!</p><p>现在神生气了，一切都要从头再来!</p>",
          subject: 'deleteItem'
        },
        'god_of_change': { 
          message: "<p>糟糕！你给错了贡品!</p><p>现在神生气了，一切都要从头再来!</p>",
          subject: 'deleteItem'
        },
        'god_of_lies': { 
          message: "<p>太好了！谎言之神在微笑！</p>",
          subject: 'deleteItem'        
        },
      }
    },

    kiwi: {
      name: 'kiwi',
      effects: {
        'player_inventory': { 
          message: "<p>你拿到了贡品!</p>",
          object: "addItem",
          subject: "deleteItem"
        },
        'god_of_lies': { 
          message: "<p>糟糕！你给错了贡品!</p><p>现在神生气了，一切都要从头再来!</p>",
          subject: 'deleteItem'
        },
        'god_of_truth': { 
          message: "<p>糟糕！你给错了贡品!</p><p>现在神生气了，一切都要从头再来!</p>",
          subject: 'deleteItem'
        },
        'god_of_change': { 
          message: "<p>太好了！变化之神在微笑！</p>",
          subject: 'deleteItem'        
        },
      }
    },

    god_of_truth: {
      name: 'god_of_truth',
      effects: {
        'player_inventory': { 
          message: "<p>嘿！你无法移动神！</p>" 
        }
      }
    },

    god_of_lies: {
      name: 'god_of_lies',
      effects: {
        'player_inventory': { 
          message: "<p>嘿！你无法移动神！</p>" 
        }
      }
    },

    god_of_change: {
      name: 'god_of_change',
      effects: {
        'player_inventory': { 
          message: "<p>嘿！你无法移动神！</p>" 
        }
      }
    }
  };
    
  var get = function(name){
    return this.items[name];
  };

  var dropItemInto = function(itemNode, target){
    var sourceContext = itemNode.parentElement.parentElement.id;
    if(sourceContext !== target){
      var item = itemNode.firstChild.id;
      var itemObject = this.get(item);

      var effects;
      if (target === 'player_inventory'){
        effects = itemObject.effects[target];
      }else if(game.slide.getInventory(target)){
        effects = itemObject.effects[game.slide.getInventory(target)];
      }else{
        effects = itemObject.effects['empty'];
      };

      var targetObject;
      if (effects && effects.object){
        if(target === "player_inventory"){
          targetObject = game.playerInventory;
        }else{
          targetObject = game.slide;
        };
        targetObject[effects.object](itemObject);
      };
      if (effects && effects.subject){
        if(sourceContext === "player_inventory"){
          var sourceObject = game.playerInventory;
        }else{
          var sourceObject = game.slide;
        };
        sourceObject[effects.subject](itemObject);
      };
      if (effects && effects.message){
        game.slide.setText(effects.message);
      };
      game.screen.draw();
    };
  };

  return {
    items: items,
    get: get,
    dropItemInto: dropItemInto
  }
})();

game.slide = (function(){
  var inventory = {
    slide1: ['truthfruit','fakefruit','kiwi'],
    三神谜题: ['god_of_truth', 'god_of_lies', 'god_of_change'],
    紧急迫降: null,
    规则石碑: null
  };
  
  var addItem = function(item){
    inventory[game.slide.currentSlide()] = item.name;
  };

  var deleteItem = function(item){
    inventory[game.slide.currentSlide()] = null;
  };

  var findTextNode = function(slideId){
    return document.querySelector("#" + slideId + " .slide-text .event-text");
  };

  var getInventory = function(slideId){
    return inventory[slideId];
  };

  var setText = function(message, slideId){
    if (!slideId){
      slideId = currentSlide();
    }
    return findTextNode(slideId).innerHTML = message;
  };

  var currentSlide = function(){
    return game.stepsTaken[game.stepsTaken.length - 1];
  };

  var draw = function(slideId){
    if (!slideId){
      slideId = this.currentSlide();
    };
    var item = inventory[slideId];
    var inventoryBox = document.querySelector('#'+slideId+' .inventory-box');
    if (item === null){
      inventoryBox.innerHTML = "";
      inventoryBox.classList.add("empty");
    }
    else{
      inventoryBox.innerHTML = "<img src='"+item+".png' alt='"+item+"' class='item' id='"+item+"'>";
      inventoryBox.classList.remove("empty");
    }
  };

  return {
    addItem: addItem,
    deleteItem: deleteItem,
    setText: setText,
    getInventory: getInventory,
    draw: draw,
    currentSlide: currentSlide
  };
})();

game.playerInventory = (function(){
  var items = {
    truthfruit: false,
    fakefruit: false,
    kiwi: false,
  };

  var clearInventory = function(){
    playerInventoryBoxes = document.querySelectorAll('#player_inventory .inventory-box');
    [].forEach.call(playerInventoryBoxes, function(inventoryBox) {
      inventoryBox.classList.add("empty");
      inventoryBox.innerHTML = "";
    });
  };

  var addItem = function(item){
    if (this.items[item.name] === false){
      this.items[item.name] = true;
    };
    return this.items;
  };

  var deleteItem = function(item){
    if (this.items[item.name] === true){
      this.items[item.name] = false;
    };
    return this.items;
  };

  var draw = function(){
    clearInventory();
    var counter = 0;
    var inventoryBoxes = document.querySelectorAll('#player_inventory .inventory-box');
    for(var item in this.items){
      if(this.items[item] === true){
        inventoryBoxes[counter].classList.remove("empty");
        inventoryBoxes[counter].innerHTML = "<img src='"+item+".png' alt='"+item+"' class='item' id='"+item+"'>";
      }
      counter = counter + 1;
    };
  };

  return {
    items: items,
    addItem: addItem,
    deleteItem: deleteItem,
    draw: draw
  };
})();

game.screen = (function(){
  var draw = function(){
    game.playerInventory.draw();
    game.slide.draw(game.slide.currentSlide());
  };

  return {
    draw: draw
  }
})();
