"use client";

import * as React from "react";
import { useTheme } from "next-themes";

import { DropdownMenuItem } from "~/components/ui/dropdown-menu";
import { MoonIcon, SunIcon } from "lucide-react";

export function ThemeToggle({}) {
  const { setTheme, theme } = useTheme();

  const toggleTheme = () => {
    setTimeout(() => {
      setTheme(theme === "dark" ? "light" : "dark");
    }, 200);
  };

  return (
    <DropdownMenuItem onClick={toggleTheme} className="cursor-pointer">
      {theme === "light" ? (
        <>
          <SunIcon className="mr-2.5 inline-block stroke-[1.3px]" />
          Light Mode
        </>
      ) : (
        <>
          <MoonIcon className="mr-2.5 inline-block stroke-[1.3px]" />
          Dark Mode
        </>
      )}
    </DropdownMenuItem>
  );
}
