import { Hono } from 'hono';
import catchAll from '@/middlewares/catchAll';
import customLogger from '@/middlewares/logger';
import errorHandler from '@/utils/errorHandler';
import authRouter from '@/routes/auth.route';
import DepRouter from '@/routes/departments.route';
import SubjectRouter from '@/routes/subjects.route';
import classesRouter from '@/routes/classes.route';
import sessionRouter from '@/routes/sessions.route';
import applicationRouter from '@/routes/applications.route';
import teachersRouter from '@/routes/teachers.route';
import type { JwtVariables } from 'hono/jwt'
import {cors } from 'hono/cors';

type Variables = JwtVariables; // types c.get and c.set for the jwt mw
const server = new Hono<{Variables: Variables}>();

server.use('*', cors({
  origin: 'http://localhost:5173', // my Vue dev server
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // ← important for cookies
}));
server.use(customLogger);

server.get('/', (c) => c.text('Hono!'));
server.route('/auth', authRouter);
//? might need some flat routes too
server.route('/teachers', teachersRouter);
server.route('/departments', DepRouter);
server.route('/subject', SubjectRouter);
server.route('/departments/:id/subjects', SubjectRouter);
server.route('/classes', classesRouter);
server.route('/subjects', SubjectRouter);
server.route('/subjects/:subjectId/classes', classesRouter);
server.route('classes/:classId/sessions', sessionRouter);
server.route('/sessions', sessionRouter);
server.route('/applications', applicationRouter);
server.route('/classes/:classId/applications', applicationRouter);

server.notFound(catchAll);
server.onError(errorHandler);

export default {
    port: process.env.PORT,
    fetch: server.fetch
}