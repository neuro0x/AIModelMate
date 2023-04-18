import express, { Request, Response } from "express";
import cors from "cors";
import { bot } from "./controllers/bot.controller";
import AuthRoutes from "./routes/user.routes";
import ResponseRoutes from "./routes/response.routes";
import BotRoutes from "./routes/bot.routes";
import LLMRoutes from "./routes/llm.routes";
import mongoose from "mongoose";
import dotenv from "dotenv";
import logger from "./logger";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/api/auth", AuthRoutes);
app.use("/api/responses", ResponseRoutes);
app.use("/api/bot", BotRoutes);
app.use("/api/llm", LLMRoutes);

app.use("*", (_req: Request, res: Response) => {
  res.status(404).json({ message: "Not found" });
});

app.listen(port, async () => {
  logger.info(`Server is running on port: ${port}`);

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "");
    console.log(`Connected to mongoDB: ${db.connection.name}`);

    await bot.init();
    await bot.open();
  } catch (error) {
    await bot.close();
    logger.error(error);
  }
});
