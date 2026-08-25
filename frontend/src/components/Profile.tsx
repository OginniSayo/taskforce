import React, { type JSX, type SyntheticEvent, useEffect, useState } from 'react'
import { useTaskManagementContext } from '../context/TaskManagementContext'
import { BACK_BUTTON, DANGER_BTN, FULL_BUTTON, INPUT_WRAPPER, personalFields, SECTION_WRAPPER, securityFields } from '../assets/dummy'
import { assets } from '../assets/assets'
import { getAuthStorage } from '../utils/authStorage'
import api from '../utils/api'
import { toast } from 'react-toastify'
import axios from 'axios'
import type { ProfileType, PasswordUpdate, GetProfileResponse, UpdateProfileResponse } from '../types/api'

const Profile = (): JSX.Element => {

  const { setCurrentUser, navigate, handleLogout } = useTaskManagementContext()

  const [profile, setProfile] = useState<ProfileType>({ name: '', email: '' });
  const [passwords, setPasswords] = useState<PasswordUpdate>({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    const token = getAuthStorage().getItem('token');
  
    if (!token) {
      handleLogout();
      return;
    }
  
    api.get<GetProfileResponse>('/api/user/me')
      .then(({ data }) => {
        if (data.success) {
          setProfile({ name: data.user.name, email: data.user.email });
          setCurrentUser((prev) => prev ? {
            ...prev,
            name: data.user.name,
            email: data.user.email
          } : prev);
        } else {
          toast.error(data.message || "Failed to load profile");
          console.error("Failed to fetch user profile");
        }
      })
      .catch((err) => {
        toast.error("Unable to load profile");
        console.error("Error fetching user profile:", err);
      });
  }, []);

  const saveProfile = async (e: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    e.preventDefault();

    setIsLoading(true)

    try {
      
      const response = await api.put<UpdateProfileResponse>('/api/user/profile', { 
        name: profile.name,
        email: profile.email,
      })
      
      if (response.data.success) {
        setCurrentUser((prev) =>  prev 
        ? {
          ...prev,
          name: profile.name,
          email: profile.email,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name || 'User')}&background=random`,
        } 
        : prev )
        toast.success('Profile Updated')
      } else {
        const errMessage = response.data.message || 'Failed to update profile';
        toast.error(errMessage);
      }

    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errorMsg = err.response?.data?.message || "Profile update failed. Please try again";
        console.error("Error during profile update: ", err);
        toast.error(errorMsg);
      } else {
        console.error("Unexpected error during profile update: ", err);
        toast.error("An unexpected error occurred. Please try again");
      }

    } finally {
        setIsLoading(false);
    }
  }

  const changePassword = async (e: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    e.preventDefault()

    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    try {

      const { data } = await api.put('/api/user/password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      })

      if (data.success) {
        toast.success('Password changed successfully')
        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' })
      } else {
        const errMessage = data.message || 'Failed to change password'
        toast.error(errMessage)
      }

    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errorMsg = err.response?.data?.message || "Password change failed. Please try again";
        console.error("Error during password change: ", err);
        toast.error(errorMsg);
      } else {
        console.error("Unexpected error during password change: ", err);
        toast.error("An unexpected error occurred. Please try again");
      }

    } finally {
        setIsLoading(false);
    }
  }

  return (
    <div className='min-h-screen bg-base-200'>
      <div className='max-w-4xl mx-auto p-6'>
        <button onClick={() => navigate('/')} className={`-ml-3 ${BACK_BUTTON}`}>
          <assets.ChevronLeftIcon className='size-5 mr-1' />
          Back to Dashboard
        </button>

        <div className='flex items-center gap-4 mb-8'>
          <div className='size-12 sm:size-16 rounded-full bg-linear-to-br from-secondary to-primary
          flex items-center justify-center text-base-100 text-2xl font-bold shadow-md'
          >
            {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
          </div>

          <div>
            <h1 className='text-xl sm:text-3xl font-bold text-neutral/80 dark:text-neutral-content/80'>
              Account Settings
            </h1>  
            <p className='text-xs sm:text-sm text-neutral/50 dark:text-neutral-content/50'>
              Manage your profile and security settings
            </p>
          </div>
        </div>

        <div className='grid md:grid-cols-2 gap-8'>
          <section className={SECTION_WRAPPER}>
            <div className='flex items-center gap-2 mb-6'>
              <assets.UserCircleIcon className='text-primary size-5' />
              <h2 className='text-lg sm:text-xl font-semibold text-neutral/80 dark:text-neutral-content/80'>
                Personal Information
              </h2>
            </div>

            {/* PERSONAL INFO, NAME, EMAIL */}

            <form onSubmit={saveProfile} className='space-y-4'>
              {personalFields.map(({ name, type, placeholder, icon:Icon }) => (
                <div key={name} className={INPUT_WRAPPER}>
                  <Icon className='text-primary size-5 mr-2' />
      
                  <input 
                    type={type} 
                    placeholder={placeholder} 
                    id={name}
                    value={profile[name as keyof typeof profile]}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        setProfile({ ...profile, [name]: e.target.value }
                      )}
                    className='w-full focus:outline-none text-sm text-neutral/70 dark:text-neutral-content/70'
                  />
                </div>
              ))}

              <button type="submit" className={FULL_BUTTON} disabled={isLoading}>
                {isLoading 
                ? (
                    <div className="flex items-center justify-center gap-2">
                      <assets.LoaderIcon className="animate-spin" />
                      Saving Changes...
                    </div>
                  )
                : (
                    <>
                      <assets.SaveIcon className='size-4' />
                      Save Changes
                    </>
                  )}
              </button>
            </form>
          </section>

          <section className={SECTION_WRAPPER}>
            <div className='flex items-center gap-2 mb-6'>
              <assets.ShieldIcon className='text-primary size-5' />
              <h2 className='text-lg sm:text-xl font-semibold text-neutral/80 dark:text-neutral-content/80'>
                Security
              </h2>
            </div>

            <form onSubmit={changePassword} className='space-y-4'>
              {securityFields.map(({ name, placeholder }) => (
                <div key={name} className={INPUT_WRAPPER}>
                  <assets.LockIcon className='text-primary size-5 mr-2' />
      
                  <input 
                    type="password"
                    placeholder={placeholder} 
                    id={name}
                    value={passwords[name as keyof typeof passwords]}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        setPasswords({ ...passwords, [name]: e.target.value }
                      )}
                    className='w-full focus:outline-none text-sm text-neutral/70 dark:text-neutral-content/70'
                  />
                </div>
              ))}

              <button type="submit" className={FULL_BUTTON} disabled={isLoading}>
                {isLoading 
                ? (
                    <div className="flex items-center justify-center gap-2">
                      <assets.LoaderIcon className="animate-spin" />
                      Changing Password...
                    </div>
                  )
                : (
                    <>
                      <assets.ShieldIcon className='size-4' />
                      Change Password
                    </>
                  )}
              </button>

              <div className='mt-8 pt-6 border-t border-primary/20'>
                <h3 className='text-error font-semibold mb-4 flex items-center gap-2'>
                  <assets.LogOutIcon className='size-4' />
                  Danger Zone
                </h3>
                <button className={DANGER_BTN} onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </form>

          </section>
        </div>
      </div>
    </div>
  )
}

export default Profile
