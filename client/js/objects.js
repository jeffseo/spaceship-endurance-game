class Drawable {
  constructor(x, y, color) {
    this.setCoordinates(x, y);
    this.setColor(color);
  }

  setColor(color) {
    this.color = color;
  }

  setContext(context) {
    this.context = context;
  }

  setCanvas(canvas) {
    this.canvas = canvas;
  }

  setCoordinates(x, y) {
    this.x = x;
    this.y = y;
  }

  draw() {
    throw new TypeError("Please implement the abstract method draw");
  }

  move() {
    throw new TypeError("Please implement the abstract method move");
  }
}

class SpaceShip extends Drawable {
  constructor(x, y, width, height, color, speed) {
    super(x, y, color);
    this.width = width;
    this.height = height;
    this.speed = speed;
  }

  draw() {
    if (this.context) {
      const vertices = this.getVertices();
      this.context.beginPath();
      this.context.moveTo(vertices[0][0], vertices[0][1]);
      this.context.lineTo(vertices[1][0], vertices[1][1]);
      this.context.lineTo(vertices[2][0], vertices[2][1]);
      this.context.moveTo(vertices[2][0], vertices[2][1]);
      this.context.lineTo(vertices[0][0], vertices[0][1]);
      this.context.stroke();
      this.context.fillStyle = this.color;
      this.context.fill();
      this.context.closePath();
    }
  }

  //TODO: refactor into Touch and Keyboard
  move() {
    if (this.controller && this.canvas) {
      // control for touch events
      if (this.controller.touchEvents.length >= 2) {
        const oldTouch = this.controller.touchEvents.pop();
        const newTouch = this.controller.touchEvents.pop();
        const deltaX = newTouch.pageX - oldTouch.pageX;
        if (deltaX > 0) {
          this.x -= this.speed;
        } else if (deltaX < 0) {
          this.x += this.speed;
        }

        if (this.x < this.height) {
          this.x = this.height;
        } else if (this.x > this.canvas.width) {
          this.x = this.canvas.width;
        }

        const deltaY = newTouch.pageY - oldTouch.pageY;
        if (deltaY > 0) {
          this.y += this.speed;
        } else if (deltaY < 0) {
          this.y -= this.speed;
        }

        if (this.y < this.width) {
          this.y = this.width;
        } else if (this.y > this.canvas.height - this.width) {
          this.y = this.canvas.height - this.width;
        }
      } else { //control for keyboard
        this.setSpeedBoost();
        if (this.controller.isKeyPressed('up') && this.y > this.width) {
          this.y -= this.speed;
          if (this.y < this.width) {
            this.y = this.width;
          }
        }

        if (this.controller.isKeyPressed('down') && this.y < this.canvas.height - this.width) {
          this.y += this.speed;
          if (this.y > this.canvas.height - this.width) {
            this.y = this.canvas.height - this.width;
          }
        }

        if (this.controller.isKeyPressed('left') && this.x > this.height) {
          this.x -= this.speed;
          if (this.x < this.height) {
            this.x = this.height;
          }
        }

        if (this.controller.isKeyPressed('right') && this.x < this.canvas.width) {
          this.x += this.speed;
          if (this.x > this.canvas.width) {
            this.x = this.canvas.width;
          }
        }
      }
    }
  }

  setSpeedBoost() {
    if (this.controller.isKeyPressed('space')) {
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
    super(x, y, color);
    this.radius = radius;
    this.speed = speed;
  }

  draw() {
    if (this.context) {
      this.context.beginPath();
      this.context.arc(this.x, this.y, this.radius, 0, Math.PI*2);
      this.context.fillStyle = this.color;
      this.context.fill();
      this.context.stroke();
      this.context.closePath();
    }
  }

  move() {
    this.x -= this.speed;
  }
}
