import { 
  SunIcon, 
  MoonIcon,
  NotebookIcon,
  BookOpenCheckIcon,
  SettingsIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  LogOutIcon,
  TrendingUpIcon,
  CircleIcon,
  ZapIcon,
  ClockIcon,
  UserPlus2Icon,
  MoreVerticalIcon,
  CalendarIcon,
  LoaderIcon,
  LogInIcon,
  EyeOffIcon,
  EyeIcon,
  MailIcon,
  LockIcon,
  CheckIcon,
  EllipsisIcon,
  MenuIcon,
  XIcon,
  SparklesIcon,
  LightbulbIcon,
  UserCircleIcon,
  SaveIcon,
  ShieldIcon,
  HomeIcon,
  PlusIcon,
  FilterIcon,
  ChevronRightIcon,
  PlusCircleIcon,
  AlignLeftIcon,
  FlagIcon,
  CheckCircleIcon,
  CheckCircle2Icon,
  AlertTriangleIcon,
  ListChecksIcon,
} from 'lucide-react'

export const assets = {
  SunIcon,
  MoonIcon,
  NotebookIcon,
  BookOpenCheckIcon,
  SettingsIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  LogOutIcon,
  TrendingUpIcon,
  CircleIcon,
  ZapIcon,
  ClockIcon,
  UserPlus2Icon,
  MoreVerticalIcon,
  CalendarIcon,
  LoaderIcon,
  LogInIcon,
  EyeOffIcon,
  EyeIcon,
  MailIcon,
  LockIcon,
  CheckIcon,
  EllipsisIcon,
  MenuIcon,
  XIcon,
  SparklesIcon,
  LightbulbIcon,
  UserCircleIcon,
  SaveIcon,
  ShieldIcon,
  HomeIcon,
  PlusIcon,
  FilterIcon,
  ChevronRightIcon,
  PlusCircleIcon,
  AlignLeftIcon,
  FlagIcon,
  CheckCircleIcon,
  CheckCircle2Icon,
  AlertTriangleIcon,
  ListChecksIcon,
}

export type Priority = 'Low' | 'Medium' | 'High';

// The shape of a task once it exists in the database — always complete
export type Task = {
  _id: string;
  title: string;
  description: string;
  priority: Priority;
  dueDate: string;
  owner: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

// The shape of a task being created/edited in a form, before it's saved —
// derived from Task so it can never drift out of sync with it
export type TaskDraft = Omit<Task, '_id' | 'owner' | 'createdAt' | 'updatedAt'> & {
  _id?: string; // present only when editing an existing task
}