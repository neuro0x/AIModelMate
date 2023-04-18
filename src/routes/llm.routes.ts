// routes/llm.routes.ts
import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  createModel,
  getModelById,
  getModels,
  updateModel,
} from "../controllers/llm.controller";

const router = Router();

router.get("/", authMiddleware, getModels);

router.get("/:id", authMiddleware, getModelById);

router.post("/", authMiddleware, createModel);

router.put("/:id", authMiddleware, updateModel);

router.delete("/:id", authMiddleware);

export default router;
