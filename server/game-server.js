//Temporary WIDTH and HEIGHT. TODO: replace/refactor
// golden ratio apparently is width = 1.61 * height
const MAX_WIDTH = 1100;
const MAX_HEIGHT = 680;
const INIT_X_POSITION = 0;
const INIT_Y_POSITION = 0;
const Obstacle = require('./Obstacle');
const Ship = require('./Ship');

class GameServer {
  constructor() {
    this.ships = [];
    this.obstacles = [];
  }

  getData() {
    return {
      ships: this.ships,
      obstacles: this.obstacles,
    };
  }

  addShip(x, y, id) {
    const ship = new Ship(x, y, id);
    this.ships.push(ship);
    return ship;
  }

  addObstacle(obstacle) {
    this.obstacles.push(obstacle);
  }

  removeShip(shipId) {
    //remove ship object
    this.ships = this.ships.filter(ship => ship.id != shipId);
  }

  // Sync ship with new data received from client
  syncShip(newShipData) {
    this.ships.forEach((ship) => {
      if (ship.id == newShipData.id) {
        ship.x = newShipData.x;
        ship.y = newShipData.y;
      }
    });
  }

  // The app has absolute control of the balls and their movement
  syncObstacles() {
    this.obstacles.forEach((obstacle) => {
      // this.detectCollision();

      // Detect for out of bounds
      if (obstacle.x < -obstacle.radius) {
        obstacle.out = true;
      } else {
        obstacle.move();
      }
    })
  }

  destroyShip(ship) {
    ship.alive = false;
  }

  reset() {
    this.ships = [];
    this.obstacles = [];
  }

  cleanShips() {
    this.ships = this.ships.filter(ship => ship.alive);
  }

  cleanObstacles() {
    this.obstacles = this.obstacles.filter(obstacle => !obstacle.out);
  }

  generateObstacles() {
    const yPosition = Math.floor(Math.random() * MAX_HEIGHT);
    const radius = Math.floor(Math.random() * 100) + 1;
    const randomSpeed = Math.floor(Math.random() * 20) + 1;
    const obstacle = new Obstacle(MAX_WIDTH + radius, yPosition, radius, randomSpeed, getRandomColor());
    this.obstacles.push(obstacle);
  }

  isUserInGame(userId) {
    let found = false;
    this.ships.forEach((ship) => {
      if (ship.id == userId) {
        found = true;
      }
    });
    return found;
  }
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

module.exports = GameServer;
