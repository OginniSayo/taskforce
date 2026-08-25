import { useMemo, useState, type JSX } from 'react'
import { CT_CLASSES, SORT_OPTIONS } from '../assets/dummy';
import { assets, type Task } from '../assets/assets';
import { useOutletContext } from 'react-router-dom';
import TaskItem from '../components/TaskItem';

const CompletePage = (): JSX.Element => {

  const {tasks, refreshTasks} = useOutletContext() as {
    tasks: Task[];
    refreshTasks: () => Promise<void>;
  }
  const [sortBy, setSortBy] = useState<string>('newest');

  const sortedCompleteTasks  = useMemo(() => {
    const filteredTasks = tasks.filter(task => task.completed)

    return filteredTasks.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();

        case 'priority': {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority.toLowerCase() as keyof typeof priorityOrder] - priorityOrder[a.priority.toLowerCase() as keyof typeof priorityOrder];
        }
        default: 
          return 0;
      }
    })

  }, [tasks, sortBy])

  return (
    <div className={CT_CLASSES.page}>
      {/* HEADER */}
      <div className={CT_CLASSES.header}>
        <div className={CT_CLASSES.titleWrapper}>
          <h1 className={CT_CLASSES.title}>
            <assets.CheckCircle2Icon className='text-primary size-5 md:size-6' />
            <span className='truncate'>
              Completed Tasks
            </span>
          </h1>

          <p className={CT_CLASSES.subtitle}>
            {sortedCompleteTasks.length}{" "} 
            task{sortedCompleteTasks.length !== 1 ? 's' : ''}{" "}
            marked as completed
          </p>
        </div>

        {/* SORT CONTROLS */}
        <div className={CT_CLASSES.sortContainer}>
          <div className={CT_CLASSES.sortBox}>
            <div className={CT_CLASSES.filterLabel}>
              <assets.FilterIcon className='size-4 text-primary' />
              <span className='text-xs md:text-sm'>
                Sort by:
              </span>
            </div>

            {/* MOBILE DROPDOWN */}
            <select 
              id="sortCompletedTasks"
              value={sortBy}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value)}
              className={CT_CLASSES.select}
            >
              {SORT_OPTIONS.map(option => (
                <option 
                  key={option.id} 
                  value={option.id}
                >
                  {option.label}
                  {option.id === 'newest' || option.id === 'oldest'
                  ? ' First'
                  : ''}
                </option>
              ))}
            </select>

            {/* DESKTOP SORTING OPTION BUTTONS */}
            <div className={CT_CLASSES.btnGroup}>
              {SORT_OPTIONS.map(option => (
                <button
                  key={option.id}
                  onClick={() => setSortBy(option.id)}
                  className={
                    [CT_CLASSES.btnBase,
                    sortBy === option.id 
                    ? CT_CLASSES.btnActive
                    : CT_CLASSES.btnInactive].join(' ')
                  }
                >
                  {option.icon}
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* TASK LIST */}
      <div className={CT_CLASSES.list}>
        {sortedCompleteTasks.length === 0
        ? (
          <div className={CT_CLASSES.emptyState}>
            <div className={CT_CLASSES.emptyIconWrapper}>
              <assets.CheckCircle2Icon className='size-6 md:size-8 text-primary' />
            </div>
            <h3 className={CT_CLASSES.emptyTitle}>
              No completed tasks yet!
            </h3>
            <p className={CT_CLASSES.emptyText}>
              Complete some tasks and they will appear here
            </p>
          </div>
        ) 
        : (
          sortedCompleteTasks.map(task => (
            <TaskItem 
              key={task._id}
              task={task}
              onRefresh={refreshTasks}
              showCompleteCheckbox={false}
              className='opacity-80 hover:opacity-100 transition-opacity text-sm md:text-base duration-400'
            />
          ))
        )}
      </div>
    </div>
  )
}

export default CompletePage;