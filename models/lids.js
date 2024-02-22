import { Schema, model } from "mongoose";

const lidSchema = new Schema({
  username: String,
  firstname: String,
  lastname: String,
  phone: String,
  name: String,
  date: Date,
  group: String || null,
  type: String || null,
  day: String || null,
  time: String || null,
  status: String || null,
});

export default model("Lid", lidSchema);
