import type { JSX } from 'react'

type StatCardProps = { 
  title: string; 
  value: number | string;
  icon: JSX.Element;
}

// StatCard component to display individual statistics

const StatCard = ({ title, value, icon }: StatCardProps) => {
  const Icon = icon;

  return (
  <div className='p-2 sm:p-3 rounded-xl bg-base-100 shadow-sm border border-primary/30
  hover:shadow-md transition-all duration-300 hover:border-primary/50 group'>
    <div className='flex items-center gap-2'>
      <div className='p-1.5 rounded-lg bg-linear-to-br from-primary/20 to-secondary/20 
      group-hover:from-primary/30 group-hover:to-secondary/30 transition-all duration-300'>
        {Icon}
      </div>
      <div className='min-w-0'>
        <p className='text-lg sm:text-xl font-bold bg-linear-to-r from-primary to-secondary
        bg-clip-text text-transparent'>
          {value}
        </p>
        <p className='text-[10px] sm:text-xs text-neutral/50 dark:text-neutral-content/50 font-medium'>
          {title}
        </p>
      </div>
    </div>
  </div>
)}

export default StatCard
