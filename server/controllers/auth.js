import express from "express";
import { RequestAuthToken, RequestAccessToken, RefreshToken } from "../handlers/auth.js";

const router = express.Router();

// First Ask for User's Permission & Send Auth Token
router.post("/request", RequestAuthToken);

// Receive Auth Code from Client & Request Access Token
router.post("/token", RequestAccessToken);

// Retrieve Refresh Token
router.post("/refresh", RefreshToken);

export default router;