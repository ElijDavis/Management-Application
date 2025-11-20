"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"system" | "light" | "dark">("system");

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "dark") root.classList.add("dark");
    if (theme === "light") root.classList.add("light");
    // if "system", rely on prefers-color-scheme (your CSS already handles it)
  }, [theme]);

  return (
    <div className="flex justify-center w-[30%] mb-4 gap-2 text-black bg-gray-100 *:hover:bg-black/10">
      <button onClick={() => setTheme("system")}>System</button>
      <p>|</p>
      <button onClick={() => setTheme("light")}>Light</button>
      <p>|</p>
      <button onClick={() => setTheme("dark")}>Dark</button>
    </div>
  );
}
