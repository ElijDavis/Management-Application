'use client'

import { useEffect, useState } from "react";
import { useSupabaseUser } from "../hooks/useSupabase"; // your existing hook
import { updateUser } from "@/utils/auth/auth";

export function useTheme() {
  const { user } = useSupabaseUser();
  const [theme, setTheme] = useState("system");

  // Initialize from localStorage or user metadata
  useEffect(() => {
    const localTheme = localStorage.getItem("theme");
    if (user?.user_metadata?.theme) {
      setTheme(user.user_metadata.theme);
    } else if (localTheme) {
      setTheme(localTheme);
    }
  }, [user]);

  // Apply theme + persist
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark", "theme-sepia", "theme-blue");

    if (theme === "system") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) root.classList.add("dark");
    } else if (theme === "dark") {
      root.classList.add("dark");
    } else if (theme !== "light") {
      root.classList.add(`theme-${theme}`);
    }

    // Persist locally
    localStorage.setItem("theme", theme);

    // Persist to Supabase if logged in
    if (user) {
      updateUser({theme})// to be filled in
    }
  }, [theme, user]);

  return { theme, setTheme };
}
