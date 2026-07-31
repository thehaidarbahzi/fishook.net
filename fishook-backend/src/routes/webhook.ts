import { Router } from "express";
import { getDb } from "../db/index.js";
import { webhookLogs } from "../db/schema.js";
import { getWsServer } from "../ws/index.js";
import { strictJsonCheck } from "../middleware/json-validator.js";
import { expirationCheck } from "../middleware/expiration.js";

const router = Router();

router.all("/listen/:webhook_id", strictJsonCheck, expirationCheck, async (req, res, next) => {
  try {
    const webhookId = req.params.webhook_id as string;

    const headers = { ...req.headers } as Record<string, string>;
    const queryParams = { ...req.query } as Record<string, string>;
    const body = req.body ?? {};

    const result = await getDb()
      .insert(webhookLogs)
      .values({
        webhookId,
        method: req.method,
        headers,
        queryParams,
        body,
        createdAt: new Date(),
      });
    const insertId = result[0].insertId;

    const wsServer = getWsServer();
    wsServer.broadcast(webhookId, { id: insertId, method: req.method, headers, queryParams, body });

    res.status(200).json({
      success: true,
      message: "Webhook received",
      id: insertId,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
