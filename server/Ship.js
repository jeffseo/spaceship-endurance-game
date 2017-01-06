class Ship {
  constructor(x, y, userId) {
    this.id = userId;
    this.x = x;
    this.y = y;
    this.alive = true;
    this.name = '';
  }
}

module.exports = Ship;
