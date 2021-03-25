import loggin from '../../src';

const logger = loggin.logger({
  level: loggin.severity('info'),
  color: false,
  channel: 'demo-1',
  formatter: 'long',
});

logger.level('debug');
logger.color(true);
logger.user('root');

logger.debug('debug');

logger.info('info', {
  user: 'Jeffrey',
  id: 101,
});
logger.error('Teaching a snake to kick! :D');
logger.emergency('Lemons');
logger.critical('critical', { error: 'S*** something is bad!' });

logger.user('keff');
logger.notice('notice im now an other user');
logger.error('There was an <%rERROR>');
logger.info('info', null, { channel: 'demo-2' });
logger.enabled(false);
logger.error('There was an <%rERROR>');
