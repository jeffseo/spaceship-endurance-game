class Controller {
  constructor(canvas) {
    this.canvas = canvas;
    this.touchEvents = [];
    this.keyCodes = {
      13: 'enter',
      27: 'escape',
      32: 'space',
      37: 'left',
      38: 'up',
      39: 'right',
      40: 'down',
    };
    this.keyPressedStatus = {};
    this.clear();
    this.setUpControllerEvents();
  }

  setUpControllerEvents() {
    document.addEventListener("keydown", this.keyDownHandler.bind(this), false);
    document.addEventListener("keyup", this.keyUpHandler.bind(this), false);
    this.canvas.addEventListener("touchstart", this.startHandler.bind(this), false);
    this.canvas.addEventListener("touchend", this.endHandler.bind(this), false);
    // this.canvas.addEventListener("touchcancel", this.cancelHandler.bind(this), false);
    this.canvas.addEventListener("touchmove", this.moveHandler.bind(this), false);
  }

  keyDownHandler(e) {
    if (e.keyCode in this.keyCodes) {
      this.keyPressedStatus[this.keyCodes[e.keyCode]] = true;
    }
  }

  keyUpHandler(e) {
    if (e.keyCode in this.keyCodes) {
      this.keyPressedStatus[this.keyCodes[e.keyCode]] = false;
    }
  }

  isKeyPressed(keyName) {
    if (keyName in this.keyPressedStatus) {
      return this.keyPressedStatus[keyName];
    }
    return false;
  }

  clear() {
    for (let code in this.keyCodes) {
      this.keyPressedStatus[this.keyCodes[code]] = false;
    }
    this.touchEvents = [];
  }

  setCanvas(canvas) {
    this.canvas = canvas;
  }

  // The following are handlers for touch events
  startHandler(e) {
    e.preventDefault();
    const touches = e.changedTouches;
    for (let i = 0; i < touches.length; i += 1) {
      this.touchEvents.unshift(this.copyTouch(touches[i]));
    }
  }

  moveHandler(e) {
    e.preventDefault();
    const touches = e.changedTouches;
    for (let i = 0; i < touches.length; i += 1) {
      this.touchEvents.unshift(this.copyTouch(touches[i]));
    }
  }

  endHandler(e) {
    e.preventDefault();
    this.touchEvents = [];
    // const touches = e.changedTouches;
    // for (let i = 0; i < touches.length; i += 1) {
    //   this.touchEvents.unshift(this.copyTouch(touches[i]));
    // }
  }

  copyTouch(touch) {
    return { identifier: touch.identifier, pageX: touch.pageX, pageY: touch.pageY };
  }
}
