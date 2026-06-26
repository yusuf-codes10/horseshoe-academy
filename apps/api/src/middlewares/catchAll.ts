import type { Context } from "hono";

const catchAll = (c: Context) => {
    c.json({msg: 'Route does not exist!'}, 404);
}

export default catchAll;