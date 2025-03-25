'use client';

import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { SunIcon, MoonIcon } from 'lucide-react';

export function ThemeToggleButton() {
  const { theme, setTheme } = useTheme();

  return (
    <Button variant="ghost" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
      Toggle Theme
    </Button>
  );
}
