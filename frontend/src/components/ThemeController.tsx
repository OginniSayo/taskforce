import { type JSX } from 'react'
import { assets } from '../assets/assets'
import { useThemeContext } from '../context/ThemeContext';

const ThemeController = (): JSX.Element => {

  const { theme, toggleTheme } = useThemeContext();

  const isDark = theme === 'dim';

  return (
    <>
      <div className='hidden sm:flex md:hidden'>
        <label className="swap swap-rotate cursor-pointer">
          <input 
            type="checkbox" 
            checked={isDark}
            onChange={toggleTheme}
          />
          <assets.SunIcon size={22} className="swap-off text-accent-content/70" />
          <assets.MoonIcon size={22} className="swap-on text-primary" />
        </label>
      </div>

      <label className="flex sm:hidden md:flex items-center gap-2 sm:gap-0.5 lg:gap-2 cursor-pointer">
        <assets.SunIcon size={18} className="text-accent-content dark:text-neutral-content shrink-0" />
        <input 
          type="checkbox" 
          className="toggle toggle-secondary text-primary" 
          checked={isDark}
          onChange={toggleTheme}
        />
        <assets.MoonIcon size={18} className="text-accent-content dark:text-neutral-content shrink-0" />
      </label>
    </>
  )
}

export default ThemeController
