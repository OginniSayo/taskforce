import { useContext, createContext, useState, useEffect, useCallback,
   type Dispatch, type SetStateAction } from "react";
import type { JSX, ReactNode } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";
import { getAuthStorage } from '../utils/authStorage';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  token?: string;
}

interface AuthSubmitData {
  email: string;
  name?: string;
  token: string;
  id: string;
  rememberMe?: boolean;
}
interface TaskManagementContextType {
  navigate: NavigateFunction
  currentUser: User | null;
  setCurrentUser: Dispatch<SetStateAction<User | null>>;
  handleAuthSubmit: (data: AuthSubmitData) => void;
  handleLogout: () => void;
}

const TaskManagementContext = createContext<TaskManagementContextType | undefined>(undefined);

export function useTaskManagementContext() {
  const context = useContext(TaskManagementContext);
  if (context === undefined) {
    throw new Error('useTaskManagementContext must be used within a TaskManagementProvider');
  }
  return context;
}

const TaskManagementContextProvider = ({ children }: { children: ReactNode }): JSX.Element => {

  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const stored = getAuthStorage().getItem('currentUser'); 
    // localStorage.getItem('...') or sessionStorage.getItem('...') based on rememberMe
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    const storage = getAuthStorage();
    if (currentUser) {
      storage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      storage.removeItem('currentUser');
    }
  }, [currentUser]);

  const handleAuthSubmit = useCallback((data: AuthSubmitData): void => {
    const user: User = {
      id: data.id,
      email: data.email,
      name: data.name || 'User',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name || 'User')}&background=random`,
    };
  
    localStorage.setItem('rememberMe', String(data.rememberMe ?? false));
  
    const storage = getAuthStorage();
    storage.setItem('token', data.token);
    storage.setItem('currentUser', JSON.stringify(user));
  
    setCurrentUser(user);
    navigate('/', { replace: true });
  }, []);

  const handleLogout = useCallback((): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('rememberMe');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('currentUser');
    setCurrentUser(null);
    navigate('/login', { replace: true });
  }, []);


  const value: TaskManagementContextType = {
    navigate,
    currentUser, setCurrentUser,
    handleAuthSubmit, handleLogout,
  };

  return (
    <TaskManagementContext.Provider value={value}>
      {children}
    </TaskManagementContext.Provider>
  );
};

export default TaskManagementContextProvider;