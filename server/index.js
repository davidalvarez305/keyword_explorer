import "dotenv/config"
import express from "express";
import cors from "cors";
import { PORT } from "./constants.js";
import KeywordsController from "./controllers/keywords.js";
import AuthController from "./controllers/auth.js";

const index = async () => {

  // Middlewares
  const app = express();
  app.use(express.json());
  const allowList = ["http://localhost:4011"];
  app.use(
    cors({
      origin: allowList,
      credentials: true,
    })
  );

  // API Routes
  app.use("/api/keywords", KeywordsController);
  app.use("/api/auth", AuthController);

  // Start Express
  app.listen(PORT, () => {
    console.log(`Express is running on PORT: ${PORT}`);
  });

};

index().catch(console.error);
