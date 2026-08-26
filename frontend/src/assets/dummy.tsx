import type { Priority } from './assets';

import {
  User,
  Mail,
  Home,
  ListChecks,
  CheckCircle2,
  Lock,
  Home as HomeIcon,
  Flame,
  SortDesc,
  SortAsc,
  Award,
  Edit2,
  Trash2,
} from "lucide-react";

// BACKEND TEST
// DUMMY DATA

// const backendDummy = [
//   {
//     title: "Buy groceries",
//     description: "Milk, bread, eggs, and spinach",
//     priority: "Low",
//     dueDate: "2025-05-02T18:00:00.000Z",
//     completed: "No",
//   },
//   {
//     title: "Book dentist appointment",
//     description: "Routine check-up and cleaning",
//     priority: "Medium",
//     dueDate: "2025-05-10T10:00:00.000Z",
//     completed: true,
//   },
//   {
//     title: "Book dentist appointment",
//     description: "Routine check-up and cleaning",
//     priority: "Medium",
//     dueDate: "2025-05-10T10:00:00.000Z",
//     completed: true,
//   },
//   {
//     title: "Pay utility bills",
//     description: "Electricity and water bills for April",
//     priority: "High",
//     dueDate: "2025-04-28T12:00:00.000Z",
//     completed: "Yes",
//   },
// ];

// FRONTEND DUMMY DATA

// assets/formConstants.js

// export const baseControlClasses =
//   "w-full px-4 py-2.5 border border-primary/20 rounded-lg text-sm";

export const focusBaseControlClasses = 
  "flex items-center border border-primary/20 rounded-lg focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all duration-300"
export const baseControlClasses =
  "w-full px-4 py-2.5 rounded-lg text-sm";

export const priorityStyles = {
  Low: "bg-green-100 dark:bg-accent/20 text-green-600 dark:text-accent border-green-600 dark:border-accent/40",
  Medium: "bg-orange-100 dark:bg-primary/20 text-orange-400 dark:text-primary border-orange-600 dark:border-primary/40",
  High: "bg-red-100 dark:bg-secondary/20 text-red-600 dark:text-secondary border-red-600 dark:border-secondary/40",
};


// LOGIN CSS
export const INPUTWRAPPER =
  "flex items-center border border-primary/20 rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all duration-200";

export const BUTTON_CLASSES =
  "w-full bg-gradient-to-r from-secondary to-primary text-base-100 text-sm font-semibold py-2.5 rounded-lg hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer";

// PROFILE CSS
export const INPUT_WRAPPER =
  "flex items-center border border-primary/20 rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all duration-200";
export const FULL_BUTTON =
  "w-full bg-gradient-to-r from-secondary to-primary text-base-100 py-2.5 rounded-lg hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer";
export const SECTION_WRAPPER =
  "bg-base-100 rounded-xl shadow-sm border border-primary/20 p-6";
export const BACK_BUTTON =
  "flex items-center text-neutral/60 dark:text-neutral-content/60 hover:text-primary hover:bg-secondary/20 rounded-full mb-8 py-2 px-3 transition-colors duration-200 cursor-pointer";
export const DANGER_BTN =
  "w-full text-error border border-error/40 py-2.5 rounded-lg hover:bg-error/10 transition-colors duration-200 cursor-pointer";

export const personalFields = [
  { name: "name", type: "text", placeholder: "Full Name", icon: User },
  { name: "email", type: "email", placeholder: "Email", icon: Mail },
];

export const securityFields = [
  { name: "currentPassword", placeholder: "Current Password" },
  { name: "newPassword", placeholder: "New Password" },
  { name: "confirmPassword", placeholder: "Confirm Password" },
];

// SIDEBAR
export const menuItems = [
  { text: "Dashboard", path: "/", icon: <Home className="size-5" /> },
  {
    text: "Pending Tasks",
    path: "/pending",
    icon: <ListChecks className="size-5" />,
  },
  {
    text: "Completed Tasks",
    path: "/complete",
    icon: <CheckCircle2 className="size-5" />,
  },
];

