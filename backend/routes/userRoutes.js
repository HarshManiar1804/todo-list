import express from "express";
import {
  getUsers,
  getUserById,
  createUser,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", getUsers); // GET all users
router.get("/:id", getUserById); // GET user by ID
router.post("/", createUser); // POST new user (signup)

export default router;
