import { Hono } from 'hono';
import catchAll from './middlewares/catchAll';
import customLogger from './middlewares/logger';
import errorHandler from './utils/errorHandler';
import testRouter from './routes/test.route';
import DepRouter from './routes/departments.route';
import SubjectRouter from './routes/subjects.route';
import classeRouter from './routes/classes.route';

const server = new Hono();

server.use(customLogger);

server.get('/', (c) => c.text('Hono!'));
server.route('/test', testRouter);
server.route('/departments', DepRouter);
server.route('/departments/:id/subjects', SubjectRouter);
server.route('/departments/:id/subjects/:subjectId/classes', classeRouter);

server.notFound(catchAll);
server.onError(errorHandler);

export default {
    port: process.env.PORT,
    fetch: server.fetch
}