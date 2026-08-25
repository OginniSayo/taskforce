import { useEffect, useRef, useState, type JSX } from "react";
import { createPortal } from "react-dom";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { assets } from "../assets/assets";
import { formatLocalDate, parseLocalDate } from "../utils/dateHelpers";

type DatePickerProps = {
  value: string;
  onChange: (isoDate: string) => void;
  min?: string;
  id?: string;
};

const dayPickerClassNames = {
  months: "flex",
  month: "space-y-3",
  month_caption:
    "flex justify-center items-center h-8 text-sm font-semibold text-neutral/80 dark:text-neutral-content/80",
  nav: "flex items-center justify-between absolute inset-x-0 top-0 px-1",
  button_previous:
    "p-1 rounded-lg hover:bg-primary/20 text-primary transition-colors duration-200 cursor-pointer",
  button_next:
    "p-1 rounded-lg hover:bg-primary/20 text-primary transition-colors duration-200 cursor-pointer",
  month_grid: "w-full border-collapse",
  weekdays: "flex",
  weekday:
    "w-8 text-xs font-medium text-neutral/50 dark:text-neutral-content/50",
  week: "flex w-full mt-1",
  day: "size-8 text-center text-sm p-0 relative",
  day_button:
    "size-8 rounded-lg hover:bg-primary/20 transition-colors duration-200 cursor-pointer text-neutral/70 dark:text-neutral-content/70",
  selected:
    "[&>button]:bg-primary [&>button]:text-base-100 [&>button]:hover:bg-primary/90",
  today:
    "[&>button]:font-bold [&>button]:ring-1 [&>button]:ring-inset [&>button]:ring-primary/60",
  disabled:
    "[&>button]:opacity-30 [&>button]:cursor-not-allowed [&>button]:hover:bg-transparent",
  outside: "[&>button]:text-neutral/30 dark:[&>button]:text-neutral-content/30",
  chevron: "fill-current text-primary",
};

const DatePicker = ({
  value,
  onChange,
  min,
  id,
}: DatePickerProps): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const selectedDate = value ? parseLocalDate(value) : undefined;
  const minDate = min ? parseLocalDate(min) : undefined;

  // Track viewport width to switch between an anchored dropdown (desktop) and a centered sheet (mobile)
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 640px)");
    setIsMobile(mql.matches);

    const handleChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  // Compute the popup's fixed-position coordinates from the trigger button's real screen position (desktop only)
  useEffect(() => {
    if (!isOpen || isMobile || !triggerRef.current) return;

    const updatePosition = () => {
      const rect = triggerRef.current!.getBoundingClientRect();
      setPosition({ top: rect.bottom + 8, left: rect.left });
    };

    updatePosition();
    // Keep it aligned if the page scrolls or resizes while open
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen, isMobile]);

  // Close on outside click — checks both the trigger and the portaled popup
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        popupRef.current &&
        !popupRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleSelect = (date: Date | undefined) => {
    if (!date) return;
    onChange(formatLocalDate(date));
    setIsOpen(false);
  };

  return (
    <>
      <button
        type="button"
        id={id}
        ref={triggerRef}
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between border border-primary/20 rounded-lg px-3 py-2.5
        focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300
        text-sm text-neutral/80 dark:text-neutral-content/80 bg-transparent cursor-pointer"
      >
        <span
          className={
            selectedDate ? "" : "text-neutral/50 dark:text-neutral-content/50"
          }
        >
          {selectedDate ? selectedDate.toLocaleDateString() : "Select a date"}
        </span>
        <assets.CalendarIcon className="size-4 text-primary shrink-0" />
      </button>

      {isOpen &&
        createPortal(
          isMobile ? (
            <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/30 animate-fade-in">
              <div
                ref={popupRef}
                className="w-full max-w-xs max-h-[80vh] overflow-y-auto overscroll-contain
              bg-base-100 dark:bg-base-200 border border-primary/20 rounded-xl shadow-lg p-3"
              >
                <DayPicker
                  mode="single"
                  selected={selectedDate}
                  defaultMonth={selectedDate ?? new Date()}
                  onSelect={handleSelect}
                  disabled={minDate ? { before: minDate } : undefined}
                  classNames={dayPickerClassNames}
                />
              </div>
            </div>
          ) : (
            <div
              ref={popupRef}
              style={{
                position: "fixed",
                top: position.top,
                left: position.left,
              }}
              className="z-70 bg-base-100 dark:bg-base-200 border border-primary/20
            rounded-xl shadow-lg p-3 animate-fade-in"
            >
              <DayPicker
                mode="single"
                selected={selectedDate}
                defaultMonth={selectedDate ?? new Date()}
                onSelect={handleSelect}
                disabled={minDate ? { before: minDate } : undefined}
                classNames={dayPickerClassNames}
              />
            </div>
          ),
          document.body
        )}
    </>
  );
};

export default DatePicker;
