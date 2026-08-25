import { useEffect, useRef, useState, type JSX } from "react";
import { assets } from "../assets/assets";
import { User2 } from "lucide-react";
import { useTaskManagementContext } from "../context/TaskManagementContext";
import ThemeController from "./ThemeController";
import { createPortal } from "react-dom";

const Navbar = (): JSX.Element => {
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const desktopMenuPopupRef = useRef<HTMLUListElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });

  const {
    navigate,
    currentUser,
    handleLogout: logout,
  } = useTaskManagementContext();

  const handleMenuToggle = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleLogout = () => {
    setIsMenuOpen(false);
    logout();
  };

  // Close the menu when clicking outside of it
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedTrigger = menuRef.current?.contains(target);
      const clickedPopup = desktopMenuPopupRef.current?.contains(target);

      if (!clickedTrigger && !clickedPopup) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) {
        setIsDrawerOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isMenuOpen || !menuButtonRef.current) return;

    const updatePosition = () => {
      const rect = menuButtonRef.current!.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    };

    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    window.visualViewport?.addEventListener("resize", updatePosition);
    window.visualViewport?.addEventListener("scroll", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
      window.visualViewport?.removeEventListener("resize", updatePosition);
      window.visualViewport?.removeEventListener("scroll", updatePosition);
    };
  }, [isMenuOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 bg-base-100/90 backdrop-blur-md shadow-sm border-b border-base-300/20 font-sans">
        <div className="flex items-center justify-between px-4 py-3 md:px-6 max-w-7xl mx-auto transition-all duration-300">
          {/* LOGO */}
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => navigate("/")}
          >
            <div className="relative size-10 sm:size-11 flex items-center justify-center rounded-2xl bg-linear-to-br from-accent via-primary to-accent group-hover:scale-105 transition-all duration-300">
              <assets.BookOpenCheckIcon className=" size-6 sm:size-6.5 text-base-100" />
              <div className="absolute -bottom-1 size-3 bg-base-100 rounded-full shadow-md animate-ping" />
            </div>

            {/* BRAND NAME */}
            <span className="text-lg sm:text-2xl font-extrabold bg-linear-to-r from-primary via-accent to-secondary bg-clip-text text-transparent select-none tracking-wide">
              TaskForce
            </span>
          </div>

          {/* RIGHT SIDE DESKTOP */}
          <div className="hidden sm:flex items-center gap-4">
            <button
              className="p-2 text-neutral dark:text-neutral-content hover:text-primary transition-colors duration-300
              hover:bg-accent/20 dark:hover:bg-accent-content/50 rounded-full cursor-pointer"
              onClick={() => navigate("/profile")}
            >
              <assets.SettingsIcon size={20} />
            </button>

            {/* USER DROPDOWN MENU */}
            <div className="relative" ref={menuRef}>
              <button
                ref={menuButtonRef}
                onClick={handleMenuToggle}
                aria-haspopup="menu"
                aria-expanded={isMenuOpen}
                className="flex items-center gap-3 px-3 py-2 rounded-full cursor-pointer 
                hover:bg-accent/20 dark:hover:bg-accent-content/50 transition-colors duration-300 border border-transparent 
                hover:border-primary/50"
              >
                <div className="relative">
                  {currentUser?.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt="User Avatar"
                      className="size-9 rounded-full shadow-sm"
                    />
                  ) : (
                    <div
                      className="size-8 rounded-full flex items-center justify-center
                    bg-linear-to-br from-primary via-accent to-primary text-base-100 font-semibold
                    shadow-md"
                    >
                      {currentUser?.name?.[0]?.toUpperCase() ?? (
                        <User2 size={16} />
                      )}
                    </div>
                  )}

                  <div
                    className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 
                  rounded-full border-2 border-base-100 animate-pulse"
                  />
                </div>

                <div className="text-left hidden md:block">
                  <p className="text-sm font-medium text-neutral/80 dark:text-neutral-content/80">
                    {currentUser?.name ?? "User"}
                  </p>
                  <p className="text-xs text-neutral/50 dark:text-neutral-content/50 font-normal">
                    {currentUser?.email ?? ""}
                  </p>
                </div>

                <assets.ChevronDownIcon
                  size={16}
                  className={`text-neutral/50 dark:text-neutral-content/50 transition-transform duration-300
                    ${isMenuOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isMenuOpen &&
                createPortal(
                  <ul
                    ref={desktopMenuPopupRef}
                    style={{
                      position: "fixed",
                      top: menuPosition.top,
                      right: menuPosition.right,
                    }}
                    className="w-56 bg-base-100 rounded-2xl shadow-xl border border-primary/20 overflow-hidden z-70 animate-fade-in"
                    role="menu"
                  >
                    <li className="pt-2 px-2">
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          navigate("/profile");
                        }}
                        className="w-full px-4 py-2.5 text-left hover:bg-primary/10 rounded-lg text-sm 
                      text-neutral/70 dark:text-neutral-content/70 transition-colors duration-300 
                      flex items-center gap-2 group cursor-pointer"
                        role="menuitem"
                      >
                        <assets.SettingsIcon
                          size={16}
                          className="text-neutral/70 dark:text-neutral-content/70 group-hover:text-primary transition-colors duration-300"
                        />
                        Profile Setting
                      </button>
                    </li>

                    <li className="p-2">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-lg px-4 py-2.5 text-sm hover:bg-error/10
                      text-error transition-colors duration-300 cursor-pointer"
                        role="menuitem"
                      >
                        <assets.LogOutIcon size={16} className="text-error" />
                        Logout
                      </button>
                    </li>
                  </ul>,
                  document.body
                )}
            </div>

            <div className="hidden sm:flex">
              <ThemeController />
            </div>
          </div>

          <div className="sm:hidden">
            {/* Controls the checkbox living in the fully separate .drawer structure below.
                htmlFor/id association works across any DOM distance, so header stays completely
                independent of the drawer wrapper — nothing in DaisyUI's drawer CSS (overflow,
                grid layout, backdrop-filter interactions, etc.) can ever affect this header again. */}
            <label
              htmlFor="mobile-drawer"
              aria-label="Open menu"
              className="btn btn-ghost btn-circle"
            >
              <assets.MenuIcon className="size-6 text-primary dark:text-accent" />
            </label>
          </div>
        </div>
      </header>

      {/* This wrapper ONLY handles the off-canvas mobile panel now — header has zero
          involvement with it. */}
      <div className="drawer drawer-end">
        <input
          id="mobile-drawer"
          type="checkbox"
          className="drawer-toggle"
          checked={isDrawerOpen}
          onChange={(e) => setIsDrawerOpen(e.target.checked)}
        />

        {/* Required by DaisyUI's sibling-selector CSS structure, intentionally empty —
            the real page content renders elsewhere in the app, outside this component. */}
        <div className="drawer-content" />

        <div className="drawer-side z-50">
          <label
            htmlFor="mobile-drawer"
            aria-label="Close menu"
            className="drawer-overlay"
          ></label>

          <div className="min-h-full w-full min-[260px]:w-[80%] sm:w-72 bg-base-100 p-6 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              {/* LOGO */}
              <div className="flex items-center gap-2 cursor-pointer group">
                <div className="relative size-8 flex items-center justify-center rounded-2xl bg-linear-to-br from-accent via-primary to-accent group-hover:scale-105 transition-all duration-300">
                  <assets.BookOpenCheckIcon className=" size-4.5 text-base-100" />
                </div>

                {/* BRAND NAME */}
                <span className="text-base font-extrabold bg-linear-to-r from-primary via-accent to-secondary bg-clip-text text-transparent select-none tracking-wide">
                  TaskForce
                </span>
              </div>

              <button
                aria-label="Close menu"
                className="btn btn-ghost btn-circle btn-sm"
                onClick={() => setIsDrawerOpen(false)}
              >
                <assets.XIcon className="size-5 text-primary dark:text-accent" />
              </button>
            </div>

            <div className="menu gap-4 -mx-5">
              {/* USER INFO + MOBILE MENU ITEMS — always visible in the drawer, no toggle needed */}
              <div className="relative">
                <div className="flex items-center gap-2 px-3 py-2">
                  <div className="relative">
                    {currentUser?.avatar ? (
                      <img
                        src={currentUser.avatar}
                        alt="User Avatar"
                        className="size-9 rounded-full shadow-sm"
                      />
                    ) : (
                      <div
                        className="size-8 rounded-full flex items-center justify-center
                      bg-linear-to-br from-primary via-accent to-primary text-base-100 font-semibold
                      shadow-md"
                      >
                        {currentUser?.name?.[0]?.toUpperCase() ?? (
                          <User2 size={16} />
                        )}
                      </div>
                    )}

                    <div
                      className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 
                    rounded-full border-2 border-base-100 animate-pulse"
                    />
                  </div>

                  <div className="text-left">
                    <p className="text-sm font-medium text-neutral/80 dark:text-neutral-content/80">
                      {currentUser?.name ?? "User"}
                    </p>
                    <p className="text-xs text-neutral/50 dark:text-neutral-content/50 font-normal">
                      {currentUser?.email ?? ""}
                    </p>
                  </div>
                </div>

                <div className="bg-base-100 rounded-2xl" role="menu">
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setIsDrawerOpen(false);
                        navigate("/profile");
                      }}
                      className="w-full px-3 py-2.5 text-left hover:bg-primary/10 rounded-lg text-md 
                      text-neutral/70 dark:text-neutral-content/70 transition-colors duration-300 
                      flex items-center gap-2 group cursor-pointer"
                      role="menuitem"
                    >
                      <assets.SettingsIcon
                        size={20}
                        className="text-neutral/70 dark:text-neutral-content/70 group-hover:text-primary transition-colors duration-300"
                      />
                      Profile Setting
                    </button>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center px-3 gap-2 rounded-lg py-2.5 text-md hover:bg-error/10
                      text-error transition-colors duration-300 cursor-pointer"
                      role="menuitem"
                    >
                      <assets.LogOutIcon size={20} className="text-error" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-base-300">
              <ThemeController />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
