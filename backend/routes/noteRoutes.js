import express from "express";
import { validationResult } from "express-validator";
import { noteValidationRules } from "../middlewares/validators.js";
import { addNote } from "../controllers/noteController.js";

const router = express.Router();

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// POST /api/todos/:id/notes - Add a note to a todo
router.post("/:todoId/notes", noteValidationRules, validate, addNote);

export default router;
