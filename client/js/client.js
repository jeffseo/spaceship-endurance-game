// Global variables
// golden ratio apparently is width = 1.61 * height
const MAX_WIDTH = 1100;
const MAX_HEIGHT = 680;

const INITIAL_SHIP_SPEED = 4;
const BOOSTED_SHIP_SPEED = 6;
// const socket = io.connect('localhost:5000');
const socket = io.connect('https://spaceplanetattack.herokuapp.com/');
const init = () => {
  resizeCanvas();
  window.removeEventListener("load", init, false); //remove listener, no longer needed
  window.addEventListener('resize', resizeCanvas, false);
  window.addEventListener('orientationchange', resizeCanvas, false);
  window.addEventListener('beforeunload', function() { game.exitMultiplayer(); }, false);
  window.addEventListener('unload', function() { game.exitMultiplayer(); }, false);

  const game = new Game();
  game.setSocket(socket);
  game.start();
}

window.addEventListener('load', init, false);

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

const resizeCanvas = () => {
  const canvas = getGameCanvas();
  // Make it visually fill the positioned parent
  canvas.style.width ='100%';
  canvas.style.height='100%';
  if (canvas.parentNode) {
    canvas.width = canvas.parentNode.clientWidth;
  } else {
    canvas.width = window.innerWidth;
  }
  canvas.height = window.innerHeight * .75;
  if (canvas.width > MAX_WIDTH) {
    canvas.width = MAX_WIDTH;
  }
  if (canvas.height > MAX_HEIGHT) {
    canvas.height = MAX_HEIGHT;
  }
}
