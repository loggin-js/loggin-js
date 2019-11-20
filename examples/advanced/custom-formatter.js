const logging = require('../..');

// You can add a new formatter by registering it as follows:
logging.Formatter.register(
  'CUSTOM',
  '{time} - {user} | {channel} - {level} - {message} {data}', {
  props: {
    time: {
      transformers: ['date', 'lbl_cyan']
    },
    user: {
      transformers: ['cl_gray']
    },
    level: {
      transformers: ['string']
    },
    data: {
      transformers: ['json', 'cl_gray']
    },
    channel: {},
    message: {},
  }
}
);

const logger = logging.logger({
  formatter: 'custom'
});

// Available predefined log levels
logger.info('info', {
  user: 'pedro',
  id: 10
});
logger.error('error');
logger.info('info', { data: 'Hi' });
logger.alert('alert');
logger.emergency('emergency');
