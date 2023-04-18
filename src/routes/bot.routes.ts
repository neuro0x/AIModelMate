import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  closeBot,
  getBot,
  openBot,
  promptBot,
} from "../controllers/bot.controller";

const router = Router();

router.get("/", authMiddleware, getBot);

router.post("/open", authMiddleware, openBot);

router.post("/close", authMiddleware, closeBot);

router.post("/prompt", authMiddleware, promptBot);

export default router;
