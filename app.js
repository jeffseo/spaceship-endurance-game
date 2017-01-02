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

module.exports = app;
