"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="flex items-center rounded-xl bg-slate-100 dark:bg-white/5 p-1">
        <div className="h-8 w-8 sm:h-7 sm:w-7" />
        <div className="h-8 w-8 sm:h-7 sm:w-7" />
        <div className="h-8 w-8 sm:h-7 sm:w-7" />
      </div>
    );
  }

  const options = [
    { value: "light", icon: Sun, label: "Light" },
    { value: "dark", icon: Moon, label: "Dark" },
    { value: "system", icon: Monitor, label: "System" },
  ] as const;

  return (
    <div className="flex items-center rounded-xl bg-slate-100 dark:bg-white/5 p-1">
      {options.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={`relative flex h-8 w-8 sm:h-7 sm:w-7 items-center justify-center rounded-lg transition-all duration-200 ${
            theme === value
              ? "bg-white dark:bg-white/15 text-blue-600 dark:text-blue-400 shadow-sm"
              : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
          }`}
          title={label}
        >
          <Icon className="h-3.5 w-3.5" />
        </button>
      ))}
    </div>
  );
}
