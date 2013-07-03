
var Config = {
    gameStageWidthMin : 0,
    gameStageWidthMax : 640,
    gameStageHeightMin : 0,
    gameStageHeightMax : 440,
    snakeSize : 20,
    objectSize : 20,
    sceneRefreshRate : 100
    
};

var ResourceHandler = function(){
    
    var resources = {};

    this.addImage = function(resourceId, resourcePath){
        var imageResource = new Image();
        imageResource.src = resourcePath;
        resources[resourceId] = imageResource;
    };
    
    this.get = function(resourceId){
        return resources[resourceId];
    };    
};

var Screen = function(gameSceneItem, resourceHandlerObject){
    
    var context = gameSceneItem.getContext("2d"),
    resourceHandler = resourceHandlerObject;
        
    this.clear = function(){
        context.fillStyle = "#0000aa";
        context.fillRect(0,0,Config.gameStageWidthMax,Config.gameStageHeightMax+40);
    };
    
    this.drawImage = function(resourceId,x,y,width,height){
        var resource = resourceHandler.get(resourceId);
        if(resource == undefined){
            return;
        }
        if(width != undefined && height != undefined){
            context.drawImage(resource, x,y, width, height);
        }else{
            context.drawImage(resource, x,y);    
        }  
    };
    
    this.drawCircle = function(x, y, r, color){
        context.beginPath();
        context.arc(x, y, r, 0, Math.PI*2, true); 
        context.closePath();
        context.fillStyle = color;
        context.fill();        
    };
    
    this.drawRectangle = function(x,y,width,height,color){
        c.fillStyle = color;
        c.fillRect(x,y,width,height);        
    };
  
    this.text = function(text, x, y, color){
        context.fillStyle = color;
        context.font = "italic 14pt Arial ";
        context.fillText(text, x,y);        
    };
    
    this.drawRectangle = function(x, y, width, height, color){
        context.fillStyle = color;
        context.fillRect(x,y,width,height);        
    };
    
};

var Directions = {
    "right" : 1,
    "down" : 2,
    "left" : 3,
    "up" : 4 
};

var SnakeBody = function(posX, posY, dir, resourceObject){
    var x = posX,
    y = posY,
    direction = dir,
    resource = resourceObject;
    
    this.getX = function(){
        return x;
    };
    
    this.getY = function(){
        return y;
    };
    
    this.getDirection = function(){
        return direction;
    };
    
    this.setX = function(newX){
        x = newX;
    };
    
    this.setY = function(newY){
        y = newY;
    };    
    
    this.setDirection = function(newDirection){
        direction = newDirection;
    };
};
    
var ObjectIds = {
    snake : "snakeHolder",
    snakeMeal : "snakeMeal",
    specialObjects : "specialObjects",
    scoreBoard : "scoreBoard"  
};

var SnakeHolder = function(){
  var objectId = ObjectIds.snakeHolder;  
  snakes = new Array();
  
  this.getObjectId = function(){
      return objectId;
  }  
};

var ScoreBoard = function(sceneObject){
    var scene = sceneObject,
    score = 0;
    
    this.getObjectId = function(){
        return ObjectIds.scoreBoard;
    };    
    
    this.loadResources = function(resourceHandler){
        
    };
    
    this.triggerEvent = function(event){
        
    };    
    
    this.render = function(screen){
        screen.text(score, 10, 460, "#000000");
    };
    
    this.collisionDetection = function(){        
    };
    
    this.increaseScore = function(value){
      score = score + value;
    }
}

