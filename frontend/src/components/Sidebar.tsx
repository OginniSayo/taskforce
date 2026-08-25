import { type JSX, useEffect, useState } from 'react'
import { LINK_CLASSES, menuItems, PRODUCTIVITY_CARD, SIDEBAR_CLASSES, TIP_CARD } from '../assets/dummy'
import { assets } from '../assets/assets'
import { useTaskManagementContext } from '../context/TaskManagementContext'
import type { Task } from '../assets/assets'
import { NavLink } from 'react-router-dom'
import SidebarUserInfo  from './SidebarUserInfo'

type SidebarProps = {
  tasks: Task[]
}

const Sidebar = ({ tasks }: SidebarProps): JSX.Element => {

  const { currentUser } = useTaskManagementContext()

  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  // const [showModal, setShowModal] = useState<boolean>(false);

  const totalTasks = tasks?.length || 0
  const completedTasks = tasks?.filter(task => task.completed)?.length || 0
  const productivity = totalTasks > 0 
    ? Math.round((completedTasks / totalTasks) * 100) 
    : 0
  
  const username = currentUser?.name || "User"
  const initial =  username.charAt(0).toUpperCase()

  // close the mobile menu when the window is resized to a width greater than or equal to 1024px tailwind's lg: breakpoint
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // close the mobile menu when the escape key is pressed, and 
  // prevent scrolling when the mobile menu is open
  // also clean up the event listener and restore scrolling when the component unmounts or the mobile menu is closed
  
  useEffect(() => {
    if (!mobileMenuOpen) return;
  
    document.body.style.overflow = 'hidden';
  
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
  
    return () => {
      document.body.style.overflow = 'auto';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [mobileMenuOpen]);

  const renderMenuItems = (isMobile = false) => (
    <ul className='space-y-2'>
      {menuItems.map(({ text, path, icon }) => (
        <li key={text}>
          <NavLink 
            to={path}
            className={({ isActive }) => [
              LINK_CLASSES.base,
              isActive ? LINK_CLASSES.active : LINK_CLASSES.inactive,
              isMobile ? "justify-start" : "lg:justify-start"
            ].join(" ")} 
            onClick={() => isMobile && setMobileMenuOpen(false)}
          >
            <span className={LINK_CLASSES.icon}>
              {icon}
            </span>
            <span 
              className={`${isMobile ? "block" : "hidden lg:block"} ${LINK_CLASSES.text}`}
            >
              {text}
            </span>
          </NavLink>
        </li>
      ))}
    </ul>
  )

  return (
    <>
      {/* DESKTOP SIDEBAR */}

      <div className={SIDEBAR_CLASSES.desktop}>
        <div className='p-5 border-b border-primary/20 lg:block hidden'>
          <SidebarUserInfo initial={initial} username={username} />
        </div>

        <div className='p-4 space-y-6 overflow-y-auto flex-1'>
          <div className={PRODUCTIVITY_CARD.container}>
            <div className={PRODUCTIVITY_CARD.header}>
              <h3 className={PRODUCTIVITY_CARD.label}>PRODUCTIVITY</h3>
              <span className={PRODUCTIVITY_CARD.badge}>{productivity}%</span>
            </div>
            <div className={PRODUCTIVITY_CARD.barBg}>
              <div 
                className={PRODUCTIVITY_CARD.barFg} 
                style={{ width: `${productivity}%` }}
              />
            </div>
          </div>

          {renderMenuItems()}

          <div className='mt-auto pt-6 lg:block hidden'>
            <div className={TIP_CARD.container}>
              <div className='flex items-center gap-2'>
                <div className={TIP_CARD.iconWrapper}>
                  <assets.LightbulbIcon className='size-5 text-primary' />
                </div>

                <div>
                  <h3 className={TIP_CARD.title}>Pro Tip</h3>
                  <p className={TIP_CARD.text}>
                    Break tasks into smaller steps to make them more manageable and less overwhelming.
                  </p>
                  <a 
                    href="https://sayo-portfolio.vercel.app/"
                    target='_blank'
                    rel='noopener noreferrer'
                    className='block mt-2 text-xs text-primary hover:underline'
                  >
                    Visit Portfolio Website of the Developer
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {!mobileMenuOpen && (
        <button
          onClick={() => setMobileMenuOpen(true)}
          className={`${SIDEBAR_CLASSES.mobileButton} flex items-center gap-2`}
        >
          <assets.ChevronRightIcon className='size-6'/>
          {/* <span className='text-sm font-medium text-base-100 dark:text-neutral/90'>
            Menu
          </span> */}
        </button>
      )}

      {/* MOBILE DRAWER */}
      <div 
        className={`fixed inset-0 z-40 transition-opacity duration-300 ease-in-out
          ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        inert={!mobileMenuOpen}
      >
        <div 
          className={SIDEBAR_CLASSES.mobileDrawerBackdrop}
          onClick={() => setMobileMenuOpen(false)}
        />

        <div 
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          className={`${SIDEBAR_CLASSES.mobileDrawer}
            ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
          onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => e.stopPropagation()}
        >
          <div className='flex justify-between items-center mb-4 border-b border-primary/50 pb-2 mt-20 sm:mt-24'>
            <h2 className='text-lg font-bold text-primary'>Menu</h2>
            <button
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
              className='text-neutral/70 dark:text-neutral-content/80'
            >
              <assets.XIcon className='size-5' />
            </button>
          </div>

          <div className='my-6'>
            <SidebarUserInfo initial={initial} username={username} />
          </div>

          {renderMenuItems(true)}
        </div>
      </div>
      
    </>
  )
}

export default Sidebar
