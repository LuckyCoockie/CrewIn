import React from "react";
import { useTheme } from "./useTheme";
import { Moon, Sun } from "lucide-react";

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      className="relative w-10 h-4 bg-sub rounded-full cursor-pointer transition-colors duration-300"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {/* Sliding toggle */}
      <div
        className={`absolute top-1/2 -translate-y-1/2 w-9 h-9 bg-background rounded-full shadow-sm shadow-sub transition-all duration-300 ease-in-out
        ${
          theme === "light"
            ? "left-0 -translate-x-1/2"
            : "right-0 translate-x-1/2"
        }`}
      >
        {/* Icon inside the toggle */}
        <div className="flex items-center justify-center w-full h-full">
          {theme === "light" ? (
            <Sun className="text-yellow-500" size={24} strokeWidth={2.5} />
          ) : (
            <Moon className="text-sub" size={24} strokeWidth={2.5} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ThemeToggle;
