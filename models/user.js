import { Schema, model } from "mongoose";

const userSchema = new Schema({
  username: String,
  firstname: String,
  lastname: String,
  chatId: Number,
  phone: String,
  action: String,
  createdAt: Date,
  lids: [{}],
});

export default model("User", userSchema);
