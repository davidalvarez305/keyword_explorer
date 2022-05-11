import "dotenv/config"
import express from "express";
import cors from "cors";
import { PORT } from "./constants.js";
import { KeywordsController } from "./controllers/keywords.js";

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
  app.use("/api/", KeywordsController);

  // Start Express
  app.listen(PORT, () => {
    console.log(`Express is running on PORT: ${PORT}`);
  });

};

index().catch(console.error);
