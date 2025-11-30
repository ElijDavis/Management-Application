//components/themetoggle

/*'use client'

import { useTheme } from "../hooks/useTheme";

const ThemeToggle = () => {
  const {theme, setTheme} = useTheme();

  return (
    <div className="inline-flex -space-x-2 p-4 *:rounded-full border-2 border-gray-400 bg-transparent">
      <button onClick={() => setTheme("light")} title="Switch to Light Theme" className="w-10 h-10 bg-white text-foreground"/>
      <button onClick={() => setTheme("dark")} title="Switch to Dark Theme" className="w-10 h-10 bg-black text-foreground"/>
      <button onClick={() => setTheme("sepia")} title="Switch to Sepia Theme" className="w-10 h-10 bg-[#f4ecd8] text-foreground"/>
      <button onClick={() => setTheme("blue")} title="Switch to Blue Theme" className="w-10 h-10 bg-[#e0f2fe] text-foreground"/>
      <button onClick={() => setTheme("system")} title="Switch to System Theme" className="w-10 h-10 bg-background text-foreground"/>
    </div>
  );
};

export default ThemeToggle;*/

// components/ThemeToggle.tsx
'use client'

import { useTheme } from "../hooks/useTheme";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="inline-flex items-center gap-2 p-2 border-2 border-gray-400 rounded-full bg-transparent overflow-hidden">
      <button
        onClick={() => setTheme("light")}
        title="Switch to Light Theme"
        className="w-10 h-10 rounded-full bg-white text-foreground"
      />
      <button
        onClick={() => setTheme("dark")}
        title="Switch to Dark Theme"
        className="w-10 h-10 rounded-full bg-black text-foreground"
      />
      <button
        onClick={() => setTheme("sepia")}
        title="Switch to Sepia Theme"
        className="w-10 h-10 rounded-full bg-[#f4ecd8] text-foreground"
      />
      <button
        onClick={() => setTheme("blue")}
        title="Switch to Blue Theme"
        className="w-10 h-10 rounded-full bg-[#e0f2fe] text-foreground"
      />
      <button
        onClick={() => setTheme("system")}
        title="Switch to System Theme"
        className="w-10 h-10 rounded-full bg-background text-foreground"
      />
    </div>
  );
};

export default ThemeToggle;

