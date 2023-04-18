import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  createResponse,
  getResponses,
  getResponseById,
  updateResponse,
  deleteResponse,
  getResponsesByUserId,
} from "../controllers/response.controller";

const router = Router();

// Create a new response
router.post("/", authMiddleware, createResponse);

// Get all responses
router.get("/", authMiddleware, getResponses);

// Get a single response by ID
router.get("/:id", authMiddleware, getResponseById);

// Update a response by ID
router.put("/:id", authMiddleware, updateResponse);

// Delete a response by ID
router.delete("/:id", authMiddleware, deleteResponse);

// Get responses by user ID
router.get("/user/:userId", authMiddleware, getResponsesByUserId);

export default router;
