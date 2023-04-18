import { Bot } from "../bot";
import { Request, Response } from "express";

export const bot = new Bot();

export const getBot = async (req: Request, res: Response) => {
  try {
    return res.status(200).json(bot);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const openBot = async (req: Request, res: Response) => {
  try {
    await bot.init();
    await bot.open();
    res.status(200).json({ message: "Bot initialized and opened." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error closing bot." });
  }
};

export const closeBot = async (req: Request, res: Response) => {
  try {
    bot.close();
    res.status(200).json({ message: "Bot closed successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error closing bot." });
  }
};

export const promptBot = async (req: Request, res: Response) => {
  const { prompt } = req.body;

  if (!prompt) {
    res.status(400).json({ message: "Prompt is required." });
    return;
  }

  try {
    const response = await bot.prompt(prompt);
    res.status(200).json({ message: response.substring(13) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error prompting bot." });
  }
};