export const SIDEBAR_CLASSES = {
  desktop:
    "hidden lg:flex flex-col fixed h-full w-20 lg:w-64 2xl:w-96 bg-base-100/90 backdrop-blur-sm border-r border-primary/20 shadow-sm z-20 transition-all duration-300",
  mobileButton:
    "absolute lg:hidden top-20 sm:top-18 -left-4 z-40 bg-secondary dark:bg-primary/80 text-base-100 p-3 pl-4 shadow-lg rounded-r-lg hover:bg-primary transition duration-200 cursor-pointer",
  mobileDrawerBackdrop: "fixed inset-0 bg-base-content/40 backdrop-blur-sm",
  mobileDrawer:
  "absolute top-0 left-0 w-full min-[300px]:w-[80%] sm:w-96 h-full bg-base-100/90 backdrop-blur-md border-r border-primary/20 shadow-lg z-50 p-4 flex flex-col space-y-6 transition-transform duration-300 ease-in-out",
};

export const LINK_CLASSES = {
  base: "group flex items-center px-4 py-3 rounded-xl transition-all duration-300",
  active:
    "bg-gradient-to-r from-primary/15 to-primary/10 border-l-4 border-primary/70 text-primary font-medium shadow-sm",
  inactive:
    "hover:bg-primary/10 text-neutral/60 dark:text-neutral-content/60 hover:text-primary",
  icon: "transition-transform duration-300 group-hover:scale-110 text-primary",
  text: "text-sm font-medium ml-2",
};

export const PRODUCTIVITY_CARD = {
  container: "bg-primary/5 rounded-xl p-3 border border-primary/20",
  header: "flex items-center justify-between mb-2",
  label: "text-xs font-semibold text-primary",
  badge: "text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full",
  barBg: "w-full h-2 bg-primary/20 rounded-full overflow-hidden",
  barFg: "h-full bg-gradient-to-r from-secondary to-primary animate-pulse",
};

export const TIP_CARD = {
  container:
    "bg-gradient-to-r from-primary/15 to-primary/10 rounded-xl p-4 border border-primary/20",
  iconWrapper: "p-2 bg-primary/20 rounded-lg",
  title:
    "text-sm font-semibold text-neutral/80 dark:text-neutral-content/80",
  text: "text-xs text-neutral/60 dark:text-neutral-content/60 mt-1",
};

// SIGNUP
export const FIELDS = [
  { name: "name", type: "text", placeholder: "Full Name", icon: User },
  { name: "email", type: "email", placeholder: "Email", icon: Mail },
  { name: "password", type: "password", placeholder: "Password", icon: Lock },
];

export const Inputwrapper =
  "flex items-center border border-primary/20 rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all duration-200";
export const BUTTONCLASSES =
  "w-full bg-gradient-to-r from-secondary to-primary text-base-100 text-sm font-semibold py-2.5 rounded-lg hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer";
export const MESSAGE_SUCCESS =
  "bg-success/20 text-success p-3 rounded-lg text-sm mb-4 border border-success/40";
export const MESSAGE_ERROR =
  "bg-error/20 text-error p-3 rounded-lg text-sm mb-4 border border-error/40";

// TASK ITEM
export const getPriorityColor = (priority: Priority) => {
  const colors: Record<Priority, string> = {
    Low: "border-green-600 dark:border-accent/40 bg-green-100 dark:bg-accent/20 text-green-600 dark:text-accent",
    Medium: "border-orange-400 dark:border-primary/40 bg-orange-100 dark:bg-primary/20 text-orange-400 dark:text-primary",
    High: "border-red-600 dark:border-secondary/40 bg-red-100 dark:bg-secondary/20 text-red-600 dark:text-secondary",
  };
  return (
    colors[priority] ||
    "border-neutral/50 dark:border-neutral-content/50 bg-neutral/5 dark:bg-neutral-content/5 text-neutral/70 dark:text-neutral-content/70"
  );
};


export const getPriorityBadgeColor = (priority: Priority) => {
  const colors: Record<Priority, string> = {
    Low: "bg-green-200 dark:bg-accent/15 text-green-700 dark:text-accent/80",
    Medium: "bg-orange-200 dark:bg-primary/15 text-orange-500 dark:text-primary/80",
    High: "bg-red-200 dark:bg-secondary/15 text-red-600 dark:text-secondary/80",
  };

  return colors[priority] || "bg-neutral/10 dark:bg-neutral-content/10 text-neutral/70 dark:text-neutral-content/70";
};

// DASHBOARD
// UI Constants
export const WRAPPER = "p-1 md:p-6 min-h-screen overflow-hidden";
export const HEADER =
  "flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6 gap-3";
export const ADD_BUTTON =
  "flex items-center gap-2 bg-gradient-to-r from-secondary to-primary text-base-100 px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 w-full md:w-auto justify-center text-sm md:text-base cursor-pointer";
export const STATS_GRID =
  "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8";
export const STAT_CARD =
  "p-3 md:p-4 rounded-xl bg-base-100 shadow-sm border hover:shadow-md transition-all duration-300 min-w-0";
