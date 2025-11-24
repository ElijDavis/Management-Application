//components/themetoggle

'use client'

import React, { useEffect, useState } from "react";
import { useTheme } from "../hooks/useTheme";

const ThemeToggle = () => {
  const {theme, setTheme} = useTheme();

  return (
    <div className="flex -gap-10 pt-4 pb-4">
      <button onClick={() => setTheme("light")} title="Switch to Light Theme" className="w-10 h-10 z-2 px-3 py-1 rounded-full outline-offset-2 bg-white text-foreground"/>
      <button onClick={() => setTheme("dark")} title="Switch to Dark Theme" className="w-10 h-10 z-4 px-3 py-1 rounded-full outline-offset-2 bg-black text-foreground"/>
      <button onClick={() => setTheme("sepia")} title="Switch to Sepia Theme" className="w-10 h-10 z-6 px-3 py-1 rounded-full outline-offset-2 bg-[#f4ecd8] text-foreground"/>
      <button onClick={() => setTheme("blue")} title="Switch to Blue Theme" className="w-10 h-10 z-8 px-3 py-1 rounded-full outline-offset-2 bg-[#e0f2fe] text-foreground"/>
      <button onClick={() => setTheme("system")} title="Switch to System Theme" className="w-10 h-10 z-10 px-3 py-1 rounded-full outline-offset-2 bg-background text-foreground"/>
    </div>
  );
};

export default ThemeToggle;
