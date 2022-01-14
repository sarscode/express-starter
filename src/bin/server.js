import debug from 'debug';
import config from 'config';
import { createServer } from 'http';
import app from '../app';

const { PORT } = config.server;

const logInfo = debug('app:info');
const logError = debug('app:error');

const server = createServer(app);

function serverListener() {
  logInfo('listening on %d', PORT);
}

function handleListenError(error) {
  /* eslint-disable no-fallthrough */
  const { code, port, syscall } = error;
  if (syscall !== 'listen') throw error;
  switch (code) {
    case 'EACCES':
      logError(
        'Permission denied! Requires administrative privileges. Try running with a superuser.'
      );
      process.exit(1);
    case 'EADDRINUSE':
      logError('PORT:%d address is already to in use', port);
      process.exit(1);
    default:
      throw error;
  }
}

function normalizePORT(port) {
  return parseInt(port, 10);
}

server.listen(normalizePORT(PORT));
server.on('listening', serverListener);
server.on('error', handleListenError);
