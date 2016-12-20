// Global variables
const GAME_HEIGHT = 320;
const GAME_WIDTH = 1.61 * GAME_HEIGHT;
const INITIAL_POSITION_X = GAME_WIDTH * .10;
const INITIAL_POSITION_Y = GAME_HEIGHT / 2;
const INITIAL_SHIP_RADIUS = 10;
const INITIAL_SHIP_SPEED = 4;
const BOOSTED_SHIP_SPEED = 6;

window.onload = () => {
  initializeCanvas();
  const game = new Game();
  game.start();
}

const initializeCanvas = () => {
  const canvas = getGameCanvas();
  canvas.width = GAME_WIDTH;
  canvas.height = GAME_HEIGHT;
}

class Drawable {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.color = "black";
    this.speed = INITIAL_SHIP_SPEED;
  }

  setContext() {
    throw new TypeError("Please implement the abstract method setContext");
  }

  draw() {
    throw new TypeError("Please implement the abstract method draw");
  }

  move() {
    throw new TypeError("Please implement the abstract method move");
  }
}

class SpaceShip extends Drawable {
  constructor(x, y, width, height, speed) {
    super(x,y);
    this.width = width;
    this.height = height;
    this.color = "#0095DD";
  }

  draw() {
    if (this.context) {
      this.context.beginPath();
      this.context.moveTo(this.x, this.y);
      this.context.lineTo(this.x - this.height, this.y - this.width);
      this.context.lineTo(this.x - this.height, this.y + this.width);
      this.context.fillStyle = this.color;
      this.context.fill();
      this.context.closePath();
    }
  }

  move() {
    if (this.controller) {
      this.setSpeedBoost();
      if (this.controller.upPressed && this.y > this.width) {
        this.y -= this.speed;
        if (this.y < this.width) {
          this.y = this.width;
        }
      }

      if (this.controller.downPressed && this.y < GAME_HEIGHT - this.width) {
        this.y += this.speed;
        if (this.y > GAME_HEIGHT - this.width) {
          this.y = GAME_HEIGHT - this.width;
        }
      }

      if (this.controller.leftPressed && this.x > this.height) {
        this.x -= this.speed;
        if (this.x < this.height) {
          this.x = this.height;
        }
      }

      if (this.controller.rightPressed && this.x < GAME_WIDTH) {
        this.x += this.speed;
        if (this.x > GAME_WIDTH) {
          this.x = GAME_WIDTH;
        }
      }
      this.draw();
    }
  }

  setSpeedBoost() {
    if (this.controller.spacePressed) {
      this.speed = BOOSTED_SHIP_SPEED;
    }
    else {
      this.speed = INITIAL_SHIP_SPEED;
    }
  }

  getVertices() {
    const v1 = [this.x, this.y];
    const v2 = [this.x - this.height, this.y - this.width];
    const v3 = [this.x - this.height, this.y + this.width];
    return [v1,v2,v3];
  }

  setContext(context) {
    this.context = context;
  }

  setController(controller) {
    this.controller = controller;
  }

  // TODO: For performance reasons, it is likely that I would have to clear a portion of the canvas eventually.
  // clear() {
  //   if (this.context) {
  //     this.context.clearRect(this.x - this.height, this.y - this.width, this.height, this.width * 2);
  //   }
  // }
}

class Obstacle extends Drawable {
  constructor(x, y, radius, color, speed) {
    super(x,y);
    this.radius = radius;
    this.color = color;
    this.speed = speed;
  }

  draw() {
    if (this.context) {
      this.context.beginPath();
      this.context.arc(this.x, this.y, this.radius, 0, Math.PI*2);
      this.context.fillStyle = this.color;
      this.context.fill();
      this.context.closePath();
    }
  }

  move() {
    this.x -= this.speed;
    this.draw();
  }

  setContext(context) {
    this.context = context;
  }
}

class Controller {
  constructor() {
    //TODO: Refactor into a dict?
    this.leftPressed = false;
    this.rightPressed = false;
    this.upPressed = false;
    this.downPressed = false;
    this.spacePressed = false;
    this.enterPressed = false;
    this.escapePressed = false;
    this.setUpControllerEvents();
  }

