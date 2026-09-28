const { createClient } = require("redis");

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("error", (err) => {
  console.error(`Redis error: ${err.message}`);
});

const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log("Redis connected");
  } catch (error) {
    console.error(`Redis connection error: ${error.message}`);
  }
};

const TODOS_CACHE_KEY = "todos:all";
const TODOS_CACHE_TTL = 60;

const getCachedTodos = async () => {
  if (!redisClient.isOpen) return null;
  const cached = await redisClient.get(TODOS_CACHE_KEY);
  return cached ? JSON.parse(cached) : null;
};

const setCachedTodos = async (todos) => {
  if (!redisClient.isOpen) return;
  await redisClient.set(TODOS_CACHE_KEY, JSON.stringify(todos), {
    EX: TODOS_CACHE_TTL,
  });
};

const clearTodosCache = async () => {
  if (!redisClient.isOpen) return;
  await redisClient.del(TODOS_CACHE_KEY);
};

module.exports = {
  redisClient,
  connectRedis,
  getCachedTodos,
  setCachedTodos,
  clearTodosCache,
};
