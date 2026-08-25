import { useEffect, useRef, useState, type JSX } from 'react'
import type { Task } from '../assets/assets'
import { getPriorityBadgeColor, getPriorityColor, MENU_OPTIONS, TI_CLASSES } from '../assets/dummy';
import { assets } from '../assets/assets';
import api from '../utils/api';
import axios from 'axios';
import { useTaskManagementContext } from '../context/TaskManagementContext';
import { toast } from 'react-toastify';
import { format, isToday } from 'date-fns';
import TaskModal from './TaskModal';
import { parseLocalDate, startOfToday } from '../utils/dateHelpers';
import ConfirmDialog from './ConfirmDialog';

type TaskItemProps = {
  task: Task;
  onRefresh: () => Promise<void>;
  showCompleteCheckbox: boolean;
  onTaskUpdate?: (updatedTask: Task) => void;
  className?: string;
}

const TaskItem = ({ task, onRefresh, showCompleteCheckbox = true, onTaskUpdate, className }: TaskItemProps): JSX.Element => {

  const { handleLogout } = useTaskManagementContext()
  
  const [showMenu, setShowMenu] = useState<boolean>(false)
  const [isCompleted, setIsCompleted] = useState<boolean>(task.completed)
  const [showEditModal, setShowEditModal] = useState<boolean>(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false)

  const taskMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsCompleted(task.completed)
  }, [task.completed]);

  useEffect(() => {
    if (!showMenu) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      if (taskMenuRef && 
        !taskMenuRef.current?.contains(target)) {
        setShowMenu(false);
        }

    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu])

  const isOverdue = !isCompleted && task.dueDate
  ? parseLocalDate(task.dueDate) < startOfToday()
  : false;

  const borderColorLight = getPriorityColor(task.priority).split(" ")[0] // to get the border color for light
  const borderColorDark = getPriorityColor(task.priority).split(" ")[1] // to get the border color for dark
  
  const borderColorBothLightAndDark = `${borderColorLight} ${borderColorDark}` // to get the border color alone for both light and dark

  const borderColor = isCompleted 
    ? 'border-green-400 dark:border-success' 
    : borderColorBothLightAndDark

  const handleComplete = async () => {
    const newStatus = !isCompleted

    try {
      const response = await api.put<{ success: boolean; task: Task }>(`/api/tasks/${task._id}`, { completed: newStatus });
      onTaskUpdate && onTaskUpdate(response.data.task);
      toast.success(`Task marked as ${newStatus ? 'completed' : 'incomplete'}`);
    } catch (err) {

      setIsCompleted(!newStatus); // revert the state change if the API call fails

      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          handleLogout();
          return;
        }
        const message = err.response?.data?.message || 'Failed to toggle task as completed. Please try again';
        console.error('Error toggling task to complete:', err);
        toast.error(message);
      } else {
        console.error('Unexpected error toggling task to complete:', err);
        const message = 'Failed to toggle task as completed. An unexpected error occurred.';
        toast.error(message);
      }
    }
  }

  const handleDelete = async () => {
    try {
      await api.delete(`/api/tasks/${task._id}`);
      await onRefresh();
      toast.success('Task deleted successfully');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          handleLogout();
          return;
        }
        const message = err.response?.data?.message || 'Failed to delete task. Please try again';
        console.error('Error deleting task:', err);
        toast.error(message);
      } else {
        console.error('Unexpected error deleting task:', err);
        const message = 'Failed to delete task. An unexpected error occurred.';
        toast.error(message);
      }
    } finally {
      setShowDeleteConfirm(false);
    }
  }

  const handleSave = async (updatedTask: Task) => {
    try {

      onTaskUpdate && onTaskUpdate(updatedTask); 
      setShowEditModal(false);

    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          handleLogout();
          return;
        }
        const message = err.response?.data?.message || 'Failed to update task. Please try again';
        console.error('Error updating task:', err);
        toast.error(message);
      } else {
        console.error('Unexpected error updating task:', err);
        const message = 'Failed to update task. An unexpected error occurred.';
        toast.error(message);
      }
    }
  }

  const handleAction = (action: string) => {
    setShowMenu(false)

    switch (action) {
      case 'edit':
        setShowEditModal(true);
        break;
      case 'delete':
        setShowDeleteConfirm(true);
        break;
      }
  }

  return (
    <>
      <div className={`${TI_CLASSES.wrapper} ${borderColor} ${className ?? ''}`}>
        <div className={TI_CLASSES.leftContainer}>
          {showCompleteCheckbox && (
            <button
              onClick={handleComplete}
              className={`${TI_CLASSES.completeBtn} ${isCompleted
                ? 'text-green-400 dark:text-success' 
                : 'text-neutral/50 dark:text-neutral-content/50 hover:text-green-200 dark:hover:text-success/60 transition-colors duration-300'
              }`}
            >
              <assets.CheckCircle2Icon 
                size={18}
                className={`${TI_CLASSES.checkboxIconBase} ${isCompleted
                  ? 'fill-base-100'
                  : ''
                }`} 
              />
            </button>
          )}

          <div className='flex-1 min-w-0'>
            <div className='flex items-baseline gap-2 mb-1 flex-wrap'>
              <h3 className={`${TI_CLASSES.titleBase} ${isCompleted 
                ? 'text-neutral/40 dark:text-neutral-content/40 line-through'
                : 'text-neutral/80 dark:text-neutral-content/80'
              }`}>
                {task.title}
              </h3>

              <span 
                className={`${TI_CLASSES.priorityBadge} 
                ${getPriorityBadgeColor(task.priority)}`}
              >
                {task.priority}
              </span>

              {isOverdue && (
                <span className='flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-error/20 text-error font-medium shrink-0'>
                  <assets.AlertTriangleIcon className='size-3' />
                  Overdue
                </span>
              )}
            </div>

            {task.description && (
              <p className={TI_CLASSES.description}>
                {task.description}
              </p>
            )}
          </div>
        </div>

        <div className={TI_CLASSES.rightContainer}>
          <div className='relative' ref={taskMenuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className={TI_CLASSES.menuButton}
            >
              <assets.MoreVerticalIcon className='size-4 sm:size-5' />
            </button>

            {showMenu && (
              <div 
                className={TI_CLASSES.menuDropdown}
              >
                {MENU_OPTIONS.map(option => (
                  <button 
                    key={option.action}
                    onClick={() => handleAction(option.action)}
                    className='w-full px-3 sm:px-4 py-2 text-left text-xs sm:text-sm hover:bg-primary/10
                    flex items-center gap-2 transition-colors duration-200 cursor-pointer'
                  >
                    {option.icon}
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className='flex flex-col items-end gap-1 sm:gap-1.5'>
            <div 
              className={`${TI_CLASSES.dateRow} ${
                isOverdue
                  ? 'text-error font-medium'
                  : task.dueDate && isToday(new Date(task.dueDate))
                    ? 'text-secondary dark:text-accent'
                    : 'text-neutral/50 dark:text-neutral-content/50'
              }`}
            >
                <assets.CalendarIcon className='size-3.5' />
                {task.dueDate 
                  ? (isToday(new Date(task.dueDate)) 
                    ? 'Today' : format(new Date(task.dueDate), 'MMM dd'))
                    : '-'}
            </div>

            <div className={TI_CLASSES.createdRow}>
              <assets.ClockIcon className='size-3 sm:size-3.5' />
              {task.createdAt 
              ? `Created ${format(new Date(task.createdAt), 'MMM dd')}`
              : 'No created date'}
            </div>
          </div>
        </div>
      </div>

      <TaskModal 
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        taskToEdit={task}
        onSave={handleSave}
      />

      <ConfirmDialog 
        isOpen={showDeleteConfirm}
        title='Delete Task'
        message={`Are you sure you want to delete "${task.title}"? This cannot be undone.`}
        confirmLabel='Delete'
        variant='danger'
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </>
  )
}

export default TaskItem