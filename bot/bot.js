import TELEGRAM_BOT from "node-telegram-bot-api";
import dotenv from "dotenv";
dotenv.config();
import message from "./message.js";
import query from "./query.js";

const TOKEN = "6919683296:AAGrC62vpFh92dp90D6K3PPT-KnnUzc5ZpU";

export const bot = new TELEGRAM_BOT(TOKEN, {
  polling: true,
  pollingTimeOut: 60,
});

message();
query();
