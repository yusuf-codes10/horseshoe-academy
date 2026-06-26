import type { Context } from "hono";
import type { StatusCode } from "hono/utils/http-status";
import chalk from "chalk";

const errorHandler = (err: Error & { status?: StatusCode }, c: Context) => {
  const status = err.status ?? 500;

  console.error(
    chalk.red(`[ERROR] ${c.req.method} ${c.req.path}`) +
    chalk.gray(` → ${status} ${err.message}`)
  );

  return c.json(
    {
      success: false,
      status,
      message: err.message ?? "Internal Server Error",
    },
    status
  );
};

export default errorHandler;