export const ICON_WRAPPER = "p-1.5 md:p-2 rounded-lg";
export const VALUE_CLASS = "text-lg md:text-2xl font-bold truncate";
export const LABEL_CLASS = "text-xs text-neutral/50 dark:text-neutral-content/50 truncate";

// Stats definitions
export const STATS = [
  {
    key: "total",
    label: "Total Tasks",
    icon: HomeIcon,
    iconColor: "bg-primary/20 text-primary",
    valueKey: "total",
    gradient: true,
  },
  {
    key: "lowPriority",
    label: "Low Priority",
    icon: Flame,
    iconColor: "bg-green-100 text-green-600",
    borderColor: "border-green-100 dark:border-green-800",
    valueKey: "lowPriority",
    textColor: "text-green-600",
  },
  {
    key: "mediumPriority",
    label: "Medium Priority",
    icon: Flame,
    iconColor: "bg-orange-100 text-orange-600",
    borderColor: "border-orange-100 dark:border-orange-400",
    valueKey: "mediumPriority",
    textColor: "text-orange-600",
  },
  {
    key: "highPriority",
    label: "High Priority",
    icon: Flame,
    iconColor: "bg-red-100 text-red-500",
    borderColor: "border-red-100 dark:border-red-800",
    valueKey: "highPriority",
    textColor: "text-red-500",
  },
];

// Filter options
export const FILTER_OPTIONS = ["all", "overdue", "today", "week", "month", "high", "medium", "low"];
export const FILTER_LABELS = {
  all: "All Tasks",
  overdue: "Overdue",
  today: "Today's Tasks",
  week: "This Week",
  month: "This Month",
  high: "High Priority",
  medium: "Medium Priority",
  low: "Low Priority",
};

// Empty state
export const EMPTY_STATE = {
  wrapper:
    "p-6 bg-base-100 rounded-xl shadow-sm border border-primary/20 text-center",
  iconWrapper:
    "size-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4",
  btn: "px-4 py-2 bg-gradient-to-r from-secondary to-primary text-base-100 rounded-lg text-sm font-medium mt-3 cursor-pointer",
};

// Filter UI Constants
export const FILTER_WRAPPER =
  "flex items-center justify-between bg-base-100 p-4 rounded-xl shadow-sm gap-1 ";
export const SELECT_CLASSES =
  "px-2 sm:px-3 py-1.5 sm:py-2 border border-primary/20 rounded-lg focus:ring-2 focus:ring-primary md:hidden text-xs sm:text-sm";
export const TABS_WRAPPER =
  "hidden md:flex space-x-1 bg-primary/10 p-1 rounded-lg";
export const TAB_BASE =
  "px-3 xl:px-2 2xl:px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer";
export const TAB_ACTIVE = "bg-base-100 text-primary shadow-sm border";
export const TAB_INACTIVE =
  "text-neutral/60 dark:text-neutral-content/60 hover:bg-primary/10";

// COMPLETE TASK
export const SORT_OPTIONS = [
  { id: "newest", label: "Newest", icon: <SortDesc className="size-3" /> },
  { id: "oldest", label: "Oldest", icon: <SortAsc className="size-3" /> },
  { id: "priority", label: "Priority", icon: <Award className="size-3" /> },
];

// CSS class groups
export const CT_CLASSES = {
  page: "p-4 md:p-6 min-h-screen overflow-hidden",
  header:
    "flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-3 md:gap-4",
  titleWrapper: "flex-1 min-w-0",
  title:
    "text-xl md:text-2xl lg:text-3xl font-bold text-neutral/80 dark:text-neutral-content/80 flex items-center gap-2 truncate",
  subtitle: "text-xs md:text-sm text-neutral/50 dark:text-neutral-content/50 mt-1 ml-7 md:ml-8",
  sortContainer: "w-full md:w-auto mt-2 md:mt-0",
  sortBox:
    "flex items-center justify-between bg-base-100 p-2 md:p-3 rounded-xl shadow-sm border border-primary/20 w-full md:w-auto",
  filterLabel:
    "flex items-center gap-2 text-neutral/70 dark:text-neutral-content/70 font-medium",
  select:
    "px-2 py-1 md:px-3 md:py-2 border border-primary/20 rounded-lg focus:ring-2 focus:ring-primary md:hidden text-xs md:text-sm",
  btnGroup:
    "hidden md:flex space-x-1 bg-primary/10 p-1 rounded-lg ml-2 md:ml-3",
  btnBase:
    "px-2 py-1 md:px-3 md:py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1 cursor-pointer",
  btnActive: "bg-base-100 text-primary shadow-sm border border-primary/20",
  btnInactive:
    "text-neutral/60 dark:text-neutral-content/60 hover:text-primary hover:bg-primary/10",
  list: "space-y-3 md:space-y-4",
  emptyState:
    "p-4 md:p-8 bg-base-100 rounded-xl shadow-sm border border-primary/20 text-center",
  emptyIconWrapper:
    "size-12 md:size-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4",
  emptyTitle:
    "text-base md:text-lg font-semibold text-neutral/80 dark:text-neutral-content/80 mb-2",
  emptyText: "text-xs md:text-sm text-neutral/50 dark:text-neutral-content/50",
};

