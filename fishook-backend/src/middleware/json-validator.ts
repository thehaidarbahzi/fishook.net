import { type Request, type Response, type NextFunction } from "express";

export function strictJsonCheck(req: Request, res: Response, next: NextFunction) {
  const contentType = req.headers["content-type"];

  if (!contentType || !contentType.includes("application/json")) {
    res.status(400).json({
      error: "Bad Request",
      message: "Content-Type must be application/json",
    });
    return;
  }

  next();
}
