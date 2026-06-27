import { Hono } from 'hono';
import catchAll from './middlewares/catchAll';
import customLogger from './middlewares/logger';
import errorHandler from './utils/errorHandler';
import testRouter from './routes/test.route';

const server = new Hono();

server.use(customLogger);

server.get('/', (c) => c.text('Hono!'));
server.route('/test', testRouter);

server.notFound(catchAll);
server.onError(errorHandler);

export default {
    port: process.env.PORT,
    fetch: server.fetch
}