import type { JSX } from 'react'
import { assets } from '../assets/assets';

type SidebarUserInfoProps = {
  initial: string;
  username: string 
}

const SidebarUserInfo = ({ initial, username }: SidebarUserInfoProps): JSX.Element => (
  <div className='flex items-center gap-3'>
    <div className="size-10 rounded-full bg-linear-to-br from-accent to-primary flex items-center justify-center text-base-content/90 dark:text-neutral shadow-md">
      {initial}
    </div>
    <div>
      <h2 className='text-lg font-bold text-neutral/90 dark:text-neutral-content/90'>
        Hey, {username}
      </h2>
      <p className='text-xs text-primary font-medium flex items-center gap-1'>
        <assets.SparklesIcon className='size-3' />
        Let's crush some tasks!
      </p>
    </div>
  </div>
);

export default SidebarUserInfo
