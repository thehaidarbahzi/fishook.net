import { Router } from "express";

const router = Router();

router.get("/me", async (req, res, next) => {
  try {
    if (!req.session) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const webhookUrl = `${req.protocol}://${req.get("host")}/api/v1/listen/${req.session.webhookId}`;

    res.json({
      token: req.session.token,
      webhookId: req.session.webhookId,
      webhookUrl,
      expiresAt: req.session.expiresAt,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
