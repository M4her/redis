const Todo = require("../model/todo.model");
const {
  getCachedTodos,
  setCachedTodos,
  clearTodosCache,
} = require("../config/redis");

const getAllTodos = async (req, res, next) => {
  try {
    const cachedTodos = await getCachedTodos();

    if (cachedTodos) {
      return res.status(200).json({
        success: true,
        count: cachedTodos.length,
        data: cachedTodos,
        source: "cache",
      });
    }

    const todos = await Todo.find().sort({ createdAt: -1 }).lean();
    await setCachedTodos(todos);

    res.status(200).json({
      success: true,
      count: todos.length,
      data: todos,
      source: "database",
    });
  } catch (error) {
    next(error);
  }
};

const createTodo = async (req, res, next) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Name and email are required",
      });
    }

    const todo = await Todo.create({ name, email });
    await clearTodosCache();

    res.status(201).json({
      success: true,
      data: todo,
    });
  } catch (error) {
    next(error);
  }
};

const updateTodo = async (req, res, next) => {
  try {
    const { name, email } = req.body;

    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      { name, email },
      { new: true, runValidators: true }
    );

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }

    await clearTodosCache();

    res.status(200).json({
      success: true,
      data: todo,
    });
  } catch (error) {
    next(error);
  }
};

const deleteTodo = async (req, res, next) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }

    await clearTodosCache();

    res.status(200).json({
      success: true,
      message: "Todo deleted",
      data: todo,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTodos,
  createTodo,
  updateTodo,
  deleteTodo,
};
