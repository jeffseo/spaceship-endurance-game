const app = require('./app'),
      gameServer = require('./server/game-server');

const server = app.listen(app.get('port'), function () {
  console.log(`App listening on port ${app.get('port')}`);
})

/* Socket.IO server set up. */
//http://rubentd.com/blog/creating-a-multiplayer-game-with-node-js/
//https://github.com/rubentd/tanks/blob/master/index.js
const io = require('socket.io')(server),
      game = new gameServer();

let playerCount = 0;
let generate = undefined;
let lastSync = undefined;

const setEventHandlers = () => {
  io.on('connection', onSocketConnection);
}

const onSocketConnection = (client) => {
  // Listen for client join
  client.on('joinGame', onClientJoin);

  // Listen for client sync
  client.on('sync', onClientSync);

  // Listen for client leave or disconnect
  client.on('leaveGame', onClientLeave);
  client.on('disconnect', onClientLeave.bind(client, client.id));
}

setEventHandlers();

/**************************************************
** SOCKET HANDLER METHODS
**************************************************/
function onClientJoin(user) {
  console.log(`${user.id} has joined the game`);
  playerCount += 1;
  console.log(`Player count ${playerCount}`);
  if (playerCount > 0 && generate == undefined) {
    generate = setInterval(function() { game.generateObstacles() }, 1000);
    // setInterval(() => game.syncObstacles(), 15);
  }
  //client.emit('addTank', ship);
  this.broadcast.emit('addShip', game.addShip(user.x, user.y, user.id));
}

function onClientSync(data) {
  //Receive data from clients
  if (data.ship != undefined) {
    game.syncShip(data.ship);
  }

  //update obstacle positions
  game.syncObstacles();
  // let currentDate = new Date();
  // if (currentDate.getTime() - lastSync >= 15 || lastSync === undefined) {
  //   game.syncObstacles();
  //   lastSync = currentDate.getTime();
  // }

  //Broadcast data to clients
  this.emit('sync', game.getData());
  this.broadcast.emit('sync', game.getData());

  //clean up
  game.cleanShips();
  game.cleanObstacles();
}

function onClientLeave(userId) {
  if (playerCount > 0 && game.isUserInGame(userId)) {
    console.log(`${userId} has left the game.`);
    playerCount -= 1;
    console.log(`Player count ${playerCount}`);
    game.removeShip(userId);
    this.emit('removeShip', userId);
    this.broadcast.emit('removeShip', userId);
  }
  if (playerCount < 1) {
    clearInterval(generate);
    generate = undefined;
    game.reset();
  }
}
