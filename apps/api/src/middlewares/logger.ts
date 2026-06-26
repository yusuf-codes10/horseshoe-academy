import type { Context, Next } from "hono";
import chalk from "chalk";

type ChalkFn = (text: string) => string;

const customLogger = async (c: Context, next: Next) => {
  const methodColors: Record<string, ChalkFn> = {
    GET: chalk.green,
    POST: chalk.blue,
    PUT: chalk.yellow,
    DELETE: chalk.red,
    PATCH: chalk.magenta,
  };

  const start = Date.now();
  const colorFn: ChalkFn = methodColors[c.req.method] ?? chalk.white;

  await next();

  const ms = Date.now() - start;
  const status = c.res.status;

  const statusColor =
    status >= 500
      ? chalk.red
      : status >= 400
        ? chalk.yellow
        : status >= 300
          ? chalk.cyan
          : chalk.green;

  console.log(
    `${colorFn(c.req.method)} ${c.req.url} ${statusColor(String(status))} ${chalk.gray(`${ms}ms`)}`,
  );
};

export default customLogger;
