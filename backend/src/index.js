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

const MongoURI="mongodb+srv://985173_db_user:k09rX6a7JiqQAZyd@meetwise.sstjbaa.mongodb.net/?retryWrites=true&w=majority&appName=MeetWise"
// const conn = await mongoose.connect(MangoURI, {
//     useNewUrlParser: true,
//       useUnifiedTopology: true,
// })
// if (conn) {
//     console.log("Yeah its connected")
// }

app.use("/bots", BotRoutes)
app.use("/api/user", userRoutes);

// MongoDB connection
await mongoose.connect(MongoURI)
.then(() => {
  app.listen(5000, () => console.log("Server running on http://localhost:5000"));
})
.catch(err => console.log(err));

