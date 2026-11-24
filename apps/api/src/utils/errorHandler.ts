import type { Context } from "hono";
import type { StatusCode, ContentfulStatusCode } from "hono/utils/http-status";
import chalk from "chalk";
import { HTTPException } from "hono/http-exception";


const errorHandler = (err: Error & { status?: StatusCode }, c: Context) => {
  // ContentfulStatusCode: in hono, a status code that is allowed to have a response body
  const isHttp = err instanceof HTTPException;
  const status = (err.status ?? 500) as ContentfulStatusCode;

  const cause = (err as any).cause;
  console.error("db cause:", cause?.code, cause?.constraint_name, cause?.detail ?? cause?.message);
  
  console.error(
    chalk.red(`[ERROR] ${c.req.method} ${c.req.path}`) +
      chalk.gray(` → ${status} ${err.message}`),
  );

  if (!isHttp) console.error(err.stack); // keep the stack for real bugs

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
