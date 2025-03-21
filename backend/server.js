import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/todos", todoRoutes);
app.use("/api/notes", noteRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/todo-list")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 7777;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
