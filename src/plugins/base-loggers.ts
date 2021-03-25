import { LogginJS } from '../lib';

export default function plugin({ loggerRegistry }: LogginJS) {
  loggerRegistry
    .register('default', 'Console')
    .register('console', 'Console')
    .register('file', 'File')
    .register('http', 'Http')
    .register('memory', 'Memory');
}