var Snake = function(sceneObject){
    
    var resources = {
       body : "snakeBody",
       head : "snakeBody"
        
    };
    
    var initialLength = Config.snakeSize,
        body = new Array(),
        direction,
        initX = 320,
        initY = 300,
        scene = sceneObject,
        stepLength = initialLength;       

    this.init = function(){
      createBody();  
    };
    
    this.triggerEvent = function(event){
        
    };    
    
    this.loadResources = function(resourceHandler){
        resourceHandler.addImage(resources.body, "img/snakeBody.png");        
    };    
    
    this.getObjectId = function(){
        return ObjectIds.snake;
    }    
            
    var createBody = function(){
        var position;
        direction = Directions.up;
        
        position = new SnakeBody(initX, initY, Directions.up, resources.head);
        body.push(position);
        initY = initY + stepLength;
        
        for(var i=1;i<initialLength;i++){            
            position = new SnakeBody(initX, initY, Directions.up, resources.body);
            initY = initY + stepLength;
            body.push(position);
        }
    };
    
    this.getHead = function(){
        return body[0];
    }
    
    this.getBody = function(){
        return body;
    }
    
    this.updateBody = function(){
        var head = body[0];
        var nextDirection = head.getDirection();
        var snakeBodyItem;
        head.setDirection(direction);
        setBodyItemNewPosition(head);
        for(var i=1;i<body.length;i++){
            snakeBodyItem = body[i];
            var actualDirection = snakeBodyItem.getDirection();
            snakeBodyItem.setDirection(nextDirection);
            nextDirection = actualDirection;
            setBodyItemNewPosition(snakeBodyItem);

        }
    };
    
    var setBodyItemNewPosition = function(bodyItem){
        var bodyItemDirection = bodyItem.getDirection();
        switch(bodyItemDirection){
            case Directions.right:
                if(bodyItem.getX() == Config.gameStageWidthMax){
                    bodyItem.setX(Config.gameStageWidthMin);
                }else{
                    bodyItem.setX(bodyItem.getX()+stepLength);
                }
                
            break;
            
            case Directions.down:
                if(bodyItem.getY() == Config.gameStageHeightMax){
                    bodyItem.setY(Config.gameStageHeightMin);
                }else{
                    bodyItem.setY(bodyItem.getY()+stepLength);
                }
            break;
            
            case Directions.left:
                if(bodyItem.getX() == Config.gameStageWidthMin){
                    bodyItem.setX(Config.gameStageWidthMax);
                }else{
                    bodyItem.setX(bodyItem.getX()-stepLength);
                }                
            break;
            
            case Directions.up:
                if(bodyItem.getY() == Config.gameStageHeightMin){
                    bodyItem.setY(Config.gameStageHeightMax);
                }else{
                    bodyItem.setY(bodyItem.getY()-stepLength);    
                }                
            break;
        };        
    }
    
    this.collisionDetection = function(){
        var head = body[0],
            bodyItem,
            i;
            
        for(i=1;i<body.length;i++){
            bodyItem = body[i];
            if(head.getX() == bodyItem.getX() && head.getY() == bodyItem.getY()){
                alert('ooops');
                break;
            }
        }
        checkSpecialObjects();
    }
    
    var checkSpecialObjects = function(){
        var specialObjectsWrapper = scene.get(ObjectIds.specialObjects);

    }
    
    this.getPosition = function(){
        return position;
    };
            
    this.increaseLength = function(){
        var lastBodyItem = body[body.length-1];
        var newBodyItem = new SnakeBody(lastBodyItem.getX(), lastBodyItem.getY(), lastBodyItem.getDirection(), resources.body);        

        var bodyItemDirection = newBodyItem.getDirection();
        
        switch(bodyItemDirection){
            case Directions.right:
                newBodyItem.setX(newBodyItem.getX()-stepLength);
            break;
            
            case Directions.down:
                newBodyItem.setY(newBodyItem.getY()-stepLength);
            break;
            
            case Directions.left:
                newBodyItem.setX(newBodyItem.getX()+stepLength);
            break;
            
            case Directions.up:
                newBodyItem.setY(newBodyItem.getY()+stepLength);
            break;
        };
        body.push(newBodyItem);                
    };
        
    this.turnLeft = function(){
        if(direction != Directions.right){
            direction = Directions.left;
        }
    };
    
    this.turnRight = function(){
        if(direction != Directions.left){
            direction = Directions.right;
        }
    };
    
    this.turnUp = function(){
        if(direction != Directions.down){
            direction = Directions.up;
        }            
    };
    
    this.turnDown = function(){
        if(direction != Directions.up){        
            direction = Directions.down;
        }            
    };
    
    this.render = function(screen){
        var snakeBody;
        updateBody();                
        for(var i = 0; i < body.length;i++){
            snakeBody = body[i];
            screen.drawImage(resources.body, snakeBody.getX()-10,snakeBody.getY()-10);    
        }        
    };
    
    var updateBody = function(){        
        var head = body[0];
        var nextDirection = head.getDirection();
        var snakeBodyItem;
        head.setDirection(direction);
        setBodyItemNewPosition(head);
        for(var i=1;i<body.length;i++){
            snakeBodyItem = body[i];
            var actualDirection = snakeBodyItem.getDirection();
            snakeBodyItem.setDirection(nextDirection);
            nextDirection = actualDirection;
            setBodyItemNewPosition(snakeBodyItem);

        }        
    }
};

