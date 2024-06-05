import { Router } from "express";
import {
  login,
  logout,
  register,
  verifyToken,
} from "../controllers/auth.controller.js";

const router = Router();

router.post("/login", login);
router.post("/logout", logout);
router.post("/register", register);
router.get("/verify", verifyToken);
router.post("/logout", verifyToken, logout);
export default router;
