// Global variables
// golden ratio apparently is width = 1.61 * height
const INITIAL_SHIP_SPEED = 4;
const BOOSTED_SHIP_SPEED = 6;
let shipName = '';
const socket = io.connect('http://localhost:5000');

window.onload = () => {
  resizeCanvas();
  const game = new Game();
  game.setSocket(socket);
  game.start();
  socket.on('addShip', function(ship){
    game.addShip(ship.id, ship.x, ship.y);
  });

  socket.on('sync', function(gameServerData){
     game.receiveData(gameServerData);
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
  window.addEventListener('resize', resizeCanvas, false);
  window.addEventListener('orientationchange', resizeCanvas, false);
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
}
