import "express";

declare global {
  namespace Express {
    interface Request {
      session?: {
        id?: number;
        token: string;
        webhookId: string;
        createdAt: Date;
        expiresAt: Date;
      };
    }
  }
}
