//hooks/useTheme

'use client'

import { useEffect, useState, useRef } from "react";
import { useSupabaseUser } from "../hooks/useSupabase";
import { updateUser } from "@/utils/auth/auth";

export function useTheme() {
  const { user } = useSupabaseUser();
  const [theme, setTheme] = useState("system");
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize from Supabase or localStorage
  useEffect(() => {
    const localTheme = localStorage.getItem("theme");
    if (user?.user_metadata?.theme) {
      setTheme(user.user_metadata.theme);
    } else if (localTheme) {
      setTheme(localTheme);
    }
  }, [user]);

  // Apply theme immediately
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark", "theme-sepia", "theme-blue", "theme-green");

    if (theme === "system") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) root.classList.add("dark");
    } else if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.add(`theme-${theme}`);
    }

    // Persist locally
    localStorage.setItem("theme", theme);

    // Debounced Supabase update
    if (user) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        if (user.user_metadata?.theme !== theme) {
          updateUser({ theme });
        }
      }, 1000); // waits 1s after last toggle
    }
  }, [theme, user]);

  return { theme, setTheme };
}
