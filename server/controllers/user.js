import express from "express";
const router = express.Router();
import { Get, Login, Logout, Register, Me } from "../handlers/user.js";

// Retrieve User by Session userId
router.get("/me", Me);

// GET One User
router.get("/:username", Get);

// Register
router.post("/register", Register);

// Login
router.post("/login", Login);

// Logout
router.post("/logout", Logout);

export default router;