var SpecialObjectMode = {
    off : 1,
    single : 2,
    multi : 3,
    labyrinth : 4
    
};

var SpecialObjects = function(sceneObject){
    
    var 
    scene = sceneObject,
    snake,
    mode = SpecialObjectMode.off,
    objectsNum = 0,
    specialObjects = {};
    
    this.loadResources = function(resourceHandler){
        
    };    
    
    var createObjectId = function(){
        return Math.ceil(Math.random*10000);    
    };
    
    this.triggerEvent = function(event){
        
    };    
    
    var createSpecialObject = function(){
        if(mode < 5){
            return;
        }
        if(mode < 8){
            objectsNum++;
            var specialObject = new SpecialObject(createObjectId(), 10000);
            specialObject.init();
            specialObjects[specialObject.getId()] = specialObject;
            return;
        }
            objectsNum++;
            var specialObject = new Block(createObjectId(), 1000000);
            specialObject.init();
            specialObjects[specialObject.getId()] = specialObject;        
    };
    
    var removeSpecialObject = function(specialObject){
        objectsNum--;
        var id = specialObject.getId();
        delete(specialObjects[id]);
    };
    
    var generateNewMode = function(){
        mode = Math.ceil(Math.random() * 10);    
    };
    
    var preRender = function(){
        var specialObject;        
        if(mode === SpecialObjectMode.off){
            //mode = SpecialObjectMode.single;
            generateNewMode();
            console.log(mode);
            createSpecialObject();
            return;                                
        }
        for(var key in specialObjects){
            specialObject = specialObjects[key];
            if(specialObject.isDead()){
                removeSpecialObject(specialObject);
            }else{
                specialObject.decreaseLifeTime(10);
            }
        }
        if(objectsNum == 0){
            mode = SpecialObjectMode.off;
        }        
    };
    
    this.render = function(screen){
        var specialObject;
        preRender();
        for(var key in specialObjects){
            specialObject = specialObjects[key];
            specialObject.render(screen);
        }
    };
    
    this.getObjectId = function(){
        return ObjectIds.specialObjects;
    };
    
    this.collisionDetection = function(){        
    };   
    
};

var SpecialObject = function(id, lifeTimeValue){
    var x,
        y,
        id,                                                                                                         
        size = Config.objectSize,        
        lifeTime = lifeTimeValue;
    
    this.init = function(){
        x = createRandomPosition(32)
        y = createRandomPosition(22);        
    };
        
    this.getLifeTime = function(){
        return lifeTime;
    };
    
    this.isDead = function(){
        return lifeTime == 0 ? true : false;
    }
    
    this.decreaseLifeTime = function(value){
        lifeTime = lifeTime - value;
    }
    
    this.getId = function(){
        return id;    
    };    
        
    this.getX = function(){
        return x;    
    };
    
    this.getY = function(){
        return y;    
    };
    
    this.render = function(screen){
        screen.drawCircle(x,y,10,"#aaff00");
    };
        
    var createRandomPosition = function(max){
        return Math.ceil(Math.random() * max)*size;
    };

};

var Block = function(id, lifeTimeValue){
    var x,
        y,
        id,                                                                                                         
        size = Config.objectSize,        
        lifeTime = lifeTimeValue;
    
    this.init = function(){
        x = createRandomPosition(32)
        y = createRandomPosition(22);        
    };
        
    this.getLifeTime = function(){
        return lifeTime;
    };
    
    this.isDead = function(){
        return lifeTime == 0 ? true : false;
    }
    
    this.decreaseLifeTime = function(value){
        lifeTime = lifeTime - value;
    }
    
    this.getId = function(){
        return id;    
    };    
        
    this.getX = function(){
        return x;    
    };
    
    this.getY = function(){
        return y;    
    };
    
    this.render = function(screen){
        screen.drawRectangle(x,y,30,30,"#aaff00");
    };
        
    var createRandomPosition = function(max){
        return Math.ceil(Math.random() * max)*size;
    };
    
}

