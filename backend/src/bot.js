import mongoose from "mongoose";

const botSchema = new mongoose.Schema({
  roomName: { type: String, required: true },
  createdOn: { type: Date, default: Date.now },
});

const Bot = mongoose.model("Room", botSchema); // same collection name as before
export default Bot;
