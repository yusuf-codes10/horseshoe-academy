import { Hono } from 'hono';
import catchAll from './middlewares/catchAll';
import customLogger from './middlewares/logger';

const server = new Hono();

server.use(customLogger);

server.get('/', (c) => c.text('Hono!'));

server.notFound(catchAll);

export default {
    port: process.env.PORT,
    fetch: server.fetch
}