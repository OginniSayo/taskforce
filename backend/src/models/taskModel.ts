import mongoose from "mongoose";

export interface ITask extends mongoose.Document {
  title: string;
  description?: string;
  priority: "Low" | "Medium" | "High";
  dueDate: Date;
  owner: mongoose.Types.ObjectId;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema: mongoose.Schema<ITask> = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  description: { type: String, default: "" },
  priority: { type: String, enum: ["Low", "Medium", "High"], default: "Low" },
  dueDate: { type: Date, required: true },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  completed: { type: Boolean, default: false },
}, { timestamps: true});

const TaskModel: mongoose.Model<ITask> = 
  mongoose.models.Task || mongoose.model<ITask>("Task", TaskSchema);

export default TaskModel;