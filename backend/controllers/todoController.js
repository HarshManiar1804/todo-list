import Todo from "../models/Todo.js";

// GET ALL TODOS (with filters/sorting/pagination)
export const getTodos = async (req, res) => {
  try {
    const {
      user,
      priority,
      completed,
      tags,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const query = {};
    if (user) query.user = user;
    if (priority) query.priority = priority;
    if (completed !== undefined) query.completed = completed === "true";
    if (tags) query.tags = { $in: tags.split(",") };

    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    const todos = await Todo.find(query)
      .sort(sort)
      .populate("user", "username email")
      .populate("assignedUsers", "username email");

    res.json({ todos });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET A SINGLE TODO
export const getTodoById = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id)
      .populate("user", "username email")
      .populate("assignedUsers", "username email");

    if (!todo) return res.status(404).json({ message: "Todo not found" });

    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE A TODO
export const createTodo = async (req, res) => {
  try {
    const {
      title,
      description,
      priority = "medium",
      completed = false,
      tags = [],
      assignedUsers = [],
      user,
    } = req.body;

    const todo = new Todo({
      title,
      description,
      priority: priority.toLowerCase(),
      completed,
      tags,
      assignedUsers,
      user,
    });

    const newTodo = await todo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// UPDATE A TODO
export const updateTodo = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: "Todo not found" });

    Object.keys(req.body).forEach((key) => {
      if (key !== "_id" && key !== "__v") {
        todo[key] = req.body[key];
      }
    });

    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE A TODO
export const deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: "Todo not found" });

    // 🔐 Authorization: check if requesting user is owner
    const requestingUserId = req.body.userId || req.query.userId;
    if (String(todo.user) !== String(requestingUserId)) {
      return res.status(403).json({
        message: "Unauthorized: Only the owner can delete this todo.",
      });
    }
    await todo.deleteOne();
    res.json({ message: "Todo deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ➕ ADD NOTE TO TODO (new!)
export const addNoteToTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content?.trim()) {
      return res.status(400).json({ message: "Note content is required" });
    }

    const todo = await Todo.findById(id);
    if (!todo) return res.status(404).json({ message: "Todo not found" });

    todo.notes.push({ content });
    await todo.save();

    res.status(200).json({ message: "Note added successfully", todo });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📤 EXPORT TODOS
export const exportTodos = async (req, res) => {
  try {
    const { user, format = "json" } = req.query;
    const query = user ? { user } : {};

    const todos = await Todo.find(query)
      .populate("user", "username email")
      .populate("assignedUsers", "username email");

    if (format === "csv") {
      const csv = todos.map((todo) => ({
        id: todo._id,
        title: todo.title,
        description: todo.description,
        priority: todo.priority,
        completed: todo.completed,
        user: todo.user?.username,
        tags: todo.tags.join(","),
        assignedUsers: todo.assignedUsers.map((u) => u.username).join(","),
        createdAt: todo.createdAt,
        updatedAt: todo.updatedAt,
      }));

      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=todos.csv");
      res.send(JSON.stringify(csv, null, 2));
    } else {
      res.json(todos);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
