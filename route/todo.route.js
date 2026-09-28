const express = require("express");
const {
  getAllTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} = require("../controller/todo.controller");

const router = express.Router();

router.get("/", getAllTodos);
router.post("/", createTodo);
router.put("/:id", updateTodo);
router.delete("/:id", deleteTodo);

module.exports = router;
