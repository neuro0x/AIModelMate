import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  changeEmail,
  changePassword,
  login,
  register,
  validate,
} from "../controllers/auth.controller";

const router = Router();

// Validate a jwt
router.post("/validate", authMiddleware, validate);

// Login an existing user
router.post("/login", login);

// Register a new user
router.post("/register", register);

// Change email
router.put("/change-email", authMiddleware, changeEmail);

// Change password
router.put("/change-password", authMiddleware, changePassword);

export default router;
