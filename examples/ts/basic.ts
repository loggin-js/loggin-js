import loggin from '../../src';

const logger = loggin.logger();
logger.formatter('detailed')

logger.info('test');
logger.error('test');
logger.warning('test');
logger.critical('test');