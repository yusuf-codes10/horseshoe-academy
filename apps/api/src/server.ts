import { Hono } from 'hono';

const server = new Hono();

server.get('/', (c) => c.text('Hono!'));

export default {
    port: process.env.PORT,
    fetch: server.fetch
}