import { type Request, type Response, type NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { getDb } from "../db/index.js";
import { sessions } from "../db/schema.js";
import { generateToken } from "../utils/token.js";
import { eq, sql } from "drizzle-orm";

export async function sessionMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.session_token;

    if (token) {
      const [session] = await getDb()
        .select()
        .from(sessions)
        .where(eq(sessions.token as any, token))
        .limit(1);

      if (session) {
        req.session = session;
        return next();
      }
    }

    const uuid = uuidv4();
    const webhookId = uuid;

    const [{ maxId }] = await getDb()
      .select({ maxId: sql<number>`COALESCE(MAX(id), 0) + 1` })
      .from(sessions);

    const { token: newToken } = generateToken(maxId, uuid);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    await getDb().insert(sessions).values({
      token: newToken,
      webhookId,
      createdAt: now,
      expiresAt,
    });

    res.cookie("session_token", newToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    });

    req.session = {
      token: newToken,
      webhookId,
      createdAt: now,
      expiresAt,
    };

    next();
  } catch (error) {
    next(error);
  }
}
