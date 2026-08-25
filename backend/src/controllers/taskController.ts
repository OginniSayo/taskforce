import Task from "../models/taskModel";
import { Response } from "express";
import { AuthRequest } from "../types/AuthRequest";

interface TaskParams {
  id: string;
}

interface CreateTaskBody {
  title: string;
  description?: string;
  priority?: "Low" | "Medium" | "High";
  dueDate?: string;
  completed?: boolean;
}

interface UpdateTaskBody extends Partial<CreateTaskBody> {}

// Create a new task
const createTask = async (req: AuthRequest<{}, {}, CreateTaskBody>, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const { title, description, priority, dueDate, completed } = req.body;

    const task = new Task({
      title,
      description,
      priority,
      dueDate,
      completed: completed ?? false,
      owner: req.user.id
    })

    const savedTask = await task.save();
    res.status(201).json({ success: true, message: "Task created successfully", task: savedTask });
    return;
  
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'Something went wrong in creating a new task'
    res.status(500).json({ success: false, message: errorMessage });
    return;
  }
}

// Get all tasks for the authenticated user
const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }
    
    const tasks = await Task.find({ owner: req.user.id }).sort({ createdAt: -1 });

    if (!tasks) {
      return res.status(404).json({ success: false, message: 'No tasks found for this user' });
    }

    res.status(200).json({ success: true, tasks });
    return;

  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'Something went wrong in fetching tasks'
    res.status(500).json({ success: false, message: errorMessage });
    return;
  }
}

// Get a single task by ID for the authenticated user
const getTaskById = async (req: AuthRequest<TaskParams>, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const task = await Task.findOne({ _id: req.params.id, owner: req.user.id });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.status(200).json({ success: true, task });
    return;

  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'Something went wrong in fetching the task'
    res.status(500).json({ success: false, message: errorMessage });
    return;
  }
}

// Update a task by ID for the authenticated user
const updateTask = async (req: AuthRequest<TaskParams, {}, UpdateTaskBody>, res: Response) => {
  try {

    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }
    
    const { title, description, priority, dueDate, completed } = req.body;

    const updates: Partial<UpdateTaskBody> = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (priority !== undefined) updates.priority = priority;
    if (dueDate !== undefined) updates.dueDate = dueDate;
    if (completed !== undefined) updates.completed = completed;

    const updatedTask = await Task.findOneAndUpdate(
      {_id: req.params.id, owner: req.user.id},
      updates,
      { returnDocument: "after", runValidators: true }
    )

    if (!updatedTask) {
      return res.status(404).json({ success: false, message: 'Task not found or you do not have permission to update this task' });
    }

    res.status(200).json({ success: true, message: "Task updated successfully", task: updatedTask });
    return;

  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'Something went wrong in updating the task'
    res.status(500).json({ success: false, message: errorMessage });
    return;
  }
}

// Delete a task by ID for the authenticated user
const deleteTask = async (req: AuthRequest<TaskParams>, res: Response) => {

  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const deletedTask = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user.id });

    if (!deletedTask) {
      return res.status(404).json({ success: false, message: 'Task not found or you do not have permission to delete this task' });
    }

    res.status(200).json({ success: true, message: "Task deleted successfully" });
    return;

  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'Something went wrong in deleting the task'
    res.status(500).json({ success: false, message: errorMessage });
    return;
  }
  
}

export { createTask, getTasks, getTaskById, updateTask, deleteTask };