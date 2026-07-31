import { type Request, type Response, type NextFunction } from "express";
import { getDb } from "../db/index.js";
import { sessions } from "../db/schema.js";
import { eq } from "drizzle-orm";

export async function expirationCheck(req: Request, res: Response, next: NextFunction) {
  const { webhook_id } = req.params;

  try {
    const [session] = await getDb()
      .select()
      .from(sessions)
      .where(eq(sessions.webhookId as any, webhook_id))
      .limit(1);

    if (!session) {
      res.status(404).json({
        error: "Not Found",
        message: "Webhook ID not found",
      });
      return;
    }

    const now = new Date();
    if (now >= session.expiresAt) {
      res.status(410).json({
        error: "Gone",
        message: "This webhook endpoint has expired",
      });
      return;
    }

    next();
  } catch (error) {
    next(error);
  }
}
