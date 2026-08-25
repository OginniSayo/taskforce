import { type JSX, useState } from 'react'
import { assets } from '../assets/assets'
import { BUTTONCLASSES, FIELDS, Inputwrapper, MESSAGE_ERROR, MESSAGE_SUCCESS } from '../assets/dummy'
import axios from 'axios'
import api from '../utils/api'
import { toast } from 'react-toastify'
import ThemeController from './ThemeController'

const INITIAL_FORM = { name: "", email: "", password: "" }

type SignUpProps = {
  onSwitchMode: () => void
}

const SignUp = ({ onSwitchMode }: SignUpProps): JSX.Element => {

  const [formData, setFormData] = useState(INITIAL_FORM)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      setMessage({ text: "Please fill in all fields", type: "error" });
      toast.error(message.text);
      return;
    }

    setIsLoading(true);
    setMessage({ text: "", type: "" });

    try {
      
      const response = await api.post('/api/user/register', formData);
      console.log("Sign up successful:", response.data);

      const text = "Registration successful! You can now log in";
      setMessage({ text, type: "success" });
      setFormData(INITIAL_FORM);
      toast.success(text);

    } catch (err) {
      if (axios.isAxiosError(err)) {
        const text = err.response?.data?.message || "An error occured. Please try again";
        setMessage({ text, type: "error" });
        console.error("Error during sign up:", err);
        toast.error(text);
      }

    } finally {
        setIsLoading(false);
    }
  }

  return (
    <div className='max-w-md w-full bg-base-100 shadow-lg border border-primary/30 rounded-xl p-8'>
      
      <div className='absolute top-4 right-4 bg-base-100 p-2 border border-primary/30 rounded-full hover:bg-base-200 transition-colors cursor-pointer'>
        <ThemeController />
      </div>

      <div className='text-center mb-6'>
        <div className='size-16 bg-linear-to-br from-secondary to-primary rounded-full mx-auto
        flex items-center justify-center mb-4'>
          <assets.UserPlus2Icon className='size-8 text-base-100' />
        </div>
        <h2 className='text-2xl sm:text-3xl font-bold text-neutral/80 dark:text-neutral-content/80'>
          Create Account
        </h2>
        <p className='text-sm sm:text-base text-neutral/50 dark:text-neutral-content/50 mt-1'>
          Join Task Force to manage your tasks efficiently
        </p>
      </div>

      {message.text && (
        <div className={message.type === 'success' ? MESSAGE_SUCCESS : MESSAGE_ERROR}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className='space-y-4'>
        {FIELDS.map(({ name, type, placeholder, icon: Icon } ) => (
          <div key={name} className={Inputwrapper}>
            <Icon className='text-primary size-5 mr-2' />

            <input 
              type={type} 
              placeholder={placeholder} 
              value={formData[name as keyof typeof formData]}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                  setFormData({ ...formData, [name]: e.target.value }
                )}
              className='w-full focus:outline-none text-sm text-neutral/70 dark:text-neutral-content/70'
            />
          </div>
        ))}

        <button type="submit" className={BUTTONCLASSES} disabled={isLoading}>
          {isLoading 
          ? (
              <div className="flex items-center justify-center gap-2">
                <assets.LoaderIcon className="animate-spin" />
                Signing Up...
              </div>
            )
          : (
              <>
                <assets.UserPlus2Icon className='size-4 mr-2' />
                Sign Up
              </>
            )}
        </button>
      </form>

      <p className='text-sm text-neutral/60 dark:text-neutral-content/60 mt-6 text-center'>
        Already have an account?{" "}
        <button
          className='text-primary hover:text-accent hover:underline cursor-pointer ml-1 font-medium transition-colors'
          onClick={onSwitchMode}
        >
          Log In
        </button>
      </p>
    </div>
  )
}

export default SignUp
