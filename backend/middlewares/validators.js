import { body } from "express-validator";

// User validation rules
export const userValidationRules = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username can only contain letters, numbers, and underscores"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),
];

// Todo validation rules
export const todoValidationRules = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 1, max: 100 })
    .withMessage("Title must be between 1 and 100 characters"),

  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Priority must be low, medium, or high"),

  body("user").isMongoId().withMessage("Invalid user ID"),

  body("tags").optional().isArray().withMessage("Tags must be an array"),

  body("assignedUsers")
    .optional()
    .isArray()
    .withMessage("Assigned users must be an array"),
];

// Note validation rules
export const noteValidationRules = [
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Note content is required")
    .isLength({ min: 1, max: 1000 })
    .withMessage("Note content must be between 1 and 1000 characters"),
];
