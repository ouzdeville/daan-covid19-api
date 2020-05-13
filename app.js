require('dotenv').config();

const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const {prevalenceCron} = require('./utils');
fs = require('fs');


const app = express();
// Log requests to the console.
app.use(logger('dev'));
var accessLogStream = fs.createWriteStream(__dirname + process.env.LOG_PATH+'daancovid.log', {flags: 'a'})
app.use(logger('combined',  {"stream": accessLogStream}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

prevalenceCron.prevalenceCron();

let corsOptions = {
  origin: '*'
};

if (process.env.ACTIVATE_CORS === 'true') {
  let whitelist = ['http://localhost:4200', 'https://daan-covid19-api.herokuapp.com'];

  corsOptions = {
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  };
}

app.use(cors(corsOptions));

require('./routes')(app);

app.get('*', (req, res) =>
  res.status(200).send({
    message: 'Stop covid19 :( :)',
  }),
);

module.exports = app;
