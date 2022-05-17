import express from "express";
const router = express.Router();
import { Get, Login, Logout, Register, Me } from "../handlers/user.js";
import authRequired from "../middleware/authRequired.js";
import restrictedUsers from "../middleware/restrictedUsers.js";

// Retrieve User by Session userId
router.get("/me", Me);

// Register
router.post("/register", restrictedUsers, Register);

// Login
router.post("/login", Login);

// Logout
router.post("/logout", authRequired, Logout);

// GET One User
router.get("/:username", authRequired, Get);

export default router;
