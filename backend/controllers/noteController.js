import Todo from "../models/Todo.js";

// Add a note to a todo
export const addNote = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.todoId);
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }

    todo.notes.push({
      content: req.body.content,
    });

    const updatedTodo = await todo.save();
    res.status(201).json(updatedTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
