import express from "express";
import mongoose, { Mongoose } from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import BotRoutes from "./routes/botRoutes.js"
import userRoutes from "./routes/userRoutes.js"


// const {createBot} = require("../backend/controller/botcontroller")

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());


// Example route


const MongoURI = process.env.MONGO_URI;

mongoose.connect(MongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  app.listen(5000, () => console.log("Server running on http://localhost:5000"));
  console.log("Connected to MongoDB");
})
.catch(err => {
  console.error("MongoDB connection error:", err);
});


app.use("/bots", BotRoutes)
app.use("/api/user", userRoutes);

