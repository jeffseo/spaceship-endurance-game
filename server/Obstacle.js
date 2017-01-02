class Obstacle {
  constructor(x, y, r, speed, color) {
    this.x = x;
    this.y = y;
    this.radius = r;
    this.speed = speed;
    this.color = color;
    this.out = false;
  }

  move() {
    this.x -= this.speed;
  }
}

module.exports = Obstacle;
