const app = require('./app'),
      gameServer = require('./game/game-server');

const server = app.listen(app.get('port'), function () {
  console.log(`App listening on port ${app.get('port')}`);
})

/* Socket.IO server set up. */
//http://rubentd.com/blog/creating-a-multiplayer-game-with-node-js/
//https://github.com/rubentd/tanks/blob/master/index.js
const io = require('socket.io')(server);
const game = new gameServer();

io.on('connection', function(client) {
  console.log('User connected');

  client.on('joinGame', function(user) {
    console.log(`${user.id} has joined the game`);
    const ship = new Ship(INIT_X_POSITION, INIT_Y_POSITION, user.id);
    //client.emit('addTank', ship);
    //client.broadcast.emit('addTank', ship);
    game.addShip(new Ship(INIT_X_POSITION, INIT_Y_POSITION, user.id));
  });

  client.on('sync', (data) => {
    //Receive data from clients
    if (data.ship != undefined) {
      game.syncShip(data.ship);
    }

    //update obstacle positions
    game.syncObstacles();

    //Broadcast data to clients
    //client.emit('sync', game.getData());
    //client.broadcast.emit('sync', game.getData());

    //clean up
    game.cleanShips();
    game.cleanObstacles();
  });

  client.on('leaveGame', (userId) => {
    console.log(`${userId} has left the game.`);
    game.removeShip(userId);
    //client.broadcast.emit('removeShip', userId);
  });
});
