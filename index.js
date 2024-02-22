import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import "./bot/bot.js";
import User from "./models/user.js";
import cors from "cors";
import Lid from "./models/lids.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

process.on("uncaughtException", (ex) => {
  console.log(ex.message);
});

process.on("unhandleRejection", (ex) => {
  console.log(ex.message);
});

const MONGO_URI = "mongodb://0.0.0.0/itmatryoshka";
const PORT = 5000;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

//Routes go here
app.get("/", (req, res) => {
  res.json("Welcome to It Matryoshka!");
});

app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json("Server error!");
  }
});

app.get("/api/lids", async (req, res) => {
  try {
    const lids = await Lid.find();

    res.status(200).json(lids);
  } catch (error) {
    res.status(500).json("Server error!");
  }
});

app.put("/api/lids/:id", async (req, res) => {
  try {
    if (req.params.id) {
      await Lid.findByIdAndUpdate(req.params.id, { status: req.body.status });

      res.status(200).json("Status changed!");
    } else {
      res.status(300).json("Id berilmegen");
    }
  } catch (error) {
    res.status(500).json("Server error!");
  }
});

//Connect to the database before listening
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`);
  });
});
