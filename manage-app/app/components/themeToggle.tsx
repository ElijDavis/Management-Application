//components/themetoggle

'use client'

import React, { useEffect, useState } from "react";
import { useTheme } from "../hooks/useTheme";

const ThemeToggle = () => {
  const {theme, setTheme} = useTheme();

  //const [theme, setTheme] = useState("system");

  // Apply theme to <html> or <body>
  /*useEffect(() => {
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
  }, [theme]);*/

  return (
    <div className="flex -gap-8 pt-4 pb-4">
      <button onClick={() => setTheme("light")} title="Switch to Light Theme" className="w-10 h-10 z-2 px-3 py-1 rounded-full outline-2 outline-offset-2 outline-foreground bg-white text-foreground"/>
      <button onClick={() => setTheme("dark")} title="Switch to Dark Theme" className="w-10 h-10 z-4 px-3 py-1 rounded-full outline-2 outline-offset-2 outline-foreground bg-black text-foreground"/>
      <button onClick={() => setTheme("sepia")} title="Switch to Sepia Theme" className="w-10 h-10 z-6 px-3 py-1 rounded-full outline-2 outline-offset-2 outline-foreground bg-[#f4ecd8] text-foreground"/>
      <button onClick={() => setTheme("blue")} title="Switch to Blue Theme" className="w-10 h-10 z-8 px-3 py-1 rounded-full outline-2 outline-offset-2 outline-foreground bg-[#e0f2fe] text-foreground"/>
      <button onClick={() => setTheme("system")} title="Switch to System Theme" className="w-10 h-10 z-10 px-3 py-1 rounded-full outline-2 outline-offset-2 outline-foreground bg-background text-foreground"/>
    </div>
  );
};

export default ThemeToggle;
