// Global variables
const GAME_WIDTH = 480;
const GAME_HEIGHT = 320;
const INITIAL_POSITION_X = GAME_WIDTH * .10;
const INITIAL_POSITION_Y = GAME_HEIGHT / 2;
const INITIAL_SHIP_RADIUS = 10;

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
    this.speed = 2;
  }

  draw() {
    throw new TypeError("Please implement the abstract method draw");
  }

  move() {
    throw new TypeError("Please implement the abstract method move");
  }
}

class SpaceShip extends Drawable {
  constructor(x, y, radius) {
    super(x,y);
    this.radius = radius;
    this.color = "#0095DD";
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
    if (this.controller) {
      if (this.controller.upPressed && this.y > this.radius) {
        this.y -= this.speed;
      }

      if (this.controller.downPressed && this.y < GAME_HEIGHT-this.radius) {
        this.y += this.speed;
      }

      if (this.controller.leftPressed && this.x > this.radius) {
        this.x -= this.speed;
      }

      if (this.controller.rightPressed && this.x < GAME_WIDTH-this.radius) {
        this.x += this.speed;
      }
      this.draw();
    }
  }
}

class Obstacle extends Drawable {
  constructor(x, y, radius) {
    super(x,y);
    this.radius = radius;
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
}

class Controller {
  constructor() {
    this.leftPressed = false;
    this.rightPressed = false;
    this.upPressed = false;
    this.downPressed = false;
    this.setUpControllerEvents();
  }

  setUpControllerEvents() {
    document.addEventListener("keydown", this.keyDownHandler.bind(this), false);
    document.addEventListener("keyup", this.keyUpHandler.bind(this), false);
  }

  keyDownHandler(e) {
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
}

class Game {
  constructor() {
    this.canvas = getGameCanvas();
    this.context = get2DContext();
    this.controller = new Controller();
    this.spaceShip = new SpaceShip(INITIAL_POSITION_X, INITIAL_POSITION_Y, INITIAL_SHIP_RADIUS);
    this.spaceShip.context = this.context;
    this.spaceShip.controller = this.controller;
    this.obstacles = [];
  }

  start() {
    setInterval(this.updateGame.bind(this), 10);
    setInterval(this.generateObstacles.bind(this), 1000);
  }

  updateGame() {
    clearCanvas();
    this.spaceShip.move();
    this.updateObstacles();
    if (this.isCollision()) {
      this.restart();
    }
  }

  generateObstacles() {
    // generate obstacle if true
    if (Math.random() >= 0.5) {
      const randomPosition = Math.floor(Math.random() * GAME_HEIGHT);
      const randomRadius = Math.floor(Math.random() * 100) + 1;
      const randomSpeed = Math.floor(Math.random() * 10) + 1;
      const obstacle = new Obstacle(GAME_WIDTH, randomPosition, randomRadius);
      obstacle.speed = randomSpeed;
      obstacle.context = this.context;
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

  isCollision() {
    for (let i = 0; i < this.obstacles.length; i += 1) {
      if (this.spaceShip.x < this.obstacles[i].x + this.obstacles[i].radius &&
          this.spaceShip.x + this.spaceShip.radius > this.obstacles[i].x &&
          this.spaceShip.y < this.obstacles[i].y + this.obstacles[i].radius &&
          this.spaceShip.y + this.spaceShip.radius > this.obstacles[i].y - this.obstacles[i].radius) {
        return true;
      }
    }
    return false;
  }

  restart() {
    document.location.reload();
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