  setUpControllerEvents() {
    document.addEventListener("keydown", this.keyDownHandler.bind(this), false);
    document.addEventListener("keyup", this.keyUpHandler.bind(this), false);
  }

  keyDownHandler(e) {
    if (e.keyCode == 13) {
      this.enterPressed = true;
    }

    if (e.keyCode == 27) {
      this.escapePressed = true;
    }

    if (e.keyCode == 32) {
      this.spacePressed = true;
    }

    if (e.keyCode == 37) {
      this.leftPressed = true;
    } else if (e.keyCode == 38) {
      this.upPressed = true;
    } else if (e.keyCode == 39) {
      this.rightPressed = true;
    } else if (e.keyCode == 40 ) {
      this.downPressed = true;
    }
  }

  keyUpHandler(e) {
    if (e.keyCode == 13) {
      this.enterPressed = false;
    }

    if (e.keyCode == 27) {
      this.escapePressed = false;
    }

    if (e.keyCode == 32) {
      this.spacePressed = false;
    }

    if(e.keyCode == 37) {
      this.leftPressed = false;
    } else if (e.keyCode == 38) {
      this.upPressed = false;
    } else if(e.keyCode == 39) {
      this.rightPressed = false;
    } else if (e.keyCode == 40) {
      this.downPressed = false;
    }
  }

  clear() {
    this.leftPressed = false;
    this.rightPressed = false;
    this.upPressed = false;
    this.downPressed = false;
    this.spacePressed = false;
  }
}

class Game {
  constructor() {
    this.canvas = getGameCanvas();
    this.context = get2DContext();
    this.controller = new Controller();
    this.spaceShip = new SpaceShip(INITIAL_POSITION_X, INITIAL_POSITION_Y, 5, 15);
    this.spaceShip.setContext(this.context);
    this.spaceShip.setController(this.controller);
    this.obstacles = [];
    this.counter = 0;
    this.score = 0;
    this.states = {
      menu: false,
      playing: false,
      paused: false,
      end: false,
    };
    this.stateEvents = {
      menu: [],
      playing: [],
      paused: [],
      end: [],
    };
  }

  start() {
    setInterval(this.updateGame.bind(this), 15);
    this.changeState('menu');
  }

  updateGame() {
    clearCanvas();
    if (this.states.menu) {
      if (this.controller.enterPressed) {
        this.changeState('playing');
        this.clear();
      }
      this.spaceShip.move();
      this.updateObstacles();
      this.drawMenu();
    } else if (this.states.playing) {
      if (this.controller.escapePressed) {
        this.changeState('paused');
      }
      this.counter++;
      if (this.counter >= 60) {
        this.score++;
        this.counter = 0;
      }
      this.detectCollision();
      this.spaceShip.move();
      this.updateObstacles();
      this.drawScore();
    } else if (this.states.paused) {
      if (this.controller.enterPressed) {
        this.changeState('playing');
      }
      this.drawPauseScreen();
    } else if (this.states.end) {
      if (this.controller.enterPressed) {
        this.changeState('playing');
        this.clear();
      }
      this.drawEndScreen();
    }
  }

  changeState(state) {
    if (state in this.states) {
      for (let st in this.states) {
        if (this.states[st] == true) {
          this.clearStateEvents(st);
          this.states[st] = false;
        } else if (st == state) {
          this.addStateEvents(st);
          this.states[st] = true;
        }
      }
    } else {
      throw new TypeError("Invalid state!");
    }
  }

  clearStateEvents(state) {
    while(this.stateEvents[state].length != 0) {
      clearInterval(this.stateEvents[state].pop());
    }
  }

  addStateEvents(state) {
    if (state == 'menu') {
      this.stateEvents[state].push(setInterval(this.generateObstacles.bind(this), 1000));
    } else if (state == 'playing') {
      this.stateEvents[state].push(setInterval(this.generateObstacles.bind(this), 1000));
    } else if (state == 'paused') {

    } else if (state == 'end') {

    } else {
      throw new TypeError("Invalid state!");
    }
  }

