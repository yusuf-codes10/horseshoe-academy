import type { Context, Next } from "hono";
import chalk from "chalk";

type chalkfn = (text: string) => string;

const customLogger = async (c: Context, next: Next) => {
  const methodColors: Record<string, ChalkFn> = {
    GET: chalk.green,
    POST: chalk.blue,
    PUT: chalk.yellow,
    DELETE: chalk.red,
    PATCH: chalk.magenta,
  };

  c.json({ msg: "hey" });
  next();
};

export default customLogger;
