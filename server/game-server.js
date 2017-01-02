//Temporary WIDTH and HEIGHT. TODO: replace/refactor
const WIDTH = 1100;
const HEIGHT = 580;
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
      if (obstacle.x < 0) {
        obstacle.out = true;
      } else {
        obstacle.move();
      }
    })
  }

  destroyShip(ship) {
    ship.alive = false;
  }

  cleanShips() {
    this.ships = this.ships.filter(ship => ship.alive);
  }

  cleanObstacles() {
    this.obstacles = this.obstacles.filter(obstacle => !obstacle.out);
  }
}

module.exports = GameServer;
