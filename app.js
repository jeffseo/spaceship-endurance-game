const express = require('express'),
      morgan = require('morgan'),
      app = express();

// Set up the app

app.use(morgan('dev'));
app.use(express.static('public'));

app.set('port', (process.env.PORT || 5000));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
})

const server = app.listen(app.get('port'), function () {
  console.log(`App listening on port ${app.get('port')}`);
})

/* Socket.IO server set up. */
//http://rubentd.com/blog/creating-a-multiplayer-game-with-node-js/
//https://github.com/rubentd/tanks/blob/master/index.js
const io = require('socket.io')(server);

class GameServer {
  constructor() {
    this.ships = [];
    this.obstacles = [];
  }

  addShip(ship) {
    this.ships.push(ship);
  }

  addObstacle(obstacle) {
    this.obstacles.push(obstacle);
  }
}

const game = new GameServer();

io.on('connection', function(client) {
  console.log('User connected');
});
