import { type JSX, useState, useEffect } from 'react'
import { assets } from '../assets/assets'
import { BUTTON_CLASSES, INPUTWRAPPER } from '../assets/dummy'
import axios from 'axios'
import api from '../utils/api'
import { toast } from 'react-toastify'
import ThemeController from './ThemeController'
import { useTaskManagementContext } from '../context/TaskManagementContext'
import { getAuthStorage } from '../utils/authStorage';
import type { GetProfileResponse, LoginResponse } from '../types/api'

const INITIAL_FORM = { email: "", password: "" }

type LoginProps = {
  onSwitchMode: () => void
}

const Login = ({ onSwitchMode }: LoginProps): JSX.Element => {

  const { navigate, handleAuthSubmit } = useTaskManagementContext();

  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [rememberMe, setRememberMe] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [formData, setFormData] = useState(INITIAL_FORM)

  useEffect(() => {
    const token = getAuthStorage().getItem('token');

    if (token) {
      (async () => {
        try {
          const response = await api.get<GetProfileResponse>(`/api/user/me`)

          if (response.data.success) {
            handleAuthSubmit({
              email: response.data.user.email,
              name: response.data.user.name,
              token: token,
              id: response.data.user.id || ''
            })
            toast.success("Session restored. Redirecting to dashboard...");

          } else {
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            localStorage.removeItem('currentUser');
          }
        } catch (err) {

          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          localStorage.removeItem('currentUser');

          if (axios.isAxiosError(err)) {
            const errorMsg = err.response?.data?.message || "An error occurred. Please try again";
            console.error("Error during login:", err);
            toast.error(errorMsg);
          } else {
            console.error("Unexpected error during login:", err);
            toast.error("An unexpected error occurred. Please try again");
          }
        }
      })()
    }
  }, [handleAuthSubmit, navigate])

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      
      const response = await api.post<LoginResponse>('/api/user/login', formData);

      if (!response.data.token || !response.data.user) {
        toast.error(response.data?.message || "Login failed. Please try again.");
        return;
      }

      setFormData(INITIAL_FORM);
      handleAuthSubmit({
        email: response.data.user.email,
        name: response.data.user.name,
        token: response.data.token,
        id: response.data.user.id,
        rememberMe
      });

      toast.success("Login successful! Redirecting to dashboard...");
      setTimeout(() => navigate('/'), 1000 )

    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errorMsg = err.response?.data?.message || "An error occurred. Please try again";
        console.error("Error during login:", err);
        toast.error(errorMsg);
      } else {
        console.error("Unexpected error during login:", err);
        toast.error("An unexpected error occurred. Please try again");
      }

    } finally {
        setIsLoading(false);
    }

  }

  const handleSwitchMode = () => {
    toast.dismiss()
    onSwitchMode()
  }


  const loginFields = [
    {
      name: "email",
      type: "email",
      placeholder: "Email",
      icon: assets.MailIcon,
    },
    {
      name: "password",
      type: showPassword ? "text" : "password",
      placeholder: "Password",
      icon: assets.LockIcon,
      isPassword: true,
    }
  ]

  return (
    <div className='max-w-md bg-base-100 w-full shadow-lg border border-primary/20 rounded-xl p-8'>
      
      <div className='absolute top-4 right-4 bg-base-100 p-2 border border-primary/30 rounded-full hover:bg-base-200 transition-colors cursor-pointer'>
        <ThemeController />
      </div>

      <div className='mb-6 text-center'>
        <div className='size-16 bg-linear-to-br from-secondary to-primary rounded-full mx-auto flex items-center justify-center mb-4'>
          <assets.LogInIcon className='size-8 text-base-100' />
        </div>
        <h2 className='text-2xl sm:text-3xl font-bold text-neutral/80 dark:text-neutral-content/80'>
          Welcome Back
        </h2>
        <p className='text-sm sm:text-base text-neutral/50 dark:text-neutral-content/50 mt-1'>
          Sign in to continue to Task Force
        </p>
      </div>

      <form onSubmit={handleSubmit} className='space-y-4'>
        {loginFields.map(({ name, type, placeholder, icon: Icon, isPassword }) => (
          
          <div key={name} className={INPUTWRAPPER}>
            <Icon className='text-primary size-5 mr-2' />
            <input 
              type={isPassword ? (showPassword ? 'text' : 'password') : type} 
              placeholder={placeholder} 
              value={formData[name as keyof typeof formData]}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  setFormData({ ...formData, [name]: e.target.value }
                )}
              className='w-full focus:outline-none text-sm text-neutral/70 dark:text-neutral-content/70'
            />

            {isPassword && (
              <button 
                type='button' 
                onClick={() => setShowPassword(prev => !prev)}
                className='ml-2 text-neutral/50 dark:text-neutral-content/50 hover:text-primary transition-colors duration-300 cursor-pointer'
              >
                {showPassword 
                  ? <assets.EyeOffIcon className='size-5' /> 
                    : <assets.EyeIcon className='size-5' />}
              </button>
            )}
          </div>

        ))}

        <div className='flex items-center'>
          <input 
            type="checkbox" 
            id="rememberMe"
            checked={rememberMe}
            onChange={() => setRememberMe(prev => !prev)}
            className='accent-primary cursor-pointer size-3 text-primary focus:ring-primary/80 border-neutral/50 dark:border-neutral-content/50 rounded transition-colors duration-300'
          />
          <label 
            htmlFor="rememberMe" 
            className='ml-2 block text-sm text-neutral/70 dark:text-neutral-content/70 font-medium'
          >
            Remember Me
          </label>
        </div>

        <button 
          type="submit"
          className={BUTTON_CLASSES}
          disabled={isLoading}
        >
          {isLoading 
          ? (
              <div className="flex items-center justify-center gap-2">
                <assets.LoaderIcon className="animate-spin" />
                Logging In...
              </div>
            )
          : (
              <>
                <assets.UserPlus2Icon className='size-4 mr-2' />
                Log In
              </>
            )}
        </button>
      </form>

      <p className='text-center text-sm text-neutral/60 dark:text-neutral-content/60 mt-6'>
        Don't have an account?{" "}
        <button 
          type="button" 
          className='text-primary hover:text-accent hover:underline cursor-pointer ml-1 font-medium transition-colors' 
          onClick={handleSwitchMode}
        >
          Sign Up
        </button>
      </p>
    </div>
  )
}

export default Login