import { useCallback, useEffect, useState, type JSX } from "react";
import { type Task, type TaskDraft, assets } from "../assets/assets";
import {
  baseControlClasses,
  focusBaseControlClasses,
  priorityStyles,
} from "../assets/dummy";
import { DEFAULT_TASK } from "../data/defaultTask";
import { toast } from "react-toastify";
import api from "../utils/api";
import axios from "axios";
import { getAuthStorage } from "../utils/authStorage";
import { useTaskManagementContext } from "../context/TaskManagementContext";
import DatePicker from "./DatePicker";
import { formatLocalDate, toDateOnly } from "../utils/dateHelpers";

type TaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit: Task | null;
  onSave?: (task: Task) => Promise<void>;
};

interface TaskResponse {
  success: boolean;
  message?: string;
  task: Task;
}

const TaskModal = ({
  isOpen,
  onClose,
  taskToEdit,
  onSave,
}: TaskModalProps): JSX.Element | null => {
  const { handleLogout } = useTaskManagementContext();

  const [taskData, setTaskData] = useState<TaskDraft>(DEFAULT_TASK);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const today = formatLocalDate(new Date());

  const statusOptions = [
    { value: false, label: "In Progress" },
    { value: true, label: "Completed" },
  ];

  // Populate the form when opening — either with the task being edited, or a blank default
  useEffect(() => {
    if (!isOpen) return;

    if (taskToEdit) {
      setTaskData({
        ...DEFAULT_TASK,
        title: taskToEdit.title || "",
        description: taskToEdit.description || "",
        priority: taskToEdit.priority || "Low",
        dueDate: taskToEdit.dueDate ? toDateOnly(taskToEdit.dueDate) : today,
        completed: taskToEdit.completed,
        _id: taskToEdit._id,
      });
    } else {
      setTaskData(DEFAULT_TASK);
    }
    setError(null);
  }, [isOpen, taskToEdit, today]);

  // Prevent scrolling when the modal is open and close the modal when the escape key is pressed
  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "auto";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value } = e.target;
      setTaskData((prev) => ({
        ...prev,
        [name]: name === "completed" ? value === "true" : value,
      }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
      e.preventDefault();

      if (!taskData.title.trim()) {
        const message = "Please provide a task title";
        setError(message);
        toast.error(message);
        return;
      }

      if (!taskData.dueDate) {
        const message = "Please provide a due date for the task";
        setError(message);
        toast.error(message);
        return;
      }

      if (taskData.dueDate < today) {
        const message = "Due date cannot be in the past";
        setError(message);
        toast.error(message);
        return;
      }

      const token = getAuthStorage().getItem("token");
      if (!token) {
        handleLogout();
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const isEdit = Boolean(taskData._id);

        const response = isEdit
          ? await api.put<TaskResponse>(`/api/tasks/${taskData._id}`, taskData)
          : await api.post<TaskResponse>("/api/tasks", taskData);

        if (!response.data.success) {
          throw new Error(response.data.message || "Failed to save task");
        }

        onSave && await onSave(response.data.task);
        toast.success(`Task ${isEdit ? "updated" : "created"} successfully`);
        onClose();
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 401) {
            handleLogout();
            return;
          }
          const message =
            err.response?.data?.message ||
            "Failed to save task. Please try again";
          console.error("Error saving task:", err);
          setError(message);
          toast.error(message);
        } else {
          console.error("Unexpected error saving task:", err);
          const message = "Failed to save task. An unexpected error occurred.";
          setError(message);
          toast.error(message);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [taskData, today, handleLogout, onSave, onClose]
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/20 z-50 flex items-center justify-center p-4 mb-0">
      <div className="bg-base-100 dark:bg-base-200 border-primary/20 p-6 rounded-xl w-full max-w-md shadow-lg relative animate-fade-in max-h-[90vh] overflow-y-auto overscroll-contain">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-neutral/80 dark:text-neutral-content/80 flex items-center gap-2">
            {taskData._id ? (
              <assets.SaveIcon className="size-5 text-primary" />
            ) : (
              <assets.PlusCircleIcon className="size-5 text-primary" />
            )}
            {taskData._id ? "Edit Task" : "Create New Task"}
          </h2>

          <button
            onClick={onClose}
            aria-label="Close"
            className="p-2 hover:bg-primary/20 rounded-lg transition-colors duration-300 text-neutral/50 dark:text-neutral-content/50 hover:text-accent cursor-pointer"
          >
            <assets.XIcon className="size-5" />
          </button>
        </div>

        {/* FORM TO FILL TO CREATE A TASK */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-sm text-error bg-error/10 p-3 rounded-lg border border-red/20">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-neutral/70 dark:text-neutral-content/70 mb-1"
            >
              Task Title
            </label>
            <div
              className="flex items-center border border-primary/20 rounded-lg px-3 py-2.5
            focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all
            duration-300"
            >
              <input
                type="text"
                name="title"
                id="title"
                value={taskData.title}
                onChange={handleChange}
                className="w-full focus:outline-none text-sm text-neutral/80 dark:text-neutral-content/80 bg-transparent placeholder:text-neutral/50 dark:placeholder:text-neutral-content/50"
                placeholder="Enter task title"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="description"
              className="flex items-center gap-1 text-sm font-medium text-neutral/70 dark:text-neutral-content/70 mb-1"
            >
              <assets.AlignLeftIcon className="size-4 text-primary" />
              Description
            </label>

            <div className={focusBaseControlClasses}>
              <textarea
                name="description"
                id="description"
                rows={3}
                value={taskData.description}
                onChange={handleChange}
                className={`${baseControlClasses} text-neutral/80 dark:text-neutral-content/80 bg-transparent focus:outline-none`}
                placeholder="Add details about your task"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <label
                htmlFor="priority"
                className="flex items-center gap-1 text-sm font-medium text-neutral/70 dark:text-neutral-content/70 mb-1"
              >
                <assets.FlagIcon className="size-4 text-primary" />
                Priority
              </label>

              <select
                name="priority"
                id="priority"
                value={taskData.priority}
                onChange={handleChange}
                className={`${baseControlClasses} ${
                  priorityStyles[taskData.priority]
                } border cursor-pointer`}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label
                htmlFor="dueDate"
                className="flex items-center gap-1 text-sm font-medium text-neutral/70 dark:text-neutral-content/70 mb-1"
              >
                <assets.CalendarIcon className="size-4 text-primary" />
                Due Date
              </label>

              <DatePicker
                id="dueDate"
                value={taskData.dueDate}
                onChange={(isoDate) =>
                  setTaskData((prev) => ({ ...prev, dueDate: isoDate }))
                }
                min={today}
              />
            </div>

            <div className="col-span-2 sm:justify-self-start mb-4">
              <label className="flex items-center gap-1 text-sm font-medium text-neutral/70 dark:text-neutral-content/70 mb-2">
                <assets.CheckCircleIcon className="size-4 text-primary" />
                Status
              </label>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                {statusOptions.map(({ value, label }) => {
                  const id = `status-${value}`;

                  return (
                    <label
                      key={label}
                      htmlFor={id}
                      className="flex items-center gap-1 w-full sm:w-auto border border-primary/30 px-3 py-2 rounded-lg cursor-pointer transition-all duration-300
                      hover:border-primary/60 hover:bg-primary/5 has-checked:bg-primary/20 has-checked:border-primary"
                    >
                      <input
                        type="radio"
                        name="completed"
                        id={id}
                        value={value.toString()}
                        checked={taskData.completed === value}
                        onChange={handleChange}
                        className="size-4 accent-primary cursor-pointer focus:ring-primary rounded-xl border-neutral/40 dark:border-neutral-content/40 focus:ring-2 transition-all duration-300"
                      />
                      <span className="ml-2 text-sm text-neutral/70 dark:text-neutral-content/70">
                        {label}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-linear-to-r from-secondary to-primary text-base-100 text-sm font-medium py-2.5 px-4 rounded-lg hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <assets.LoaderIcon className="animate-spin size-4" />
                Saving...
              </>
            ) : taskData._id ? (
              <>
                <assets.SaveIcon className="size-4" />
                Update Task
              </>
            ) : (
              <>
                <assets.PlusCircleIcon className="size-4" />
                Create Task
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
