class Obstacle {
  constructor(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.out = false;
  }

  move() {
    this.x -= this.speed;
  }
}

module.exports = Obstacle;