var SnakeMeal = function(snakeObject, sceneObject){
    
    var x,
        y,
        scene = sceneObject,
        snake = snakeObject;
        
    this.loadResources = function(resourceHandler){
        
    };
    
    this.triggerEvent = function(event){
        
    };    
    
    this.triggerEvent = function(event){
        
    };
    
    this.init = function(){
        snake = snakeObject;
        createMeal();
    };
    
    this.getObjectId = function(){
        return ObjectIds.snakeMeal;
    }
    
    var createMeal = function(){
        x = createRandomPosition(32);
        y = createRandomPosition(22);        
    }
    
    var createRandomPosition = function(max){
        return Math.ceil(Math.random() * max)*Config.objectSize;
    };
    
    this.render = function(screen){
        screen.drawCircle(x,y,10,"#aaffff");
    };
    
    this.createNewMeal = function(){
        createMeal();
    };
    
    this.collisionDetection = function(){
        var snakeHead = snake.getHead();
        if(snakeHead.getX() == x && snakeHead.getY() == y){
            createMeal();
            snake.increaseLength();
            var scoreBoard = scene.get(ObjectIds.scoreBoard);
            scoreBoard.increaseScore(1);                
        }
    };
}

var Scene = function(){
        
    var objects = {},
        screen;
    
    this.setScreen = function(screenInstance){
        screen = screenInstance;
    };
    
    this.loadResources = function(resourceHandler){
        for(var key in objects){
            var object = objects[key];
            object.loadResources(resourceHandler);
        }
    }    
    
    this.add = function(sceneObject){
        objects[sceneObject.getObjectId()] = sceneObject;
    };
        
    this.render = function(){        
        for(var key in objects){
            var sceneObject = objects[key];
            sceneObject.render(screen);            
        }
    };
    
    this.get = function(objectId){
        return objects[objectId];
    };
    
    this.remove = function(objectId){
        delete(objects[objectId])
    }
    
    this.collisionDetection = function(){
        for(var key in objects){
            var sceneObject = objects[key];
            sceneObject.collisionDetection();
        }        
    }
    
};


var Game = function(){    
    var 
    gameScene,
    scene = new Scene(),
    resourceHandler = new ResourceHandler(),
    screen,
    snake,
    gameUpdater;
    
    this.init = function(){
        gameScene = document.getElementById("gameStage");
        screen = new Screen(gameScene, resourceHandler);       
    };
    
    this.start = function(){
        snake = new Snake(scene);
        snake.init();
        addControlHandler();
        
        scene.setScreen(screen);      
        scene.add(snake);
        
        var scoreBoard = new ScoreBoard();
        scene.add(scoreBoard);
        
        var snakeMeal = new SnakeMeal(snake,scene);
        snakeMeal.init();
        scene.add(snakeMeal);        
        
        setSpecialObjects();
        scene.loadResources(resourceHandler);
        gameUpdater = setInterval(gameTurn,Config.sceneRefreshRate);
    };
    
    var setSpecialObjects = function(){
        var specialObjects = new SpecialObjects();
        scene.add(specialObjects);
    };    
    
    var addControlHandler = function(){
        window.onkeypress = controlSnake;                
    };
    
    var controlSnake = function(key){
        var keyCode = key.keyCode;
        switch(keyCode){            
            case Keys.right :            
                snake.turnRight();
            break;
            
            case Keys.down :
                snake.turnDown();
            break;            
            
            case Keys.left :
                snake.turnLeft();
            break;
            
            case Keys.up :
                snake.turnUp();
            break;
        }
    };
    
    var Keys = {
        "right" : 39,
        "down" : 40,
        "left" : 37,
        "up" : 38
    };
    
    var gameTurn = function(){        
        screen.clear();
        render();
    };
    
    var render = function(){     
      scene.render();
      scene.collisionDetection();  
    };
};


window.onload = function(){
    var game = new Game();
    game.init();
    game.start();
};