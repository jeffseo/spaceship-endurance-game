const express = require('express');
const morgan = require('morgan');
const app = express();

app.use(morgan('dev'));
app.use(express.static('public'));
app.set('port', (process.env.PORT || 5000));
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
})

app.listen(app.get('port'), function () {
  console.log(`Example app listening on port ${app.get('port')}`);
})
