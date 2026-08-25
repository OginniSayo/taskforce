import { useCallback, useMemo, useState, type JSX } from 'react'
import { layoutClasses, SORT_OPTIONS } from '../assets/dummy';
import { assets, type Task } from '../assets/assets';
import { useOutletContext } from 'react-router-dom';
import TaskItem from '../components/TaskItem';
import TaskModal from '../components/TaskModal';

const PendingPage = (): JSX.Element => {

  const {tasks = [], refreshTasks, updateTaskLocally} = useOutletContext() as {
    tasks: Task[];
    refreshTasks: () => Promise<void>;
    updateTaskLocally: (updatedTask: Task) => void;
  }
  const [sortBy, setSortBy] = useState<string>('newest');
  const [showModal, setShowModal] = useState<boolean>(false);

  const sortedPendingTasks = useMemo(() => {
    const filtered = tasks.filter(task => !task.completed);

    return filtered.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }

      const priorityOrder = {high: 3, medium: 2, low: 1};

      return priorityOrder[b.priority.toLowerCase() as keyof typeof priorityOrder] - priorityOrder[a.priority.toLowerCase() as keyof typeof priorityOrder];
    })
  }, [tasks, sortBy]);

  const handleTaskSave = useCallback(async (_task: Task) => {
    await refreshTasks();
    setShowModal(false);
  }, [refreshTasks]);

  return (
    <div className={layoutClasses.container}>
      <div className={layoutClasses.headerWrapper}>
        <div>
          <h1 className='text-2xl md:text-3xl font-bold text-neutral/80 dark:text-neutral-content/80 flex items-center gap-2'>
            <assets.ListChecksIcon className='text-primary' />
            Pending Task
          </h1>
          <p className='text-sm text-neutral/50 dark:text-neutral-content/50 mt-1 ml-7'>
            {sortedPendingTasks.length}{" "}
            task{sortedPendingTasks.length !== 1 ? 's' : ''} pending
            needing your attention
          </p>
        </div>

        <div className={layoutClasses.sortBox}>
          <div className='flex items-center gap-2 text-neutral/70 dark:text-neutral-content/70 font-medium'>
            <assets.FilterIcon className='size-4 text-primary' />
            <span className='text-sm'>Sort by:</span>
          </div>

          <select 
            id="sortPendingTasks" 
            value={sortBy}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value)}
            className={layoutClasses.select}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="priority">By Priority</option>
          </select>

          <div className={layoutClasses.tabWrapper}>
            {SORT_OPTIONS.map(option => (
              <button
                key={option.id}
                onClick={() => setSortBy(option.id)}
                className={layoutClasses.tabButton(sortBy === option.id)}
              >
                {option.icon}
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div 
        className={layoutClasses.addBox} 
        onClick={() => setShowModal(true)}
      >
        <div className='flex items-center justify-center gap-3 text-neutral/50 dark:text-neutral-content/50 group-hover:text-primary transition-colors duration-300'>
          <div className='size-8 rounded-full bg-base-100 flex items-center justify-center shadow:sm group-hover:shadow-md transition-shadow duration-300'>
            <assets.PlusIcon size={18} className='text-primary' />
          </div>

          <span className='font-medium'>
            Add New Task
          </span>
        </div>
      </div>

      <div className='space-y-4'>
        {sortedPendingTasks.length === 0 
        ? (
          <div className={layoutClasses.emptyState}>
            <div className='max-w-sm mx-auto py-6'>
              <div className={layoutClasses.emptyIconBg}>
                <assets.ClockIcon className='size-8 text-primary' />
              </div>

              <h3 className='text-lg font-semibold text-neutral/80 dark:text-neutral-content/80 mb-2'>
                All caught up!
              </h3>
              <p className='text-sm text-neutral/50 dark:text-neutral-content/50 mb-4'>
                No pending tasks - great work!
              </p>
              <button
                onClick={() => setShowModal(true)}
                className={layoutClasses.emptyBtn}
              >
                Create New Task
              </button>
            </div>
          </div>
        )
        : (
          sortedPendingTasks.map(task => (
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

      <TaskModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        taskToEdit={null}
        onSave={handleTaskSave}
      />
    </div>
  )
}

export default PendingPage;