  generateObstacles() {
    // generate obstacle if true
    if (Math.random() >= 0.5) {
      const randomPosition = Math.floor(Math.random() * GAME_HEIGHT);
      const randomRadius = Math.floor(Math.random() * 100) + 1;
      const randomSpeed = Math.floor(Math.random() * 5) + 1;
      const obstacle = new Obstacle(GAME_WIDTH, randomPosition, randomRadius, getRandomColor(), randomSpeed);
      obstacle.setContext(this.context);
      this.obstacles.push(obstacle);
    }
  }

  updateObstacles() {
    for (let i = 0; i < this.obstacles.length; i += 1) {
      if (this.obstacles[i].x < -this.obstacles[i].radius) {
        this.obstacles.splice(i, 1);
      }
      else {
        this.obstacles[i].move();
      }
    }
  }

  //http://www.phatcode.net/articles.php?id=459
  //TODO: Maybe include test scenario 2 and 3 from reference?
  detectCollision() {
    for (let i = 0; i < this.obstacles.length; i += 1) {
      // if (this.spaceShip.x < obstacle.x + obstacle.radius &&
      //     this.spaceShip.x > obstacle.x - obstacle.radius &&
      //     this.spaceShip.y < obstacle.y + obstacle.radius &&
      //     this.spaceShip.y > obstacle.y - obstacle.radius) {
      //   return true;
      // }
      if (this.isSpaceShipVertexWithinCircle(this.obstacles[i])){
        this.changeState('end');
      }
    }
  }

  // http://www.phatcode.net/articles.php?id=459
  // Test scenario-1: Checks if any vertices are within a circle
  isSpaceShipVertexWithinCircle(obstacle) {
    const vertices = this.spaceShip.getVertices();
    const c1x = obstacle.x - vertices[0][0];
    const c1y = obstacle.y - vertices[0][1];
    if (Math.sqrt(c1x*c1x + c1y*c1y) < obstacle.radius) {
      return true;
    }

    const c2x = obstacle.x - vertices[1][0];
    const c2y = obstacle.y - vertices[1][1];
    if (Math.sqrt(c2x*c2x + c2y*c2y) < obstacle.radius) {
      return true;
    }

    const c3x = obstacle.x - vertices[2][0];
    const c3y = obstacle.y - vertices[2][1];
    if (Math.sqrt(c3x*c3x + c3y*c3y) < obstacle.radius) {
      return true;
    }
    return false;
  }

  clear() {
    this.controller.clear();
    this.spaceShip.x = INITIAL_POSITION_X;
    this.spaceShip.y = INITIAL_POSITION_Y;
    this.obstacles = [];
    this.score = 0;
    this.counter = 0;
  }

  drawScore() {
    this.context.font = "16px Arial";
    this.context.fillStyle = "#0095DD";
    this.context.fillText(`Score: ${this.score}`, 8, 20);
  }

  drawMenu() {
    this.context.font = "32px Arial";
    this.context.fillStyle = "#0095DD";
    this.context.fillText(`Press Enter to start!`, this.canvas.width*.20, this.canvas.height/2);
  }

  drawPauseScreen() {
    this.context.font = "32px Arial";
    this.context.fillStyle = "#0095DD";
    this.context.fillText(`Paused.`, this.canvas.width*.20, this.canvas.height/4);
    this.context.fillText(`Press Enter to resume!`, this.canvas.width*.20, this.canvas.height/2);
  }

  drawEndScreen() {
    this.context.font = "32px Arial";
    this.context.fillStyle = "#0095DD";
    this.context.fillText(`Rekt. Score: ${this.score}`, this.canvas.width*.20, this.canvas.height/4);
    this.context.fillText(`Press Enter to restart!`, this.canvas.width*.20, this.canvas.height/2);
  }
}

/**
* Canvas Helper Functions
*/
const getGameCanvas = () => {
  return document.getElementById("gameCanvas");
}

const clearCanvas = () => {
  const canvas = getGameCanvas();
  get2DContext().clearRect(0, 0, canvas.width, canvas.height);
}

// return 2D rendering context: used to paint on the Canvas
const get2DContext = () => {
  return getGameCanvas().getContext("2d");
}

// http://stackoverflow.com/questions/1484506/random-color-generator-in-javascript
const getRandomColor = () => {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
