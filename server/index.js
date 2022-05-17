import "dotenv/config";
import express from "express";
import cors from "cors";
import { PORT } from "./constants.js";
import KeywordsController from "./controllers/keywords.js";
import UserController from "./controllers/user.js";
import AuthController from "./controllers/auth.js";
import { AppDataSource } from "./database/db.js";
import session from "express-session";
import pgSession from "connect-pg-simple";
import pg from "pg";
import { __prod__ } from "./constants.js";
const { Pool } = pg;
const sessionStore = pgSession(session);

const index = async () => {
  AppDataSource.initialize().catch(console.error);

  // Middlewares
  const app = express();
  app.set("trust proxy", 1);
  app.use(express.json());
  const allowList = [process.env.CLIENT_URL];
  app.use(
    cors({
      origin: allowList,
      credentials: true,
    })
  );

  // Session Store
  const pool = new Pool({
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DB,
    max: 20,
  });

  pool.on("connect", () => {
    console.log("Session store connected.");
  });

  pool.on("error", (err) => {
    console.log("Error: ", err);
  });

  // Session Configuration
  const domain = new URL(process.env.CLIENT_URL);
  console.log('cookie domain: ', domain.hostname.hostname.replace("www.", "."))
  app.use(
    session({
      name: process.env.COOKIE_NAME,
      secret: process.env.EXPRESS_SESSION_SECRET,
      saveUninitialized: false,
      resave: false,
      store: new sessionStore({
        pool: pool,
        tableName: "user_sessions",
        createTableIfMissing: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        httpOnly: true,
        secure: __prod__,
        sameSite: "strict",
        domain: __prod__ ? `${domain.hostname.hostname.replace("www.", ".")}` : undefined,
      },
    })
  );

  // API Routes
  app.use("/api/keywords", KeywordsController);
  app.use("/api/auth", AuthController);
  app.use("/api/user", UserController);

  // Start Express
  app.listen(PORT, () => {
    console.log(`Express is running on PORT: ${PORT}`);
  });
};

index().catch(console.error);
