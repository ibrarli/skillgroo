"use client";

import { useTheme } from "next-themes";
import { Monitor, Moon, Sun, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeSettings() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const themes = [
    { id: "light", label: "Light", icon: <Sun size={20} /> },
    { id: "dark", label: "Dark", icon: <Moon size={20} /> },
    { id: "system", label: "System", icon: <Monitor size={20} /> },
  ];

  return (
    <div className="bg-background border border-foreground/10 rounded-[2.5rem] p-8 shadow-sm transition-colors duration-300">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {themes.map((t) => {
          const isActive = theme === t.id;
          
          return (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`relative flex flex-col items-center justify-center gap-4 p-6 rounded-3xl border-2 transition-all duration-200 ${
                isActive
                  ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                  : "border-foreground/5 hover:border-foreground/20 bg-foreground/[0.02]"
              }`}
            >
              <div className={`${isActive ? "text-primary" : "text-neutral-400"}`}>
                {t.icon}
              </div>
              
              <span className={`text-[10px] font-black uppercase tracking-widest leading-none ${
                isActive ? "text-foreground" : "text-neutral-500"
              }`}>
                {t.label}
              </span>
              
              {isActive && (
                <div className="absolute top-3 right-3 text-primary animate-in zoom-in duration-300">
                  {/* Changed fill to use background variable so it looks "cut out" in both modes */}
                  <CheckCircle2 size={16} fill="var(--background)" strokeWidth={2.5} />
                </div>
              )}
            </button>
          );
        })}
      </div>
      
      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-tight mt-6 text-center">
        Current Mode: <span className="text-primary italic">{theme}</span>
      </p>
    </div>
  );
}