// constants/cssClasses.js
export const layoutClasses = {
  container: "p-4 md:p-6 min-h-screen overflow-hidden",
  headerWrapper:
    "flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4",
  sortBox:
    "flex items-center justify-between bg-base-100 p-3 rounded-xl shadow-sm border border-primary/20 w-full md:w-auto",
  select:
    "px-2 py-1 border border-primary/20 rounded-lg focus:ring-2 focus:ring-primary md:hidden text-xs",
  tabWrapper: "hidden md:flex space-x-1 bg-primary/10 p-1 rounded-lg ml-3",
  tabButton: (active: boolean) =>
      `px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${active
          ? "bg-base-100 text-primary shadow-sm border border-primary/20"
          : "text-neutral/60 dark:text-neutral-content/60 hover:text-primary hover:bg-primary/10"
      }`,
  addBox:
    "hidden md:block p-5 border-2 border-dashed border-primary/40 rounded-xl hover:border-primary/80 transition-colors cursor-pointer mb-6 bg-primary/5 group",
  emptyState:
    "p-8 bg-base-100 rounded-xl shadow-sm border border-primary/20 text-center",
  emptyIconBg:
    "size-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4",
  emptyBtn:
    "px-4 py-2 bg-primary/20 hover:bg-primary/40 text-primary rounded-lg text-sm font-medium transition-colors",
};

// TASK ITEM
// Menu options for task actions
export const MENU_OPTIONS = [
  {
    action: "edit",
    label: "Edit Task",
    icon: <Edit2 size={14} className="text-primary" />,
  },
  {
    action: "delete",
    label: "Delete Task",
    icon: <Trash2 size={14} className="text-error" />,
  },
];

// CSS class groups for TaskItem
export const TI_CLASSES = {
  wrapper:
    "group p-4 sm:p-5 rounded-xl shadow-sm bg-base-100 border-l-4 hover:shadow-md transition-all duration-300 border",
  leftContainer: "flex items-start gap-2 sm:gap-3 flex-1 min-w-0",
  completeBtn:
    "mt-0.5 sm:mt-1 p-1 sm:p-1.5 rounded-full hover:bg-primary/20 transition-colors duration-300 cursor-pointer",
  checkboxIconBase: "size-4 sm:w-5 sm:h-5",
  titleBase: "text-base sm:text-lg font-medium truncate",
  priorityBadge: "text-xs px-2 py-0.5 rounded-full shrink-0",
  description: "text-sm text-neutral/50 dark:text-neutral-content/50 mt-4 md:mt-1 ",
  subtasksContainer:
    "mt-3 sm:mt-4 space-y-2 sm:space-y-3 bg-primary/5 p-2 sm:p-3 rounded-lg border border-primary/20",
  progressBarBg: "h-1.5 bg-primary/20 rounded-full overflow-hidden",
  progressBarFg:
    "h-full bg-gradient-to-r from-secondary to-primary transition-all duration-300",
  rightContainer: "flex flex-col items-end gap-2 sm:gap-3 mt-4 md:mt-0",
  menuButton:
    "p-1 sm:p-1.5 hover:bg-primary/20 rounded-lg text-neutral/50 dark:text-neutral-content/50 hover:text-primary transition-colors duration-200 cursor-pointer",
  menuDropdown:
    "absolute right-0 mt-1 w-40 sm:w-48 bg-base-100 border border-primary/20 rounded-xl shadow-lg z-10 overflow-hidden animate-fade-in",
  dateRow: "flex items-center gap-1.5 text-xs font-medium whitespace-nowrap",
  createdRow:
    "flex items-center gap-1.5 text-xs text-gray-400 whitespace-nowrap",
};

// APP.JSX
// const user = {
//     avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name || 'User')}&background=random`
// };
