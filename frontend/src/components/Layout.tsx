import { type JSX, useCallback, useEffect, useMemo, useState } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import StatCard from './StatCard'
import { Outlet } from 'react-router-dom'
import { type Task, assets } from '../assets/assets'
import axios from 'axios'
import api from '../utils/api'
import { toast } from 'react-toastify'
import { useTaskManagementContext } from '../context/TaskManagementContext'
import { getAuthStorage } from '../utils/authStorage'

const Layout = (): JSX.Element => {

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { handleLogout } = useTaskManagementContext()

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = getAuthStorage().getItem('token');
      if (!token) {
        handleLogout();
        return;
      }

      const { data } = await api.get('/api/tasks');

      const arr = Array.isArray(data) ? data
        : Array.isArray(data?.tasks) ? data.tasks
          : Array.isArray(data?.data) ? data.data : [];

      setTasks(arr);

    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message || 'Could not load tasks';
        console.error(err);
        setError(message);
        toast.error(message, { position: 'top-center' });

        if (err.response?.status === 401) {
          handleLogout();
        }
        // always add the handleLogout call here if the status is 401,
        // to ensure the user is logged out on unauthorized access
        // do this for every component that requires authentication
      } else {
        setError('Could not load tasks');
      }

    } finally {
      setIsLoading(false);
    }
  }, [handleLogout]);

  const updateTaskLocally = useCallback((updatedTask: Task) => {
    setTasks(prev => prev.map(t => t._id === updatedTask._id ? updatedTask : t));
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const stats = useMemo(() => {
    const completedTasks = tasks.filter(task => task.completed === true).length;

    const totalCount = tasks.length;
    const pendingCount = totalCount - completedTasks;
    const completionPercentage = totalCount > 0
      ? Math.round((completedTasks / totalCount) * 100)
      : 0;

    return {
      completedTasks,
      pendingCount,
      totalCount,
      completionPercentage
    }
  }, [tasks]);

  const recentActivity = useMemo(
    () =>
      [...tasks]
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 3),
    [tasks]
  );

  // LOADING
  if (isLoading) return (
    <div className='min-h-screen bg-base-200 flex items-center justify-center'>
      <div className='animate-spin'>
        <assets.LoaderIcon size={36} className='text-secondary' />
      </div>
    </div>
  )

  if (error) return (
    <div className='min-h-screen bg-base-200 p-6 flex items-center justify-center'>
      <div className='bg-error/20 text-error p-4 rounded-xl border border-error/30 w-sm flex flex-col items-center'>
        <p className='font-medium mb-2'>Error loading tasks</p>
        <p className='text-sm text-neutral/80 dark:text-neutral-content'>{error}</p>
        <button
          onClick={fetchTasks}
          className='mt-4 py-2 px-4 bg-error/30 text-base-100 rounded-lg text-sm font-medium 
          hover:bg-error/40 transition-colors duration-300 cursor-pointer'
        >
          Try Again
        </button>
      </div>
    </div>
  )

  return (
    <div className='min-h-screen bg-base-200'>
      <Navbar />
      <Sidebar tasks={tasks} />

      <div className='ml-0 lg:ml-64 xl:ml-96 pt-18 p-3 sm:p-4 sm:pt-16 transition-all duration-300'>
        <div className='grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6'>

          <div className='xl:col-span-2 space-y-3 sm:space-y-4'>
            <Outlet context={{ tasks, refreshTasks: fetchTasks, updateTaskLocally }} />
          </div>

          <div className='xl:col-span-1 space-y-4 sm:space-y-6'>
            <div className='bg-base-100 rounded-xl p-4 sm:p-5 shadow-sm border border-primary/30'>
              <h3 className='text-base sm:text-lg font-semibold text-neutral/80 
              dark:text-neutral-content/80 mb-3 sm:mb-4 flex items-center gap-2'>
                <assets.TrendingUpIcon className='w-4 h-4 sm:w-5 sm:h-5 text-primary' />
                Task Statistics
              </h3>

              <div className='grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6'>
                <StatCard
                  title='Total Tasks'
                  value={stats.totalCount}
                  icon={<assets.CircleIcon className='size-3.5 sm:size-4 text-primary' />}
                />
                <StatCard
                  title='Completed'
                  value={stats.completedTasks}
                  icon={<assets.CheckIcon strokeWidth={3} className='size-3.5 sm:size-4 text-green-700 dark:text-success' />}
                />
                <StatCard
                  title='Pending'
                  value={stats.pendingCount}
                  icon={<assets.EllipsisIcon className='size-3.5 sm:size-4 text-secondary' />}
                />
                <StatCard
                  title='Completion Rate'
                  value={`${stats.completionPercentage}%`}
                  icon={<assets.ZapIcon className='size-3.5 sm:size-4 text-primary' />}
                />
              </div>

              <hr className='my-3 sm:my-4 border-primary/20' />

              <div className='space-y-2 sm:space-y-3'>
                <div className='flex items-center justify-between text-neutral/70 dark:text-neutral-content/70'>
                  <span className='text-xs sm:text-sm font-medium flex items-center gap-1.5'>
                    <assets.CircleIcon className='w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary fill-primary' />
                    Task Progress
                  </span>

                  <span className='text-xs bg-primary/20 text-primary dark:text-neutral-content px-1.5 py-0.5 sm:px-2 rounded-full'>
                    {stats.completedTasks} / {stats.totalCount}
                  </span>
                </div>

                <div className='relative pt-1'>
                  <div className='flex gap-1.5 items-center'>
                    <div className='flex-1 h-2 sm:h-3 bg-primary/20 rounded-full overflow-hidden'>
                      <div
                        className='h-full bg-linear-to-r from-accent to-primary transition-all duration-500'
                        style={{ width: `${stats.completionPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='bg-base-100 rounded-xl p-4 sm:p-5 shadow-sm border border-primary/30'>
              <h3 className='text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-neutral/80 dark:text-neutral-content/80 flex items-center gap-2'>
                <assets.ClockIcon className='w-4 h-4 sm:w-5 sm:h-5 text-primary' />
                Recent Activity
              </h3>

              <div className='space-y-2 sm:space-y-3'>
                {recentActivity.map(task => (
                  <div key={task._id} className='flex items-center justify-between p-2 sm:p-3 rounded-lg bg-base-200 hover:bg-base-300 border border-transparent hover:border-primary/20 transition-colors duration-300'>
                    <div className='min-w-0 flex-1'>
                      <p className='text-sm sm:text-base text-neutral/70 dark:text-neutral-content/70 font-medium truncate whitespace-normal'>
                        {task.title}
                      </p>
                      <span className='text-xs sm:text-sm text-neutral/50 dark:text-neutral-content/50'>
                        {new Date(task.updatedAt).toLocaleString()}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full shrink-0 ml-2
                        ${task.completed ? 'bg-success/20 text-success' : 'bg-secondary/20 text-secondary'}`}>
                          {task.completed ? 'Completed' : 'Pending'}
                      </span>
                    </div>
                  </div>
                ))}

                {tasks.length === 0 && (
                  <div className='text-center py-4 sm:py-6 px-2'>
                    <div className='size-12 sm:size-16 mx-auto sm:b-4 rounded-full flex items-center justify-center'>
                      <assets.ClockIcon className='size-6 sm:size-10 text-primary' />
                    </div>
                    <p className='text-sm text-neutral/70 dark:text-neutral-content/70 font-medium'>
                      No recent activity
                    </p>
                    <p className='text-xs text-neutral/50 dark:text-neutral-content/50 mt-1'>
                      Tasks will appear here 
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Layout