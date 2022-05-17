import express from "express";
import {
  RequestAuthToken,
  RequestAccessToken,
  RefreshToken,
} from "../handlers/auth.js";
import authRequired from "../middleware/authRequired.js";

const router = express.Router();

// First Ask for User's Permission & Send Auth Token
router.post("/request", authRequired, RequestAuthToken);

// Receive Auth Code from Client & Request Access Token
router.post("/token", authRequired, RequestAccessToken);

// Retrieve Refresh Token
router.post("/refresh", authRequired, RefreshToken);

export default router;
