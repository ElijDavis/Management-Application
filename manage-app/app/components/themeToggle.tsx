'use client'

import React, { useEffect, useState } from "react";

const ThemeToggle = () => {
  const [theme, setTheme] = useState("system");

  // Apply theme to <html> or <body>
  useEffect(() => {
    const root = document.documentElement;

    if (theme === "system") {
      // Detect system preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.remove("theme-sepia", "theme-blue");
      root.classList.toggle("dark", prefersDark);
    } else {
      // Remove system-based dark/light
      root.classList.remove("dark");
      // Apply custom theme class
      root.classList.remove("theme-sepia", "theme-blue");
      if (theme !== "light" && theme !== "dark") {
        root.classList.add(`theme-${theme}`);
      }
    }
  }, [theme]);

  return (
    <div className="flex gap-2 p-4">
      <button onClick={() => setTheme("light")} className="px-3 py-1 rounded bg-background text-foreground">
        Light
      </button>
      <button onClick={() => setTheme("dark")} className="px-3 py-1 rounded bg-background text-foreground">
        Dark
      </button>
      <button onClick={() => setTheme("sepia")} className="px-3 py-1 rounded bg-background text-foreground">
        Sepia
      </button>
      <button onClick={() => setTheme("blue")} className="px-3 py-1 rounded bg-background text-foreground">
        Blue
      </button>
      <button onClick={() => setTheme("system")} className="px-3 py-1 rounded bg-background text-foreground">
        System
      </button>
    </div>
  );
};

export default ThemeToggle;
