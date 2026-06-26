import type { Context } from "hono";
import type { StatusCode, ContentfulStatusCode } from "hono/utils/http-status";
import chalk from "chalk";

const errorHandler = (err: Error & { status?: StatusCode }, c: Context) => {
  // ContentfulStatusCode: in hono, a status code that is allowed to have a response body
  const status = (err.status ?? 500) as ContentfulStatusCode;
  console.error(
    chalk.red(`[ERROR] ${c.req.method} ${c.req.path}`) +
      chalk.gray(` → ${status} ${err.message}`),
  );

  return c.json(
    {
      success: false,
      status,
      message: err.message ?? "Internal Server Error",
    },
    status,
  );
};

export default errorHandler;
