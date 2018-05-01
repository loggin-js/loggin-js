const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 8080;
const ip = '127.0.0.1';

const logging = require('../index');
const Log = logging.Log;
const Severity = logging.Severity.Severity;

let logger = logging.getLogger({
  filepaths: {
    [logging.Severity.INFO]: 'test-remote/logs/info.log',
    [logging.Severity.ERROR]: 'test-remote/logs/error.log'
  }
})


app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.listen(port, () => {
  console.log('We are live on %s:%s', ip, port);
});


app.post('/logs', (req, res) => {
  let log = req.body.log;
  if (log) {
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    let severity = new Severity(log.severity.level, log.severity.name);
    // let logInstance = new Log(log.message, log.data, severity, log.channel, log.time, log.user + '@' + ip);
    logger.log(log.message, log.data, severity, log.channel, log.time, log.user + '@' + ip);
    res.send('Response OK');
  }
  else res.send('Response ERROR: no log was passed');
});
