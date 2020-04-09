const http = require('http');
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');

const port = parseInt(process.env.PORT, 10) || 8000;

// Set up the express app
const app = express();
const server = http.createServer(app);

// Log requests to the console.
app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('*', (req, res) =>
  res.status(200).send({
    message: 'Stop covid19 :( :)',
  }),
);

//module.exports = app;

app.set('port', port);

server.listen(port, () => {
  console.log('server started ', port);
});
