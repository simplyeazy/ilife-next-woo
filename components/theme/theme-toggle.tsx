"use client";

import * as React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

const iconClasses =
  "h-[1.2rem] w-[1.2rem] transition-all absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch — only render after mount
  React.useEffect(() => setMounted(true), []);

  const handleClick = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        aria-label="Toggle theme"
        disabled
      >
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleClick}
      aria-label={`Toggle theme (current: ${theme})`}
      title={`Current: ${theme}. Click to switch.`}
      className="relative"
    >
      <Sun
        className={
          theme === "light"
            ? `${iconClasses} rotate-0 scale-100 opacity-100`
            : `${iconClasses} rotate-90 scale-0 opacity-0 pointer-events-none`
        }
      />
      <Moon
        className={
          theme === "dark"
            ? `${iconClasses} rotate-0 scale-100 opacity-100`
            : `${iconClasses} rotate-90 scale-0 opacity-0 pointer-events-none`
        }
      />
      <Monitor
        className={
          theme === "system"
            ? `${iconClasses} rotate-0 scale-100 opacity-100`
            : `${iconClasses} rotate-90 scale-0 opacity-0 pointer-events-none`
        }
      />
    </Button>
  );
}
