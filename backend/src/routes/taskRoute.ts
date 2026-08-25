import express from "express";
import { createTask, getTasks, getTaskById, updateTask, deleteTask } from "../controllers/taskController";
import authMiddleware from "../middleware/auth";

const taskRouter: express.Router = express.Router();

taskRouter.route('/')
  .get(authMiddleware, getTasks)
  .post(authMiddleware, createTask);

taskRouter.route("/:id")
  .get(authMiddleware, getTaskById)
  .put(authMiddleware, updateTask)
  .delete(authMiddleware, deleteTask);

export default taskRouter;