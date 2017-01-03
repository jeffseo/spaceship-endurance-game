// Global variables
// golden ratio apparently is width = 1.61 * height
const MAX_WIDTH = 1100;
const MAX_HEIGHT = 680;

const INITIAL_SHIP_SPEED = 4;
const BOOSTED_SHIP_SPEED = 6;
const socket = io.connect('https://keplerplanetattack.herokuapp.com');
const init = () => {
  window.removeEventListener("load", init, false); //remove listener, no longer needed
  resizeCanvas();
  const game = new Game();
  game.setSocket(socket);
  game.start();
  window.addEventListener('resize', resizeCanvas, false);
  window.addEventListener('orientationchange', resizeCanvas, false);
  window.addEventListener('beforeunload', function() { game.exitMultiplayer(); }, false);

  socket.on('addShip', function(ship){
    if (!game.isSinglePlayer) {
      game.addShip(ship.id, ship.x, ship.y);
    }
  });

  socket.on('sync', function(gameServerData){
    if (!game.isSinglePlayer) {
     game.receiveData(gameServerData);
   }
  });

  // socket.on('killShip', function(shipData){
  //   if (!game.isSinglePlayer) {
  //   	game.killShip(shipData);
  //   }
  // });

  socket.on('removeShip', function(shipId){
    if (!game.isSinglePlayer) {
       game.removeShip(shipId);
     }
  });
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
