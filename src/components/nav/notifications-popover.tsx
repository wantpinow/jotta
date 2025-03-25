'use client';

import { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export default function NotificationsPopover() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center justify-center p-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-transparent"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span
              className={cn(
                'absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-primary transition-all',
                open ? 'opacity-0' : 'opacity-100',
              )}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="end">
          <div className="flex flex-col">
            <div className="border-b px-4 py-3">
              <h3 className="text-sm font-medium">Notifications</h3>
            </div>
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-3">
                <Bell className="h-6 w-6 text-muted-foreground" />
              </div>
              <h4 className="text-sm font-medium">No notifications</h4>
              <p className="text-xs text-muted-foreground mt-1">
                You&apos;re all caught up! We&apos;ll notify you when something new
                arrives.
              </p>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
