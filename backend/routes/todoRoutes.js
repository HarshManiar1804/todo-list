import express from "express";
import {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  addNoteToTodo,
  exportTodos,
} from "../controllers/todoController.js";

const router = express.Router();

router.get("/", getTodos);
router.get("/export", exportTodos);
router.get("/:id", getTodoById);
router.post("/", createTodo);
router.put("/:id", updateTodo);
router.delete("/:id", deleteTodo);
router.post("/:id/notes", addNoteToTodo); // ✅ NEW ROUTE

export default router;
