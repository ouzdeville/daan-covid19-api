require('dotenv').config();
const http = require('http');
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const port = parseInt(process.env.PORT, 10) || 8000;

// Set up the express app
const app = express();
const server = http.createServer(app);

// Log requests to the console.
app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static('public'));

var corsOptions = {
    origin: '*'
};

if (process.env.ACTIVATE_CORS === 'true') {
    var whitelist = ['http://localhost:4200','/*.localhost.*$/', 'https://daan-covid19-api.herokuapp.com'];

    corsOptions = {
        origin: function (origin, callback) {
            if (whitelist.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                console.log(origin);
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

server.listen(port, () => {
    console.log('server started ', port);
});

// module.exports = app;