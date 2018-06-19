'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const logging = require('../index');
const app = express();
const port = 8080;
const ip = '127.0.0.1';
const Severity = logging.Severity.Severity;

let logger = logging.getLogger({
  filepaths: {
    [logging.Severity.INFO]: 'test-remote/logs/info.log',
    [logging.Severity.ERROR]: 'test-remote/logs/error.log'
  }
});

// support json encoded bodies
app.use(bodyParser.json());

// support encoded bodie
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log('We are live on %s:%s', ip, port);
});


app.post('/logs', (req, res) => {
  let log = req.body.log;
  if (log) {
    let reqIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    let severity = new Severity(log.severity.level, log.severity.name);
    logger.log(log.message, log.data, severity, log.channel, log.time, log.user + '@' + reqIP);
    res.send('Response OK');
  }
  else res.send('Response ERROR: no log was passed');
});
