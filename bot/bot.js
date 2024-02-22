import TELEGRAM_BOT from "node-telegram-bot-api";
import dotenv from "dotenv";
dotenv.config();
import message from "./message.js";
import query from "./query.js";

export const bot = new TELEGRAM_BOT(process.env.TOKEN, {
  polling: true,
  pollingTimeOut: 60,
});

message();
query();
