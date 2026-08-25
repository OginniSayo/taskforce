import { useState, useMemo, type JSX, useCallback } from "react";
import {
  ADD_BUTTON,
  FILTER_LABELS,
  FILTER_OPTIONS,
  FILTER_WRAPPER,
  HEADER,
  ICON_WRAPPER,
  LABEL_CLASS,
  SELECT_CLASSES,
  STAT_CARD,
  STATS,
  STATS_GRID,
  TABS_WRAPPER,
  VALUE_CLASS,
  WRAPPER,
  TAB_BASE,
  TAB_ACTIVE,
  TAB_INACTIVE,
  EMPTY_STATE,
} from "../assets/dummy";
import { assets, type Task } from "../assets/assets";
import { useOutletContext } from "react-router-dom";
import TaskItem from "../components/TaskItem";
import TaskModal from "../components/TaskModal";
import { parseLocalDate, startOfToday } from "../utils/dateHelpers";

const Dashboard = (): JSX.Element => {
  const { tasks, refreshTasks, updateTaskLocally } = useOutletContext() as {
    tasks: Task[];
    refreshTasks: () => Promise<void>;
    updateTaskLocally: (updatedTask: Task) => void;
  };

  const [showModal, setShowModal] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>("all");

  const stats = useMemo(
    () => ({
      total: tasks.length,
      lowPriority: tasks.filter((task) => task.priority === "Low").length,
      mediumPriority: tasks.filter((task) => task.priority === "Medium").length,
      highPriority: tasks.filter((task) => task.priority === "High").length,
      completed: tasks.filter((task) => task.completed === true).length,
    }),
    [tasks]
  );

  // FILTER TASKS

  const filteredTasks = useMemo(
    () =>
      tasks.filter((task) => {
        const dueDate = parseLocalDate(task.dueDate);
        const today = startOfToday();
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);
        const endOfMonth = new Date(
          today.getFullYear(),
          today.getMonth() + 1,
          0
        );

        switch (filter) {
          case "overdue":
            return dueDate < today && !task.completed;

          case "today":
            return dueDate.toDateString() === today.toDateString();

          case "week":
            return dueDate >= today && dueDate <= nextWeek;

          case "month":
            return dueDate >= today && dueDate <= endOfMonth;

          case "high":
          case "medium":
          case "low":
            return task.priority.toLowerCase() === filter;

          default:
            return true;
        }
      }),
    [tasks, filter]
  );

  // SORT TASKS

  // Define a priority weight mapping to sort tasks by priority if needed
  const priorityWeight: Record<Task["priority"], number> = {
    High: 0,
    Medium: 1,
    Low: 2,
  };

  const sortedTasks = useMemo(() => {
    return [...filteredTasks].sort((a, b) => {
      // 1. Incomplete tasks before completed ones
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }

      // 2. Sooner due dates first (tasks with no due date sink to the end)
      if (a.dueDate && b.dueDate) {
        const dateDiff =
          parseLocalDate(a.dueDate).getTime() -
          parseLocalDate(b.dueDate).getTime();
        if (dateDiff !== 0) return dateDiff;
      } else if (a.dueDate && !b.dueDate) {
        return -1;
      } else if (!a.dueDate && b.dueDate) {
        return 1;
      }

      // 3. Higher priority first
      const priorityDiff =
        priorityWeight[a.priority] - priorityWeight[b.priority];
      if (priorityDiff !== 0) return priorityDiff;

      // 4. Fall back to creation order (newest first), matching current backend default
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [filteredTasks]);

  // SAVING TASKS

  const handleTaskSave = useCallback( async (_task: Task) => {
      await refreshTasks();
      setShowModal(false);
    },[refreshTasks]
  );

  return (
    <div className={WRAPPER}>
      {/* HEADER */}
      <div className={HEADER}>
        <div className="min-w-0">
          <h1
            className="text-xl md:text-3xl font-bold text-neutral/80 dark:text-neutral-content/80 flex
          items-center gap-2"
          >
            <assets.HomeIcon className="text-primary size-5 md:size-6 shrink-0" />
            <span className="truncate">Task Overview</span>
          </h1>
          <p className="text-sm text-neutral/50 dark:text-neutral-content/50 mt-1 ml-7 truncate">
            Manage your tasks efficiently
          </p>
        </div>

        <button onClick={() => setShowModal(true)} className={ADD_BUTTON}>
          <assets.PlusIcon className="size-4.5 md:size-5 mr-2" />
          Add New Task
        </button>
      </div>

      {/* STATS */}
      <div className={STATS_GRID}>
        {STATS.map(
          ({
            key,
            label,
            icon: Icon,
            iconColor,
            borderColor = "border-primary/20",
            valueKey,
            textColor,
            gradient,
          }) => (
            <div key={key} className={`${STAT_CARD} ${borderColor}`}>
              <div className="flex items-center gap-2 md:gap-3">
                <div className={`${ICON_WRAPPER} ${iconColor}`}>
                  <Icon className="size-4 md:size-5" />
                </div>

                <div className="min-w-0">
                  <p
                    className={`${VALUE_CLASS} ${
                      gradient
                        ? "bg-linear-to-r from-accent to-primary bg-clip-text text-transparent"
                        : textColor
                    }`}
                  >
                    {stats[valueKey as keyof typeof stats]}
                  </p>

                  <p className={LABEL_CLASS}>{label}</p>
                </div>
              </div>
            </div>
          )
        )}
      </div>

      {/* CONTENTS */}
      <div className="space-y-6">
        {/* FILTER */}
        <div className={FILTER_WRAPPER}>
          <div className="flex items-center gap-2 min-w-0">
            <assets.FilterIcon className="size-4 sm:size-5 text-primary shrink-0" />
            <h2 className="text-sm sm:text-base md:text-lg font-semibold text-neutral/80 dark:text-neutral-content/80 truncate">
              {FILTER_LABELS[filter as keyof typeof FILTER_LABELS] ||
                "All Tasks"}
            </h2>
          </div>

          <select
            id={"filter"}
            value={filter}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setFilter(e.target.value)
            }
            className={SELECT_CLASSES}
          >
            {FILTER_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>

          <div className={TABS_WRAPPER}>
            {FILTER_OPTIONS.map((option) => (
              <button
                key={option}
                onClick={() => setFilter(option)}
                className={`${TAB_BASE} ${
                  filter === option ? TAB_ACTIVE : TAB_INACTIVE
                }`}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* TASK LIST */}
        <div className="space-y-4">
          {sortedTasks.length === 0 ? (
            <div className={EMPTY_STATE.wrapper}>
              <div className={EMPTY_STATE.iconWrapper}>
                <assets.CalendarIcon className="size-8 text-primary" />
              </div>

              <h3 className="text-lg font-semibold text-neutral/80 dark:text-neutral-content/80 mt-2">
                No tasks found
              </h3>
              <p className="text-sm text-neutral/50 dark:text-neutral-content/50 mt-4">
                {filter === "all"
                  ? "Create your first task to get started!"
                  : "No tasks match the selected filter. Try changing the filter or adding new tasks."}
              </p>

              <button
                onClick={() => setShowModal(true)}
                className={EMPTY_STATE.btn}
              >
                Add New Task
              </button>
            </div>
          ) : (
            sortedTasks.map((task) => (
              <TaskItem
                key={task._id}
                task={task}
                onRefresh={refreshTasks}
                showCompleteCheckbox
                onTaskUpdate={updateTaskLocally}
              />
            ))
          )}
        </div>

        {/* ADD TASK DESKTOP VIEW */}
        <div
          onClick={() => setShowModal(true)}
          className="hidden md:flex items-center justify-center p-4 border-2 border-dashed border-primary/40
          rounded-xl hover:border-primary/80 bg-primary/10 dark:bg-primary/20 transition-colors duration-300 cursor-pointer"
        >
          <assets.PlusIcon className="size-5 text-primary mr-2" />
          <span className="text-neutral/60 dark:text-neutral-content/60 font-medium">
            Add New Task
          </span>
        </div>
      </div>

      {/* MODAL */}
      <TaskModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        taskToEdit={null}
        onSave={handleTaskSave}
      />
    </div>
  );
};

export default Dashboard;
