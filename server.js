import express from "express";
import colors from "colors";
import { connectToDb } from "./config/dbConnect.js";
import dotenv from "dotenv";
import authRouter from "./routes/auth-route.js";
import userRouter from "./routes/user-routes.js";
import postRouter from "./routes/post-routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();
connectToDb();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Welcome to Person of Interest backend server");
});

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);

//error middleware
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went Wrong";

  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
