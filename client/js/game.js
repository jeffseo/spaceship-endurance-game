class Game {
  constructor() {
    this.canvas = getGameCanvas();
    this.context = get2DContext();
    this.controller = new Controller(this.canvas);
    this.spaceShip = new SpaceShip(this.canvas.width * .10, this.canvas.height / 2, 5, 15, getRandomColor(), INITIAL_SHIP_SPEED);
    this.spaceShip.setCanvas(this.canvas);
    this.spaceShip.setContext(this.context);
    this.spaceShip.setController(this.controller);
    this.obstacles = [];
    this.timer = 0;
    this.score = 0;
    this.states = {
      menu: false,
      singleplayer: false,
      multiplayer: false,
      paused: false,
      end: false,
    };
    this.stateEvents = {
      menu: [],
      singleplayer: [],
      multiplayer: [],
      paused: [],
      end: [],
    };
    this.isSinglePlayer = true;
  }

  start() {
    setInterval(this.incrementTimerAndScore.bind(this), 1000);
    setInterval(this.updateGame.bind(this), 15);
    this.changeState('menu');
  }

  updateGame() {
    clearCanvas();
    if (this.states.menu) {
      if (this.controller.isKeyPressed('up') && !this.isSinglePlayer) {
        this.isSinglePlayer = !this.isSinglePlayer;
      } else if (this.controller.isKeyPressed('down') && this.isSinglePlayer) {
        this.isSinglePlayer = !this.isSinglePlayer;
      }

      if (this.controller.isKeyPressed('enter') || this.controller.touchEvents != 0) {
        if (this.isSinglePlayer) {
          this.changeState('singleplayer');
        } else {
          this.changeState('multiplayer');
          this.setUpMultiplayer();
        }
        this.clear();
      }
      this.renderMenuScreen();
    } else if (this.states.singleplayer) {
      if (this.controller.isKeyPressed('escape') && this.isSinglePlayer) {
        this.changeState('paused');
      }
      this.renderPlayScreen();
    } else if (this.states.paused) {
      if (this.controller.isKeyPressed('enter')) {
        this.changeState('singleplayer');
      }
      this.renderPauseScreen();
    } else if (this.states.end) {
      if (this.controller.isKeyPressed('enter') || this.controller.touchEvents != 0) {
        this.changeState('singleplayer');
        this.clear();
      }
      this.renderEndScreen();
    } else if (this.states.multiplayer) {
      this.renderPlayScreen();
      this.sendDataToServer();
    }
  }

  changeState(state) {
    if (state in this.states) {
      for (let st in this.states) {
        if (this.states[st] == true) {
          this.clearStateEvents(st);
          this.states[st] = false;
        } else if (st == state) {
          this.addStateEvents(st);
          this.states[st] = true;
        }
      }
    } else {
      throw new TypeError("Invalid state!");
    }
  }

  clearStateEvents(state) {
    while(this.stateEvents[state].length != 0) {
      clearInterval(this.stateEvents[state].pop());
    }
  }

  addStateEvents(state) {
    if (state == 'menu') {
      this.stateEvents[state].push(setInterval(this.generateObstacles.bind(this), 500));
      this.stateEvents[state].push(setInterval(this.refreshObstacles.bind(this), 1000));
    } else if (state == 'singleplayer') {
      this.stateEvents[state].push(setInterval(this.generateObstacles.bind(this), 750));
      this.stateEvents[state].push(setInterval(this.refreshObstacles.bind(this), 1000));
    } else if (state == 'paused') {
      //add event listeners as necessary
    } else if (state == 'end') {
      //add event listeners as necessary
    } else if (state == 'multiplayer') {
      //add event listeners as necessary
      this.stateEvents[state].push(setInterval(this.refreshObstacles.bind(this), 1000));
    } else {
      throw new TypeError("Invalid state!");
    }
  }

  generateObstacles() {
    // generate obstacle if true
    if (Math.random() >= 0.5) {
      const yPosition = Math.floor(Math.random() * this.canvas.height);
      const radius = Math.floor(Math.random() * 100) + 1;
      const randomSpeed = Math.floor(Math.random() * 15) + 1;
      const scaledSpeed = Math.floor(randomSpeed * this.score/100) + 1;
      const obstacle = new Obstacle(this.canvas.width + radius, yPosition, radius, getRandomColor(), scaledSpeed);
      obstacle.setContext(this.context);
      this.obstacles.push(obstacle);
    }
  }

  moveObstacles() {
    this.obstacles.forEach(obstacle => obstacle.move());
  }

  drawObstacles() {
    this.obstacles.forEach(obstacle => obstacle.draw());
  }

  refreshObstacles() {
    for (let i = 0; i < this.obstacles.length; i += 1) {
      if (this.obstacles[i].x < -this.obstacles[i].radius) {
        this.obstacles.splice(i, 1);
      }
    }
  }

  //http://www.phatcode.net/articles.php?id=459
  //TODO: Maybe include test scenario 2 and 3 from reference?
  detectCollision() {
    for (let i = 0; i < this.obstacles.length; i += 1) {
      if (this.isSpaceShipVertexWithinCircle(this.obstacles[i])){
        // TODO: Temporary solution
        if (this.states.multiplayer) {

          this.changeState('menu');
          this.ships = [];
          this.obstacles = [];
          this.exitMultiplayer();
        } else {
          this.changeState('end');
        }
      }
    }
  }

  // http://www.phatcode.net/articles.php?id=459
  // Test scenario-1: Checks if any vertices are within a circle
  isSpaceShipVertexWithinCircle(obstacle) {
    const vertices = this.spaceShip.getVertices();
    const c1x = obstacle.x - vertices[0][0];
    const c1y = obstacle.y - vertices[0][1];
    if (Math.sqrt(c1x*c1x + c1y*c1y) < obstacle.radius) {
      return true;
    }

    const c2x = obstacle.x - vertices[1][0];
    const c2y = obstacle.y - vertices[1][1];
    if (Math.sqrt(c2x*c2x + c2y*c2y) < obstacle.radius) {
      return true;
    }

    const c3x = obstacle.x - vertices[2][0];
    const c3y = obstacle.y - vertices[2][1];
    if (Math.sqrt(c3x*c3x + c3y*c3y) < obstacle.radius) {
      return true;
    }
    return false;
  }

  clear() {
    this.controller.clear();
    this.spaceShip.setCoordinates(this.canvas.width * .10, this.canvas.height / 2);
    this.spaceShip.setColor(getRandomColor());
    this.obstacles = [];
    this.score = 0;
    this.timer = 0;
  }

  incrementTimerAndScore() {
    this.timer++;
    if (this.score < this.timer && this.states.singleplayer) {
      this.score++;
    }
  }

  createTextObj(string) {
    return {
      string,
      width: this.context.measureText(string).width,
    }
  }

  /***
  ** Draw + render methods
  **/

  drawScore() {
    this.context.font = "16px Arial";
    this.context.fillStyle = "#0095DD";
    this.context.fillText(`Score: ${this.score}`, 8, 20);
  }

  drawArrow(x, y) {
    const ogStrokeStyle = this.context.strokeStyle;
    const ogLineWidth = this.context.lineWidth;

    this.context.beginPath();
    this.context.moveTo(x - 10,y - 10);
    this.context.lineTo(x,y);
    this.context.lineTo(x - 10, y + 10);
    this.context.strokeStyle = '#ff0000';
    this.context.lineWidth = 5;
    this.context.stroke();

    this.context.strokeStyle = ogStrokeStyle;
    this.context.lineWidth = ogLineWidth;

  }

  drawText(string, x, y, fillStyle) {
    const ogFillStyle = this.context.fillStyle;

    this.context.fillStyle = fillStyle;
    this.context.fillText(string, x, y);
    this.context.strokeText(string, x, y);

    this.context.fillStyle = ogFillStyle;
  }

  drawMenu() {
    this.context.font = "32px Arial";
    const title = this.createTextObj('Spaceship Endurance Game');
    const singlePlayer = this.createTextObj('Single Player');
    const multiPlayer = this.createTextObj('Multi Player');
    const prompt = this.createTextObj('Press Enter to start!');

    this.drawText(title.string, (this.canvas.width - title.width) / 2, this.canvas.height*.05, "#0095DD");
    this.drawText(singlePlayer.string, (this.canvas.width - singlePlayer.width) / 2, this.canvas.height*.5, "#0095DD");
    this.drawText(multiPlayer.string, (this.canvas.width - multiPlayer.width) / 2, this.canvas.height*.6, "#0095DD");
    this.drawText(prompt.string, (this.canvas.width - prompt.width) /2, this.canvas.height * .75, "#0095DD");

    if (this.isSinglePlayer) {
      this.drawArrow((this.canvas.width - singlePlayer.width) * .9 / 2, this.canvas.height*.5 - parseInt(this.context.font)/2);
    } else {
      this.drawArrow((this.canvas.width - multiPlayer.width) * .9 / 2, this.canvas.height*.6 - parseInt(this.context.font)/2);
    }
  }

  drawPauseScreen() {
    this.context.font = "32px Arial";
    this.context.fillStyle = "#0095DD";
    this.context.fillText(`Paused.`, this.canvas.width*.20, this.canvas.height/4);
    this.context.fillText(`Press Enter to resume!`, this.canvas.width*.20, this.canvas.height/2);
  }

  drawEndScreen() {
    this.context.font = "32px Arial";
    this.context.fillStyle = "#0095DD";
    this.context.fillText(`Rekt. Score: ${this.score}`, this.canvas.width*.20, this.canvas.height/4);
    this.context.fillText(`Press Enter to restart!`, this.canvas.width*.20, this.canvas.height/2);
  }

  renderMenuScreen() {
    this.spaceShip.draw();
    this.moveObstacles();
    this.drawObstacles();
    this.drawMenu();
  }

  renderPlayScreen() {
    this.detectCollision();
    this.spaceShip.move();
    this.spaceShip.draw();
    if (this.states.singleplayer) {
      this.moveObstacles();
    } else {
      this.drawOtherShips();
    }
    this.drawObstacles();
    this.drawScore();
  }

  renderPauseScreen() {
    this.spaceShip.draw();
    this.drawObstacles();
    this.drawPauseScreen();
    this.drawScore();
  }

  renderEndScreen() {
    this.spaceShip.draw();
    this.drawObstacles();
    this.drawEndScreen();
  }

  /***
  ** Multiplayer methods
  **/
  setUpMultiplayer() {
    this.ships = [];

    // Grab the unique session ID from the global socket connection variable
    this.spaceShip.id = this.socket.io.engine.id;

    this.socket.emit('joinGame',
      { id: this.spaceShip.id,
        x: this.spaceShip.x,
        y: this.spaceShip.y
      });
  }

  exitMultiplayer() {
    this.socket.emit('leaveGame', this.spaceShip.id);
  }

  setSocket(socket) {
    this.socket = socket;
  }

  addShip(id, x, y) {
    const ship = new SpaceShip(x,y,5,15,"#E62E2E",INITIAL_SHIP_SPEED);
    ship.setCanvas(this.canvas);
    ship.setContext(this.context);
    this.ships.push(ship);
  }

  removeShip(id) {
    if (id == this.spaceShip.id) {
      // this.spaceShip = undefined;
    } else {
      this.ships = this.ships.filter( ship => ship.id != id );
    }
  }

  drawOtherShips() {
    this.ships.forEach(ship => ship.draw());
  }

  sendDataToServer() {
    //Send local data to server
		const gameData = {};

		//Send ship data
		const ship = {
			id: this.spaceShip.id,
			x: this.spaceShip.x,
			y: this.spaceShip.y,
		};
		gameData.ship = ship;

		//Client game does not send any info about balls,
		//the server controls that part
		this.socket.emit('sync', gameData);
  }

  receiveData(serverData) {
    if (serverData.ships.length) {
      this.ships = [];
      serverData.ships.forEach( (serverShip) => {
        // update the client's spaceship
        if (serverShip.id == this.spaceShip.id) {
          // do some check stuff
        } else {
          //Update foreign ships
          let found = false;
          this.ships.forEach( (clientShip) => {
            if (clientShip.id == serverShip.id) {
              clientShip.x = serverShip.x;
              clientShip.y = serverShip.y;
              found = true;
            }
          });

          if(!found) {
            this.addShip(serverShip.id, serverShip.x, serverShip.y);
          }
        }
      });
    }

    if (serverData.obstacles.length) {
      this.obstacles = [];
      serverData.obstacles.forEach( (obstacle) => {
        const newObstacle = new Obstacle(obstacle.x, obstacle.y, obstacle.radius, obstacle.color, obstacle.speed);
        newObstacle.setContext(this.context);
        this.obstacles.push(newObstacle);
      });
    }
  }
}

// http://stackoverflow.com/questions/1484506/random-color-generator-in-javascript
const getRandomColor = () => {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
