require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { connectRedis } = require("./config/redis");
const todoRoutes = require("./route/todo.route");
const { notFound, errorHandler } = require("./middleware/error.middleware");

const app = express();
const PORT = process.env.PORT || 8000;

connectDB();
connectRedis();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Todo API v1",
    endpoints: {
      getAllTodos: "GET /api/v1/todos",
      createTodo: "POST /api/v1/todos",
      updateTodo: "PUT /api/v1/todos/:id",
      deleteTodo: "DELETE /api/v1/todos/:id",
    },
  });
});

app.use("/api/v1/todos", todoRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
