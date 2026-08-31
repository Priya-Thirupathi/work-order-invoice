import type { ErrorRequestHandler } from "express";
import { Error as MongooseError } from "mongoose";

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof MongooseError.CastError) {
    return res.status(400).json({ error: `Invalid ${err.path}: ${err.value}` });
  }
  if (err instanceof MongooseError.ValidationError) {
    return res.status(400).json({ error: err.message });
  }

  const status = err instanceof HttpError ? err.status : 500;
  if (status === 500) console.error(err);
  res.status(status).json({ error: err.message ?? "Internal Server Error" });
};
