import { Router } from "express";
import {
  login,
  logout,
  register,
  verifyToken,
  edit,
  drop
} from "../controllers/auth.controller.js";

const router = Router();

router.post("/login", login);
router.post("/logout", logout);
router.post("/register", register);
router.put("/usuarios/:id", edit);
router.delete("/usuarios/:id", drop);
router.get("/verify", verifyToken);
router.post("/logout", verifyToken, logout);
export default router;
